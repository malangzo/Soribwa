import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

class Editor extends Component{
    constructor(props){
        super(props);
    }

    modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline','strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
          ['link', 'image'], 
        ],
      }
    
      formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'align', 'color', 'background',
        'link', 'image',        
      ]

    render(){
        const { value, onChange } = this.props;
        return(
            <div style={{height: "450px"}}>
                <ReactQuill 
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