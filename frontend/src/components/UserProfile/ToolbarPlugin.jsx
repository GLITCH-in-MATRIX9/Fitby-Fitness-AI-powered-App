import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaCode,
  FaEraser,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            code: selection.hasFormat("code"),
          });
        }
      });
    });
  }, [editor]);

  const buttonBase = "p-2 rounded hover:bg-gray-200 transition-colors duration-150";
  const getButtonStyle = (active) =>
    `${buttonBase} ${active ? "bg-gray-300" : "bg-gray-100"}`;

  return (
    <div className="flex flex-wrap gap-2 mb-3 border p-2 rounded bg-white shadow-sm items-center">
      {/* Text formatting */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={getButtonStyle(formats.bold)}
        title="Bold"
        aria-label="Bold"
      >
        <FaBold />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={getButtonStyle(formats.italic)}
        title="Italic"
        aria-label="Italic"
      >
        <FaItalic />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={getButtonStyle(formats.underline)}
        title="Underline"
        aria-label="Underline"
      >
        <FaUnderline />
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
        className={getButtonStyle(formats.code)}
        title="Inline Code"
        aria-label="Inline Code"
      >
        <FaCode />
      </button>

      {/* Undo / Redo */}
      <button
        onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
        className={buttonBase}
        title="Undo"
        aria-label="Undo"
      >
        <FaUndo />
      </button>

      <button
        onClick={() => editor.dispatchCommand(REDO_COMMAND)}
        className={buttonBase}
        title="Redo"
        aria-label="Redo"
      >
        <FaRedo />
      </button>

      {/* Clear formatting */}
      <button
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.formatText("bold", false);
              selection.formatText("italic", false);
              selection.formatText("underline", false);
              selection.formatText("code", false);
            }
          })
        }
        className={`${buttonBase} bg-red-100 hover:bg-red-200`}
        title="Clear Formatting"
        aria-label="Clear Formatting"
      >
        <FaEraser />
      </button>
    </div>
  );
}
