import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';   /* provider that sets up the editor context */
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';    /* set up the core editing area where the user types */
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';   /*  Enables undo/redo functionality */
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';   /* Triggers a callback when the content of the editor changes */
import { ToolbarPlugin } from './ToolbarPlugin';  /* custom toolbar component */
import { ParagraphNode, TextNode, $getRoot /* Gets the document's root node */, $getSelection   /* Gets the user's current text selection */ } from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode } from '@lexical/rich-text';



const editorConfig = {
  namespace: 'WeatherEditor',
  theme: {  /*maps Lexical node types to CSS class names for styling*/
    paragraph: 'editor-paragraph',
    heading: {
    h1: 'heading-h1',
    h2: 'heading-h2',
    h3: 'heading-h3'
  },
     text: {
    bold: 'text-bold',
    italic: 'text-italic',
    underline: 'text-underline',
    strikethrough: 'text-strikethrough',
    subscript: 'text-subscript',
    superscript: 'text-superscript',
  },
},
  onError(error) {   /*handle run time error */
    throw error;
  },
  nodes: [ParagraphNode, TextNode,ListNode ,ListItemNode ],  /*explicitly declare which node types the editor supports*/
};

function onChange(editorState) {   /* react to changes in editor  , current snapshot of the editor's content and selection */
  editorState.read(() => {   /* read from the editor state in a readonly transaction*/
    const root = $getRoot();    /* root node of the document */ 
    const selection = $getSelection();   /* retrieves the current selection */
    console.log('Editor state changed:', root, selection);
  });
}

export default function RichTextEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-shell">
        <ToolbarPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">Enter Details...</div>}
            ErrorBoundary={({ error }) => <div>Error: {error.message}</div>}
          />
          <HistoryPlugin />
          <OnChangePlugin onChange={onChange} />
          <ListPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}    