import React, { Component } from 'react'
import { remote } from 'electron'
import logo from '../../asset/Thinkord-LOGO.png'
import "./windowTitlebar.scss"

const win = remote.getCurrentWindow()
export class WindowTitlebar extends Component {
    componentDidMount() {
        this.handleWindowControls();
        this.toggleMaxRestoreButtons();
        window.onbeforeunload = (event) => {
            /* If window is reloaded, remove win event listeners
            (DOM element listeners get auto garbage collected but not
            Electron win listeners as the win is not dereferenced unless closed) */
            win.removeAllListeners();
        }
    }
    handleWindowControls() {
        // Make minimise/maximise/restore/close buttons work when they are clicked
        document.getElementById('min-button').addEventListener("click", event => {
            win.minimize();
        });
    
        document.getElementById('max-button').addEventListener("click", event => {
            win.maximize();
        });
    
        document.getElementById('restore-button').addEventListener("click", event => {
            win.unmaximize();
        });
    
        document.getElementById('close-button').addEventListener("click", event => {
            win.close();
        });
    
        // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
        this.toggleMaxRestoreButtons();
        win.on('maximize', this.toggleMaxRestoreButtons);
        win.on('unmaximize', this.toggleMaxRestoreButtons);
    }
    
    toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.getElementById('titlebar').classList.add('maximized');
        } else {
            document.getElementById('titlebar').classList.remove('maximized');
        }
    }
    render() {
        return (
            <div id="titlebar" className="window-titlebar">
                <div id="drag-region">
                    <div id="window-title">
                        <img id="titlebar-logo" src={logo} alt=""/>
                        <span>Thinkord</span>
                    </div>
                    <div id="document-title">
                        <span>{this.props.docTitle}</span>
                    </div>
                    <div id="window-controls">
                        <div className="button" id="min-button">
                            <svg version="1.1" aria-hidden="true" width="10" height="10">
                                <path d="M 0,5 10,5 10,6 0,6 Z" />
                            </svg>
                        </div>

                        <div className="button" id="max-button">    
                            <svg version="1.1" aria-hidden="true" width="10" height="10">
                                <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
                            </svg>
                        </div>

                        <div className="button" id="restore-button">
                            <svg version="1.1" aria-hidden="true" width='11' height='11' viewBox='0 0 11 11' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z'/>
                            </svg>
                        </div>

                        <div className="button" id="close-button">    
                            <svg aria-hidden="true" version="1.1" width="10" height="10">
                                <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default WindowTitlebar;