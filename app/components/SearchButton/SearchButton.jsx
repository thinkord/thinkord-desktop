import React, { Component } from 'react'
import './searchButton.scss'
// Electron module
const { ipcRenderer } = require('electron');
export default class SearchButton extends Component{
    constructor(props) {
        super(props);
        this.state = {
            search_target: "",
            menu_show: false,
            searchbar_show: false,
            search_result: []
        }
    }

    handleEnterCollection = (path) => {
        ipcRenderer.send('file-open-click', { path: path });
    }

    handleSearchBarClose = () => {
        this.setState({
            menu_show: false,
            searchbar_show: false,
            search_target: ""
        });
    }

    handleSearchBarExpand = () => {
        this.setState({
            searchbar_show: true
        });
        document.getElementById("main-search").focus();
    }

    handleSearchChange = (event) => {
        const searchResult = [];
        if(event.target.value != ""){
            for(var collection of this.props.collections) {
                if(collection.path.split("\\").pop().toLowerCase().includes(event.target.value.toLowerCase())) {
                    searchResult.push(collection);
                }
            }
        }
        this.setState({
            menu_show: true,
            search_target: event.target.value,
            search_result: searchResult
        });
        this.props.onSearchChange(this.state.search_target);
    }

    render() {
        return (
            <div className="search-button">
                <i className="fas fa-search fa-lg" onClick={this.handleSearchBarExpand}></i>
                <input 
                    id="main-search" 
                    className={"search-bar" + (this.state.searchbar_show ? " show" : "") } 
                    type="text" placeholder="Search..."
                    onBlur={this.handleSearchBarClose}
                    onChange={this.handleSearchChange} 
                    value={this.state.search_target}
                />
                <div id="search-result-menu" className={this.state.menu_show&&this.state.search_target != "" ? "show" : null}>
                    <p className="search-count">Search Results({this.state.search_result.length})</p>
                    {
                        this.state.search_result.map(note => {
                            return (
                                <div className="result-block" key={note.id} onClick={()=>this.handleEnterCollection(note.path)}>
                                    <div className="note-info-wrapper">
                                        <i className="fas fa-file"></i>
                                        <div className="note-info">
                                            <div className="note-title">{note.name}</div>
                                            <div className="changed-time side-note">changed 2 hours ago</div>
                                        </div>
                                    </div>
                                    <div className="note-edit-date">2020-03-21</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}