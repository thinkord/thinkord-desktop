import "@babel/polyfill";

import React from 'react';
import ReactDOM from 'react-dom';
import './indexCB.css'
// import TextWindow from "./containers/TextWindow";
import TextWindow from "./containers/TextWindow/TextWindow";

//文字輸入視窗
ReactDOM.render(<TextWindow />, document.getElementById('root'));