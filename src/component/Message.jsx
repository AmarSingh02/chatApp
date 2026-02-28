


import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function CodeBlock({ inline, children }) {
  const text = Array.isArray(children) ? children.join("") : String(children);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 3000);
    return () => clearTimeout(t);
  }, [copied]);

  if (inline) return <code>{children}</code>;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="code-block">
      <button className="copy-btn" onClick={handleCopy} aria-label="Copy code">
        {copied ? "Copied" : "Copy"}
      </button>
      <pre>
        <code>{text}</code>
      </pre>
    </div>
  );
}

export default function Message({ role, content }) {
  return (
    <div className={`message ${role}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}