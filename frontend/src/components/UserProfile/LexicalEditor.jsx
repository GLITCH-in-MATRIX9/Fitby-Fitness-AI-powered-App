import React, { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes, $createParagraphNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffectOnce } from "react-use";

import ToolbarPlugin from "./ToolbarPlugin";

const theme = {
  paragraph: "mb-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    code: "bg-gray-100 text-sm font-mono px-1 py-0.5 rounded",
  },
};

function onError(error) {
  console.error("Lexical Error:", error);
}

// This plugin injects HTML content on mount
function PreloadContentPlugin({ html }) {
  const [editor] = useLexicalComposerContext();

  useEffectOnce(() => {
    if (!html) return;
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  });

  return null;
}

export default function LexicalEditor({ value, onChange }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    editable: true,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <ToolbarPlugin />

        {/* Load HTML into editor */}
        <PreloadContentPlugin html={value} />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[150px] p-2 focus:outline-none" />
          }
          placeholder={<div className="text-gray-400 px-2">Write something...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <AutoFocusPlugin />

        <OnChangePlugin
          onChange={(editorState, editor) => {
            editorState.read(() => {
              const html = $generateHtmlFromNodes(editor);
              onChange(html);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}
