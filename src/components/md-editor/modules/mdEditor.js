import React from 'react';
import Constants from './constants';
import '../css/mdEditor.css';

const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });
export default class MdEditor extends React.Component
{
 constructor(props){
    super(props);
    this.editorTextArea = React.createRef();
    this.state = {
        editorText:"",
        previewText:"",
        toolBarConfig: [
            {
                name: 'bold',
                iconName: 'format_bold',
                markUpStart: '**',
                markUpEnd: '**',
            },
            {
                name: 'italic',
                iconName: 'format_italic',
                markUpStart: '_',
                markUpEnd: '_',
            },
            {
                name: 'underlined',
                iconName: 'format_underlined',
                markUpStart: '<span style="text-decoration:underline">',
                markUpEnd: '</span>',
            },
            {
                name: 'strikethrough',
                iconName: 'strikethrough_s',
                markUpStart: '~~',
                markUpEnd: '~~',
            },
            {
                name: 'quote',
                iconName: 'format_quote',
                markUpStart: '<blockquote>',
                markUpEnd: '</blockquote>',
            },
            {
                name: 'h1',
                iconName: 'looks_one',
                markUpStart: '# ',
                isSingleTaggedMarkup: true
            },
            {
                name: 'h2',
                iconName: 'looks_two',
                markUpStart: '## ',
                isSingleTaggedMarkup: true
            },
            {
                name: 'h3',
                iconName: 'looks_3',
                markUpStart: '### ',
                isSingleTaggedMarkup: true
            },
            {
                name: 'upperCase',
                iconName: 'text_rotate_up',
                customFormatter: function(input){
                    return input ? input.toUpperCase() : '';
                }
            },
            {
                name: 'lowerCase',
                iconName: 'text_rotation_down',
                customFormatter: function(input){
                    return input ? input.toLowerCase() : '';
                }
            },
            {
                name: 'code',
                iconName: 'code',
                markUpStart: '```',
                markUpEnd: '```',
                isBlockedMarkup: true
            },
            {
                name: 'horizontalRule',
                iconName: 'power_input',
                markUpStart: '---',
                isSingleTaggedMarkup: true
            },
        ]
    };
    this.editorTextChange = this.editorTextChange.bind(this);
    this.handleToolBarElementClick = this.handleToolBarElementClick.bind(this);
 }

 editorTextChange(e){
    this.setState(
        {
            editorText: e.target.value,
            previewText: md.render(e.target.value)
        }
    );
 }


 handleToolBarElementClick(e, config){
    const selectionStartIndex = this.editorTextArea.current.selectionStart;
    const selectionEndIndex = this.editorTextArea.current.selectionEnd;

    if(selectionStartIndex !== selectionEndIndex){
        const currentText = this.state.editorText;
        const selectedText = currentText.substring(selectionStartIndex , selectionEndIndex);
        const newEditorText = this.addRemoveMarkup(selectedText, config, currentText, selectionStartIndex, selectionEndIndex);
        const newPreviewText = md.render(newEditorText);
        this.setState({
            editorText:  newEditorText,
            previewText: newPreviewText
        })
    }
 }

 addRemoveMarkup(text, config, editorText, selectionStart, selectionEnd){
    let newText = '';
    let newEditorText = '';
    if(config.isSingleTaggedMarkup)
    {
        if(text.startsWith(config.markUpStart)){
            newText = text.substring(config.markUpStart.length, text.length);
            newEditorText = editorText.substring(0, selectionStart) + newText + editorText.substring(selectionStart + config.markUpStart.length + newText.length, editorText.length);
        }
        else{
            newText = config.markUpStart + text;
            newEditorText = editorText.substring(0, selectionStart) + newText + editorText.substring(selectionStart + newText.length, editorText.length);
        }
    }
    else{
        if(config.customFormatter){
            newText = config.customFormatter(text);
            newEditorText = editorText.substring(0, selectionStart) + newText +  editorText.substring(selectionStart + newText.length, editorText.length);
        }
        else{
            if(text.startsWith(config.markUpStart) && text.endsWith(config.markUpEnd)){
                newText = text.substring(config.markUpStart.length, text.length - config.markUpEnd.length);
                newEditorText = editorText.substring(0, selectionStart) + newText + editorText.substring(selectionStart + config.markUpStart.length + newText.length + config.markUpEnd.length, editorText.length);
            }
            else
            {
                newText = config.markUpStart + text + config.markUpEnd;
                newEditorText = editorText.substring(0, selectionStart) + newText + editorText.substring(selectionEnd, editorText.length);
            }
        }
    }
    return newEditorText;
 }

 render(){
     return(
         <div className= {Constants.ContainerClassName}>
             <div className={Constants.EditorContainerClassName}>
                <div className={Constants.ToolBarContainerClassName}>
                    {
                        this.state.toolBarConfig.map(config => {
                            return(
                                <div className={Constants.ToolBarElementClassName} key={config.name} onClick={(e)=>{ this.handleToolBarElementClick(e, config) }}>
                                    <span className={Constants.IconClassName}>
                                        {config.iconName}
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                <textarea className = {Constants.EditorTextAreaClassName}
                        value = {this.state.editorText}
                        onChange={this.editorTextChange}
                        ref={this.editorTextArea}>
                </textarea>
             </div>
             <div className= {Constants.PriviewTextAreaClassName} dangerouslySetInnerHTML={{__html:this.state.previewText}} ></div>
         </div>
     );
 }
}