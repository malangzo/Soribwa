import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

<link rel="manifest" href="/manifest.json" />

class Editor extends Component{
    constructor(props){
        super(props);
        this.state = {
            editorHtml: props.value || ''
        };
        this.reactQuillRef = null;
    }

    modules = {
        toolbar: {
        container: [
          [{ 'header': [1, 2, 3, false] }],
          ['underline','strike','bold', 'italic'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
          ['link', 'image'], 
        ],
        handlers: {
          'image': this.imageHandler.bind(this)
        }
      }
    };
    
      formats = [
        'header',
        'underline', 'strike', 'bold', 'italic',
        'list', 'bullet',
        'align', 'color', 'background',
        'link', 'image',        
      ];
      
      imageHandler() {
        const editor = this.reactQuillRef.getEditor();
        const length = editor.getLength();
        const currentContent = editor.getContents();
        const imageCount = currentContent.ops.filter(op => op.insert && op.insert.image).length;

        if (imageCount >= 1) {
            alert('이미지는 하나만 첨부할 수 있습니다.');
            return;
        }

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result;
                editor.insertEmbed(length, 'image', base64Image);
            };
            reader.readAsDataURL(file);
        };
    }

    render(){
        const { value, onChange } = this.props;
        return(
            <div style={{height: "600px"}}>
                <ReactQuill 
                    ref={(el) => { this.reactQuillRef = el }}
                    style={{height: "90%"}} 
                    theme="snow" 
                    modules={this.modules} 
                    formats={this.formats} 
                    value={value || ''} 
                    onChange={(content, delta, source, editor) => onChange(editor.getHTML())} />
            </div>
        )
    }
}
export default Editor