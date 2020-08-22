import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import './noteCard.scss';
const { ipcRenderer } = require('electron');

export default class NoteCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.file.name,
            bookmarked: false,
            menu_show: false,
            modal_show: false,
            modal_function: "rename"
        }
    }


    // When you click the file button, the collection will show
    EnterCollection = (path) => {
        ipcRenderer.send('file-open-click', { path: path });
    }

    handleBookmarkClick = () => {
        this.setState({ bookmarked: !this.state.bookmarked })
    }

    handleMenuToggle = () => {
        this.setState({ menu_show: !this.state.menu_show })
    }

    handleMenuHide = () => {
        this.setState({ menu_show: false })
    }

    // Show the rename dialog
    handleModalShow = () => {
        this.setState({ modal_show: true });
    }

    // Close the rename dialog
    handleModalClose = () => {
        this.setState({ modal_show: false });
    }

    handleModalChange = (func) => {
        this.setState({ modal_function: func });
    }

    // Change the collection name
    handleRename = (path, index) => {
        let newCollectionName = document.getElementById('new_filename').value;
        this.setState({ title: newCollectionName });
        ipcRenderer.send('rename-collection', {
            collectionPath: path,
            newCollectionName: newCollectionName,
            collectionIdx: index
        });
        this.setState({ modal_show: false });
    }

    // Delete the collectioin
    handleDelete = (path, index) => {
        ipcRenderer.send('delete-collection', {
            collectionPath: path,
            collectionIdx: index
        });
        this.setState({ modal_show: false });
    }

    render() {
        const labelid = "label_" + this.props.index;

        var bookmarkStyle = null;
        if(this.state.bookmarked){
            bookmarkStyle = "fas";
        }else{
            bookmarkStyle = "far";
        }

        var menuClasses = ["note-card-menu"]
        if(this.state.menu_show){
            menuClasses.push("show")
        }else{
            if(menuClasses.length == 2)
                menuClasses.pop()
        }

        var modalDialog;
        switch(this.state.modal_function){
            case "rename":
                modalDialog = (
                    <Modal show={this.state.modal_show} onHide={this.handleModalClose} centered>
                        <Modal.Header className="modal_header">
                            <Modal.Title>Rename</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input id="new_filename" type="text" defaultValue={this.state.title} className="modal_input"/>
                        </Modal.Body>
                        <Modal.Footer className="modal_footer">
                            <i className="modal_icon fas fa-check-circle" onClick={() => {
                                this.handleRename(this.props.file.path, this.props.index);
                            }}></i>
                            <i className="modal_icon fas fa-times-circle" onClick={this.handleModalClose}></i>
                        </Modal.Footer>
                    </Modal>
                );
                break;
            case "delete":
                modalDialog = (
                    <Modal show={this.state.modal_show} onHide={this.handleModalClose} centered>
                        <Modal.Header className="modal_header">
                            <Modal.Title>Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Do you really want to delete file "{this.state.title}" ?</Modal.Body>
                        <Modal.Footer className="modal_footer">
                            <i className="modal_icon fas fa-check-circle" onClick={() => {
                                this.handleDelete(this.props.file.path, this.props.index);
                            }}></i>
                            <i className="modal_icon fas fa-times-circle" onClick={this.handleModalClose}></i>
                        </Modal.Footer>
                    </Modal>
                )
                break;
        }

        return (
            <div>
                <div
                    id={labelid}
                    className="note-block"
                >
                    <div className="card-anchor" onClick={() => this.EnterCollection(this.props.file.path)}></div>
                    <div className="note-block-control">
                        <div className="bookmark" onClick={this.handleBookmarkClick}><i className={bookmarkStyle + " fa-bookmark"}></i></div>
                        <button id="note-block-more" onClick={this.handleMenuToggle} onBlur={this.handleMenuHide}><i className="fas fa-ellipsis-h"></i></button>
                        <div className={menuClasses.join(" ")}>
                            <div className="menu-item" onClick={() => { this.handleModalChange("rename"); this.handleModalShow(); }}>
                                <i className="fas fa-pen-square"></i> Rename
                            </div>
                            <div className="menu-item" onClick={() => { this.handleModalChange("delete"); this.handleModalShow(); }}>
                                <i className="fas fa-trash-alt"></i> Delete
                            </div>
                        </div>
                    </div>
                    <div className="note-block-details">
                        <h5 className="note-block-title">{this.state.title}</h5>
                        <div className="note-block-time">
                            <i className="fas fa-clock"></i>
                            <span>changed 2 hours ago</span>
                        </div>
                        <div className="note-block-tags">
                            <i className="fas fa-tag"></i>
                            <span>statistics</span>
                        </div>
                    </div>
                </div>
                {modalDialog}
            </div>
        )
    }
}