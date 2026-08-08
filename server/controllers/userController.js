import getSql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth || {};
        const sql = getSql();

        if (!sql) {
            return res.json({ success: false, message: "Database connection not available" });
        }

        if (!userId) {
            return res.json({ success: false, message: "User ID missing" });
        }

        // 1. Check karo ki user database me hai ya nahi
        let users = await sql`SELECT * FROM users WHERE id = ${userId}`;
        let planType = "free";

        // 2. Agar id se user nahi mila, toh email se check karke update kar do ya naya bana lo
        if (users.length === 0) {
            try {
                const clerkUser = await clerkClient.users.getUser(userId);
                const email = clerkUser.emailAddresses?.[0]?.emailAddress || 'test@example.com';
                
                // Pehle check karo ki ye email pehle se hai kya
                const existingEmailUser = await sql`SELECT * FROM users WHERE email = ${email}`;
                
                if (existingEmailUser.length > 0) {
                    // Agar email pehle se hai, toh uski ID ko update karke naye userId se match kar do
                    await sql`UPDATE users SET id = ${userId} WHERE email = ${email}`;
                } else {
                    // Warna naya user insert kar do
                    await sql`INSERT INTO users (id, email) VALUES (${userId}, ${email})`;
                }
            } catch (syncErr) {
                console.log("⚠️ Auto-sync note:", syncErr.message);
            }
        } else {
            planType = users[0].plantype || "free";
        }

        // 3. User ki creations fetch karo
        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

        res.json({ success: true, creations, planType });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getPublishedCreations = async (req, res) => {
    try {
        const sql = getSql();
        if (!sql) return res.json({ success: false, message: "Database connection not available" });
        const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
        res.json({ success: true, creations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleLikeCreations = async (req, res) => {
    try {
        const { userId } = req.auth || {}
        const { id } = req.body
        const sql = getSql();
        if (!sql) return res.json({ success: false, message: "Database connection not available" });

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`
        if (!creation) return res.json({ success: false, message: "Creation not found" });
        
        const currentLikes = creation.likes || [];
        const userIdStr = userId.toString();
        let updatedLikes, message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter(user => user !== userIdStr);
            message = "Unliked creation";
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = "Liked creation";
        }

        const formattedArray = `{${updatedLikes.join(", ")}}`;
        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}