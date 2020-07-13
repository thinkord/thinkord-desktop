import React, { Component } from 'react';
import './fileIcon.scss';
// import icon

import './fileIcon.scss';
import CommonIcon from"./icons/file-alt.svg"
import ZipIcon from"./icons/file-archive.svg"
import AudioIcon from"./icons/file-audio.svg"
import ExcelIcon from"./icons/file-excel.svg"
import PdfIcon from"./icons/file-pdf.svg"
import VideoIcon from"./icons/file-video.svg"
import WordIcon from"./icons/file-word.svg"


export default class FileIcon extends Component{
    constructor(props){
        super(props);
    }

    //choose different icon according to the type of file
    ChooseFileIcon = (file) => {
        if (file.split('.').pop() === 'docx') {
            return (
                <img src={WordIcon}></img>
            )
        } else if (file.split('.').pop() === 'pdf') {
            return (
                <img src={PdfIcon}></img>
            )
        } else if (file.split('.').pop() === 'wav') {
            return (
                <img src={AudioIcon}></img>
            )
        } else if (file.split('.').pop() === 'mp4') {
            return (
                <img src={VideoIcon}></img>
            )
        } else if (file.split('.').pop() === 'xls') {
            return (
                <img src={ExcelIcon}></img>
            )
        } else if (file.split('.').pop() === 'zip') {
            return (
                <img src={ZipIcon}></img>
            )
        } else {
            return (
                <img src={CommonIcon}></img>
            )
        }
    }

    render(){
        return(
            <div className="file-icon-container">{this.ChooseFileIcon(this.props.file)}</div>
        )
    }
}