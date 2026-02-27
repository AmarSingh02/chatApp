// import remarkGfm from "remark-gfm";
// import ReactMarkdown from "react-markdown";

// export default function Message({ role, content }) {
//   return (
//     <div className={`msg ${role}`}>
//        <ReactMarkdown remarkPlugins={[remarkGfm]}>
//         {content}
//       </ReactMarkdown>
//       <style>{`
//         .msg {
//           max-width: 75%;
//           padding: 10px 12px;
//           border-radius: 8px;
//           line-height: 1.4; box-shadow: 0 1px 0px #0000001c;
//     border: 1px solid #80808030;
//         }
//         .msg.user {
//           background: var(--message-user-bg);
//           margin-left: auto;
//           color: var(--text-primary);
//         }
//         .msg.bot {
//           background: var(--message-bot-bg);
//           margin-right: auto;
//           color: var(--text-primary);
//           border: 1px solid var(--border-color);
//         }
//       `}</style>
//     </div>
//   );
// }



import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ role, content }) {
  return (
    <div className={`message ${role}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, children }) {
            if (inline) return <code>{children}</code>;

            return (
              <div className="code-block">
                <button
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(children)}
                >
                  Copy
                </button>
                <pre>
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}