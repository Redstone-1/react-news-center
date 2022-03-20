import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./NewsEditor.css";


export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState("")

  // 在更新模式下，点击进入时拿到 content 内容，再通过这些 API 给 Wysiwyg 编辑器赋值
  // content 是父组件传下来的，即 NewsUpdate
  useEffect(() => {
    const html = props.content
    if (html === undefined) return
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }, [props.content])

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
