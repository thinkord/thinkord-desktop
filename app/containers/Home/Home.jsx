// React module
import React, { Component } from 'react';
import WindowTitlebar from '../../components/WindowTitlebar/WindowTitlebar';
import './home.scss';

// Electron module
const { ipcRenderer } = require('electron');

// Third-party packages
import { JSONManager } from '../../renderer/json-manager';
import NoteCard from '../../components/NoteCard/NoteCard';
import SearchButton from '../../components/SearchButton/SearchButton'

// Notification
import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import 'noty/lib/themes/relax.css';

// Icons
import UserLoginIcon from "./icons/user.svg";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collections: [],
            home_page: false,
            help_page: true,
            about_us_page: true
        }
    }

    componentDidMount() {
        let noti_rename = null;  // Show notification after renaming the collection
        let noti_delete = null;  // Show notification after deleting the collection

        // Initialize home
        ipcRenderer.send('update-collections');

        ipcRenderer.once('update-collections', (event, args) => {
            let stateCollection = JSON.stringify(this.state.collections)
            let nextStateCollection = JSON.stringify(args.collections)
            // Update state only when there exists some changes to collection
            if (stateCollection !== nextStateCollection) {
                this.setState({ collections: args.collections.reverse() });
            };
        });

        ipcRenderer.on('rename-collection', (event, args) => {
            if (!args.err) {
                let nextCollections = this.state.collections;
                nextCollections[args.collectionIdx].path = args.newCollectionPath;
                nextCollections[args.collectionIdx].name = args.newCollectionName;
                this.setState({ collections: nextCollections });
                noti_rename = this.handleNoti(noti_rename, args.msg);
            } else {
                noti_rename = new Noty({
                    type: 'error',
                    theme: 'relax',
                    layout: 'topRight',
                    text: args.msg
                }).show();
            }
        });

        ipcRenderer.on('delete-collection', (event, args) => {
            if (!args.err) {
                this.state.collections.map((collection) => {
                    if (collection.path === args.collectionPath) {
                        let nextCollections = this.state.collections;
                        nextCollections.splice(args.collectionIdx, 1);  // Delete collection from array collections
                        this.setState({ collections: nextCollections });
                    }
                });
                noti_delete = this.handleNoti(noti_delete, args.msg);
            } else {
                noti_rename = new Noty({
                    type: 'error',
                    theme: 'relax',
                    layout: 'topRight',
                    text: args.msg
                }).show();
            }
        });
    }

    // Handle notification
    handleNoti = (noti, msg) => {
        if (noti === null || noti === undefined) {
            noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            }).show();
            return noti;
        } else {
            noti.close();
            noti = new Noty({
                type: 'success',
                theme: 'relax',
                layout: 'topRight',
                text: msg
            });
            setTimeout(() => { noti.show(); }, 500);  // Show notification after previous notification is closed.
            return noti;
        }
    }

    // Modify the css content while clicking the button of menu
    handleMenuOpen = () => {
        const page = document.getElementById('page');
        page.classList.toggle('shazam');
    }

    handleMenuClose = () => {
        const page = document.getElementById('page');
        page.classList.remove('shazam');
    }

    // Add a new file
    handleAddClick = () => {
        const jsonManager = new JSONManager();

        jsonManager.initJSON().then((path) => {
            ipcRenderer.send('file-open-click', {
                path: path
            });
        });
    }

    //open or close folded recent file
    OpenRecentToggle = () => {
        // console.log(document.getElementsByClassName("btn"));
        Array.from(document.getElementsByClassName("btn")).forEach(
            function (element) {
                if (element.id >= 5) {
                    element.className = "btn visible";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className = "open_recent_icon fa fa-chevron-circle-down open_rotate";
        // this.setState({ expand: true });
    }

    OpenRecentRemove = () => {
        // console.log(document.getElementsByClassName("btn"));
        Array.from(document.getElementsByClassName("btn")).forEach(
            function (element) {
                if (element.id >= 5) {
                    element.className = "btn hidden";
                }
            }
        );
        document.getElementsByClassName("fa-chevron-circle-down")[0].className = "open_recent_icon fa fa-chevron-circle-down close_rotate";
        // this.setState({
        //     expand: false
        // });
    }

    //change the content of main page
    handleHomeClick = () => {
        this.handleMenuClose();
        this.setState({
            home_page: false,
            help_page: true,
            about_us_page: true
        });
    }

    handleHelpClick = () => {
        this.handleMenuClose();
        this.setState({
            home_page: true,
            help_page: false,
            about_us_page: true
        });
    }

    handleAboutUsClick = () => {
        this.handleMenuClose();
        this.setState({
            home_page: true,
            help_page: true,
            about_us_page: false
        });
    }

    // Change the content in search bar according to whether user focus on search bar or not
    handleSearchBarFocusOrNot = () => {
        var search_content = document.getElementById("main_search").value;
        if (search_content === 'Search...') {
            document.getElementById("main_search").value = "";
        } else if (search_content === "") {
            document.getElementById("main_search").value = "Search...";
        }
    }

    // Search the file in local file system according to the text that user enter
    handleSearchClick = (search_file) => {
        search_file = search_file.toLowerCase();
        var new_collections = [];
        for (var i = 0; i < this.state.collections.length; i++) {
            if (this.state.collections[i].path.split("\\").pop().toLowerCase().includes(search_file)) {
                new_collections.push(this.state.collections[i]);
            }
        }
        // this.setState({ collections: new_collections });
    }

    // View all the file in local file system
    handleViewAllClick = () => {
        ipcRenderer.send('update-collections');

        ipcRenderer.once('update-collections', (event, args) => {
            this.setState({ collections: args.collections.reverse() });
        });
    }

    render() {
        return (
            <div>
                <WindowTitlebar docTitle="Home"/>
                <header className="home_header">
                    <h1 className="title">Home</h1>
                    <div className="controls">
                        <SearchButton collections={this.state.collections} onSearchChange={this.handleSearchClick} />
                        <i className="fas fa-plus-circle fa-lg" onClick={this.handleAddClick}></i>
                        <img className="user" 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ3f_mCLpkLWSbUPVBMkI1-ZUUFP-dqFeFGUCDOc1lzuWUQxROe&usqp=CAU"/>
                    </div>
                </header>
                <main className="content" onClick={this.handleMenuClose}>

                    <div className="content_inner container" hidden={this.state.home_page}>
                        <div id="folder-section">
                            <h2>Folder</h2>
                            <div className="folder-wrapper">
                                <div className="folder-block">
                                    <i className="fas fa-folder"></i>
                                    <h5>My Folder1My Folder1</h5>
                                </div>
                                <div className="folder-block">
                                    <i className="fas fa-folder"></i>
                                    <h5>My Folder1</h5>
                                </div>
                                <div className="folder-block">
                                    <i className="fas fa-folder"></i>
                                    <h5>My Folder1</h5>
                                </div>
                                <div className="folder-block">
                                    <i className="fas fa-folder"></i>
                                    <h5>My Folder1My Folder1</h5>
                                </div>
                                <div className="folder-block">
                                    <i className="fas fa-folder"></i>
                                    <h5>My Folder1</h5>
                                </div>
                            </div>
                        </div>
                        <div id="file-section">
                            <h2>File</h2>
                            <div className="file-wrapper">
                                {
                                    this.state.collections.map(note => {
                                        return (
                                            <NoteCard
                                                key={note.id}
                                                index={this.state.collections.indexOf(note)}
                                                file={note}
                                            ></NoteCard>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        {/* <h1>Thinkord</h1><br />

                        <div className="user_login"><button><img src={UserLoginIcon}></img></button>Login</div>

                        <div className="content_search">
                            <input id="main_search2" className="search_bar" type="text" defaultValue="Search..."
                                onFocus={this.handleSearchBarFocusOrNot} onBlur={this.handleSearchBarFocusOrNot} />
                            <i className="search_icon fas fa-search" onClick={this.handleSearchClick}></i>
                            <i className="search_icon fas fa-globe" onClick={this.handleViewAllClick}></i>
                        </div><br />
                        <h2>
                            OPEN RECENT
                            <button className="open_recent_btn add" onClick={this.handleAddClick}>
                                <i className="fas fa-plus-circle"></i>
                            </button>
                            <button
                                className="open_recent_btn expand"
                                disabled={this.state.collections.length > 5 ? false : true}
                                onClick={this.state.expand ? () => this.OpenRecentRemove() : () => this.OpenRecentToggle()}
                            >
                                <i className="fas fa-chevron-circle-down"></i>
                            </button>
                        </h2><br /> */}
                        {/* <div className="pop_trigger">
                            {this.state.collections.map((file) => {
                                if (this.state.collections.indexOf(file) < 10) {
                                    return <FileButton
                                        key={file.path}
                                        index={this.state.collections.indexOf(file)}
                                        file={file}
                                        expand={this.state.expand}
                                    ></FileButton>
                                }
                            })}
                        </div> */}
                    </div>
                    <div className="content_inner" hidden={this.state.help_page}>
                        <h1>Help</h1>
                    </div>
                    <div className="content_inner" hidden={this.state.about_us_page}>
                        <h1>About Us</h1>
                    </div>
                </main>
            </div>
        )
    }
}
