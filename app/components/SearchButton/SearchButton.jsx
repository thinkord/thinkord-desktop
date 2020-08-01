import React, { Component } from 'react'
import './searchButton.scss'
export default class SearchButton extends Component{
    constructor(props) {
        super(props);
    }

    handleSearchBarClose = () => {
        document.getElementById("search-result-menu").classList.remove('show');
        document.getElementById("main-search").classList.toggle('show');
        document.getElementById("main-search").value = "";
    }
    handleSearchBarExpand = () => {
        document.getElementById("main-search").classList.toggle('show');
        document.getElementById("main-search").focus();
    }
  
    handleSearchChange = () => {
        document.getElementById("search-result-menu").classList.add('show');
        let search_content = document.getElementById("main-search").value;
        this.props.onSearchChange(search_content);
    }

    render() {
        return (
            <div className="search-button">
                <i className="fas fa-search fa-lg" onClick={this.handleSearchBarExpand}></i>
                <input id="main-search" className="search-bar" type="text" placeholder="Search..."
                        onBlur={this.handleSearchBarClose} onInput={this.handleSearchChange}/>
                <div id="search-result-menu">
                    <p className="search-count">Search Results(2)</p>
                    <div className="result-block">
                        <div className="note-info-wrapper">
                            <i className="fas fa-file"></i>
                            <div className="note-info">
                                <div className="note-title">Note 1</div>
                                <div className="changed-time side-note">changed 2 hours ago</div>
                            </div>
                        </div>
                        <div className="note-edit-date">2020-03-21</div>
                    </div>
                    <div className="result-block">
                        <div className="note-info-wrapper">
                            <i className="fas fa-file"></i>
                            <div className="note-info">
                                <div className="note-title">Note 1</div>
                                <div className="changed-time side-note">changed 2 hours ago</div>
                            </div>
                        </div>
                        <div className="note-edit-date">2020-03-21</div>
                    </div>
                </div>
            </div>
        )
    }
}