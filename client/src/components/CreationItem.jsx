import React, { useState } from "react";
import Markdown from "react-markdown";
import { Button } from "./ui/button";

const CreationItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm rounded-lg cursor-pointer border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:bg-zinc-900/60 transition-all duration-200"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="font-semibold text-white">{item.prompt}</h2>
          <p className="text-zinc-400 text-xs mt-0.5">
            <span className="uppercase font-medium text-blue-400">{item.type}</span> -{" "}
            {item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <Button className="pointer-events-none bg-destructive text-white shadow-xs">
          {item.type}
        </Button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          {item.type === "image" ? (
            <img
              src={item.content}
              alt="AI Generation"
              className="mt-3 w-full max-w-md rounded-md border border-zinc-700"
            />
          ) : (
            // 🚀 Dark theme compatible text colors lagaye hain taaki text saaf dikhe
            <div className="prose prose-sm max-w-none text-zinc-200 dark:prose-invert">
              <Markdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl font-bold text-white mb-3" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-xl font-semibold text-zinc-100 mt-4 mb-2" {...props} />
                  ),
                  h3: ({ ...props }) => (
                    <h3 className="text-lg font-semibold text-zinc-200 mt-3 mb-2" {...props} />
                  ),
                  p: ({ ...props }) => (
                    <p className="mb-3 leading-relaxed text-zinc-300" {...props} />
                  ),
                  code: ({ inline, ...props }) =>
                    inline ? (
                      <code className="bg-zinc-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                    ) : (
                      <pre className="bg-zinc-950 text-zinc-100 p-3 rounded-md overflow-x-auto text-xs border border-zinc-800">
                        <code {...props} />
                      </pre>
                    ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-3 italic text-zinc-400" {...props} />
                  ),
                  ul: ({ ...props }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 text-zinc-300" {...props} />
                  ),
                  ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 text-zinc-300" {...props} />
                  ),
                }}
              >
                {item.content}
              </Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;