import React, { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,  /* Gets current selection , user highlighted */ 
  $isRangeSelection,  /* selection is a range ,text selection */
  FORMAT_TEXT_COMMAND,   /*apply styles like bold, italic, underline, etc*/
  FORMAT_ELEMENT_COMMAND,   /*block-level formatting (like alignment or lists) */
  SELECTION_CHANGE_COMMAND,   /*Triggered when user moves the cursor or changes selectionTriggered when user moves the cursor or changes selection*/
} from "lexical";
import { $patchStyleText } from "@lexical/selection";  /*inline style patching (e.g., font size, color) on selected text*/
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import './App.css';  

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    return editor.registerCommand(  /*hook into Lexical's selection system*/
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        const selection = $getSelection();
        setSelection(selection);
        return false;
      },
      0 /* lowest priority*/
    );
  }, [editor]);

  /* format("bold") applies bold formatting to selected text*/
  const format = (type) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);

  /* Apply Inline Styles (Font Size, Color)*/
  const applyStyle = (styleObj) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styleObj);
      }
    });
  };
  /* block-level alignment (left, center, right) to the selected block */
  const setAlignment = (alignment) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  return (
    <div className="toolbar">
      {/* Text formatting */}
      <button onClick={() => format("bold")}> <b>B</b>
      </button>
      <button onClick={() => format("italic")}> <i>I</i>
      </button>
      <button onClick={() => format("underline")}> <u>U</u>
      </button>
      <button onClick={() => format("strikethrough")}> <s>S</s>
      </button>
      <button onClick={() => format("subscript")}>
        X<sub>2</sub>
      </button>
      <button onClick={() => format("superscript")}>
        X<sup>2</sup>
      </button>
     

  {/* Font size */}
  <select className="toolbar-dropdown" onChange={(e) => applyStyle({ 'font-size': e.target.value })} defaultValue="">
  <option value="">12</option>
  <option value="10px">10</option>
  <option value="14px">14</option>
  <option value="16px">16</option>
  <option value="18px">18</option>
  <option value="24px">24</option>
</select>


  {/* Font color */}
  <input
    type="color"
    onChange={(e) => applyStyle({ color: e.target.value })}
    title="Text Color"
  />

  {/* Alignment */}
  <select className="toolbar-dropdown" onChange={(e) => setAlignment(e.target.value)} defaultValue="">
  <option value="">Align</option>
  <option value="left">Left</option>
  <option value="center">Center</option>
  <option value="right">Right</option>
  <option value="justify">Justify</option>
</select>


{/* Bullet List */}
<button
  onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
  • List
</button>

{/* Numbered List */}
<button
  onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
  1. List
</button>
    </div>
  );
}
