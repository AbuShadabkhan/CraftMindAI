import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import getSql from "../configs/db.js";
import FormData from "form-data"; 

//  HELPER: Smart Credit System (Per Tool, Per Day)
async function checkToolLimit(userId, toolType, req) {
  if (!userId) return { allowed: false, message: "User not logged in" };

  // Auth middleware se plan nikalna
  const plan = req.plan || req.user?.plan || req.auth?.plan || 'free';
  const limit = plan === 'pro' ? 50 : 5; 

  const sql = getSql();
  if (!sql) return { allowed: true }; 

  try {
    const result = await sql`
      SELECT count(*) as count 
      FROM creations 
      WHERE user_id = ${userId} 
        AND type = ${toolType}
        AND DATE(created_at) = CURRENT_DATE
    `;
    const usage = parseInt(result[0].count);
    return { allowed: usage < limit, limit, usage, plan };
  } catch (err) {
    console.error("Credit check DB error:", err.message);
    return { allowed: true }; 
  }
}

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt, length } = req.body || {};

    //  CREDIT CHECK
    const limitCheck = await checkToolLimit(userId, 'article', req);
    if (!limitCheck.allowed) {
      return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Article Generation today. Upgrade to Pro for more!` });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const lengthInstruction = length || 'Long (1200-1600 words)';

    const enhancedPrompt = `You are an expert professional content writer. Write a comprehensive, well-structured, and highly engaging article about the following topic: "${prompt}".

    STRICT LENGTH REQUIREMENT:
    You MUST write an article that strictly follows this length: ${lengthInstruction}.
    - If the user selected "Long (1200-1600 words)", you MUST write at least 1500 words. Expand deeply with detailed sections, subheadings, real-world examples, and statistics.
    - DO NOT stop generating until the article is completely finished. It must have a proper beginning, middle, and end.

    FORMATTING RULES:
    1. Start with a catchy and bold Title.
    2. Break the content into well-spaced paragraphs and use clear Subheadings (##) to make it readable.
    3. CRITICAL: Always provide a definitive Conclusion at the very end. Never leave a sentence incomplete.`;

    const generationConfig = { 
        maxOutputTokens: 8192,
        temperature: 0.7, 
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
      generationConfig
    });

    const content = result.response.text();

    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO creations (user_id, prompt, content, type)
          VALUES (${userId}, ${prompt}, ${content}, 'article')
        `;
      } catch (dbErr) {
        console.log("DB save note:", dbErr.message);
      }
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Generate article error:", error);
    res.json({ success: false, error: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt } = req.body || {};

    //  CREDIT CHECK
    const limitCheck = await checkToolLimit(userId, 'blog_title', req);
    if (!limitCheck.allowed) {
      return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Blog Titles today. Upgrade to Pro for more!` });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const enhancedPrompt = `Generate a catchy and SEO-friendly blog title for this topic: "${prompt}". Just return the title, no extra text.`;
    
    const result = await model.generateContent(enhancedPrompt);
    const content = result.response.text().trim();

    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO creations (user_id, prompt, content, type)
          VALUES (${userId}, ${prompt}, ${content}, 'blog_title')
        `;
      } catch (dbErr) {
        console.log("DB save note:", dbErr.message);
      }
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("Generate blog title error:", error);
    res.json({ success: false, error: error.message });
  }
};

//  100% Free Cloud Image Generation (Pollinations AI)
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt, publish } = req.body || {};

    //  CREDIT CHECK
    const limitCheck = await checkToolLimit(userId, 'image', req);
    if (!limitCheck.allowed) {
      return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Image Generation today. Upgrade to Pro for more!` });
    }

    const defaultPrompt = "shot of vaporwave fashion dog in miami";
    const finalPrompt = prompt ? prompt : defaultPrompt;
    
    const safePrompt = encodeURIComponent(finalPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=512&height=512&nologo=true`;

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", 
    });

    const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data).toString("base64")}`;

    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO creations (user_id, prompt, content, type, publish)
          VALUES (${userId}, ${prompt}, ${base64Image}, 'image', ${publish ?? false})
        `;
      } catch (dbError) {
        console.log("Database operation failed:", dbError.message);
      }
    }

    res.json({ success: true, content: base64Image });
  } catch (error) {
    console.error("Generate image error:", error.message);
    res.status(500).json({ success: false, error: error.message || "Failed to generate image" });
  }
};

//  Remove.bg API (Background Removal ke liye - Fast & Unblocked)
export const removeImageBackground = async (req, res) => {
  const { userId } = req.auth || {};
  const image = req.file;

  if (!image) {
    return res.status(400).json({ success: false, message: "No image uploaded." });
  }

  //  CREDIT CHECK
  const limitCheck = await checkToolLimit(userId, 'remove-bg', req);
  if (!limitCheck.allowed) {
    return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Background Removal today. Upgrade to Pro for more!` });
  }

  try {
    const form = new FormData();
    form.append('size', 'auto');
    form.append('image_file', fs.createReadStream(image.path));

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_API_KEY, 
        },
        responseType: "arraybuffer",
      }
    );

    const outputUrl = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;
    await saveToDatabase(userId, 'Remove Background from image', outputUrl, 'remove-bg');
    
    return res.status(200).json({ success: true, kind: "real", content: outputUrl });
  } catch (error) {
    console.error("Remove.bg Error:", error?.response?.data?.toString() || error.message);
    return res.status(500).json({ success: false, error: "Background removal failed" });
  }
};

//  ClipDrop API (Object Removal ke liye - Using your 100 Free Credits)
export const removeImageObject = async (req, res) => {
  const { userId } = req.auth || {};
  const image = req.files?.image?.[0];
  const mask = req.files?.mask?.[0];

  if (!image || !mask) {
    return res.status(400).json({ success: false, message: "Image and mask required" });
  }

  //  CREDIT CHECK
  const limitCheck = await checkToolLimit(userId, 'remove-object', req);
  if (!limitCheck.allowed) {
    return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Object Removal today. Upgrade to Pro for more!` });
  }

  try {
    const form = new FormData();
    form.append('image_file', fs.createReadStream(image.path));
    form.append('mask_file', fs.createReadStream(mask.path));

    const response = await axios.post(
      "https://clipdrop-api.co/cleanup/v1",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY, 
        },
        responseType: "arraybuffer",
      }
    );

    const outputUrl = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;
    await saveToDatabase(userId, "Removed object from image", outputUrl, 'remove-object');
    
    return res.status(200).json({ success: true, kind: "real", content: outputUrl });
  } catch (error) {
    console.error("ClipDrop Object Remove Error:", error?.response?.data?.toString() || error.message);
    return res.status(500).json({ success: false, error: "Object removal failed" });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({ success: false, error: "No resume file uploaded." });
    }

    //  CREDIT CHECK
    const limitCheck = await checkToolLimit(userId, 'resume-review', req);
    if (!limitCheck.allowed) {
      return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Resume Review today. Upgrade to Pro for more!` });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);
    const pdfText = pdfData.text || "";
    try { fs.unlinkSync(resume.path); } catch (e) {}

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and recommendations: \n\n${pdfText}`;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO creations (user_id, prompt, content, type)
          VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;
      } catch (dbError) {}
    }

    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateWebsite = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt } = req.body || {};
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    //  CREDIT CHECK
    const limitCheck = await checkToolLimit(userId, 'website', req);
    if (!limitCheck.allowed) {
      return res.status(403).json({ success: false, error: `Daily limit reached! You have used ${limitCheck.limit}/${limitCheck.limit} free credits for Website Generation today. Upgrade to Pro for more!` });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const enhancedPrompt = `You are a strict React code generator. You must generate a single-file React component based on this prompt: "${prompt}".

    CRITICAL EXECUTION RULES FOR LIVE PREVIEW:
    1. NEVER write any conversational text outside the code block.
    2. NEVER include ANY 'import' statements. Assume React and hooks are already available.
    3. NEVER use external icons (no lucide-react). Use emojis only.
    4. MUST start exactly with: export default function Website() {
    5. STRICTLY FORBIDDEN: DO NOT write ANY comments in the code (no //, no /* */, and especially NO {/* */} inside JSX). The parser will break and display them on screen.
    6. Wrap the ENTIRE return statement inside a single parent <div> element. 
    7. Avoid complex conditional JSX rendering (like {submitted && (...)}). Keep the UI structure static and simple so the live preview doesn't fail.
    8. Use Tailwind CSS classes for all styling.`;

    const generationConfig = { maxOutputTokens: 8192 };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
      generationConfig
    });

    let code = result.response.text();
    
    const match = code.match(/```(?:jsx|javascript|js|tsx|html)?\n([\s\S]*?)```/);
    if (match) {
        code = match[1];
    } else {
        code = code.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();
    }

    code = code.replace(/^import\s+.*?['"].*?['"];?\n?/gm, ''); 

    //  Added Database Tracking logic for website so credit limits work!
    const sql = getSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO creations (user_id, prompt, content, type)
          VALUES (${userId}, ${prompt}, ${code}, 'website')
        `;
      } catch (dbErr) {
        console.log("DB save note:", dbErr.message);
      }
    }
    
    res.json({ success: true, code });
  } catch (error) {
    console.error("Generate website error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Helper: Used by Background & Object Remove tools to save results in DB
async function saveToDatabase(userId, prompt, content, type = 'image') {
  const sql = getSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, ${type})
      `;
    } catch (dbError) {
      console.log("Database operation failed:", dbError.message);
    }
  }
}

//  DASHBOARD STATS: Fetch remaining credits for all tools
export const getUserCredits = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    // Plan check karna
    const plan = req.plan || req.user?.plan || req.auth?.plan || 'free';
    const limit = plan === 'pro' ? 50 : 5;

    const sql = getSql();
    if (!sql) return res.status(500).json({ success: false, message: "Database connection failed" });

    // Sirf aaj (today) ka data fetch karna group karke
    const usageData = await sql`
      SELECT type, count(*) as count 
      FROM creations 
      WHERE user_id = ${userId} 
        AND DATE(created_at) = CURRENT_DATE
      GROUP BY type
    `;

    // Saare tools ki list jo tumhare platform par hain
    const tools = [
      { id: 'article', name: 'Article Generator' },
      { id: 'blog_title', name: 'Blog Titles' },
      { id: 'image', name: 'Image Generation' },
      { id: 'remove-bg', name: 'Background Removal' },
      { id: 'remove-object', name: 'Object Removal' },
      { id: 'resume-review', name: 'Resume Review' },
      { id: 'website', name: 'Website Generator' }
    ];

    // Data ko format karna frontend ke liye
    const credits = tools.map(tool => {
      const found = usageData.find(item => item.type === tool.id);
      const used = found ? parseInt(found.count) : 0;
      return {
        name: tool.name,
        used: used,
        limit: limit,
        remaining: Math.max(0, limit - used)
      };
    });

    res.json({ success: true, plan, totalLimitPerTool: limit, credits });
  } catch (error) {
    console.error("Get credits error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};