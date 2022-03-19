import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./NewsEditor.css"

export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState("")

  return (
    <div style={{border: "1px solid #f0f2f5", height: "45vh", overflow: "hidden"}}>
      <Editor
        onBlur={() => {
          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          )
        }}
        toolbarClassName='toolbar'
        editorState={editorState} 
        onEditorStateChange={(editorState) => setEditorState(editorState)}
      />
    </div>
  )
}
