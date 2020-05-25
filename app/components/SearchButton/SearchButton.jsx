import React, { Component } from 'react'
import './searchButton.scss'
export default class SearchButton extends Component{
  constructor(props) {
      super(props);
  }

  handleSearchBarClose = () => {
    document.getElementById("main_search").classList.toggle('show');
    document.getElementById("main_search").value = "";
  
  }
  handleSearchBarExpand = () => {
    document.getElementById("main_search").classList.toggle('show');
    document.getElementById("main_search").focus();
    // document.getElementById("main_search").value = "Search...";
  }
  
  handleSearchChange = () => {
    let search_content = document.getElementById("main_search").value;
    this.props.onSearchChange(search_content);
  }

  render() {
    return (
      <div className="search-button">
        <i className="fas fa-search fa-lg" onClick={this.handleSearchBarExpand}></i>
        <input id="main_search" className="search_bar" type="text" placeholder="Search..."
                onBlur={this.handleSearchBarClose} onChange={this.handleSearchChange}/>
      </div>
    )
  }
}