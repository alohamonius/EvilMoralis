import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import './assets/style.less';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";

const URL = process.env.REACT_APP_MORALIS_URL;
const APP_ID = process.env.REACT_APP_MORALIS_APP_ID;



const Application = () => {
  if (!APP_ID || !URL)
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file.",
    );

  return (
    <MoralisProvider appId={APP_ID ?? "Invalid"} serverUrl={URL ?? "Invalid"}>
      <App />
    </MoralisProvider>
  )
};

ReactDOM.render(
  <React.StrictMode>
    <Application></Application>
  </React.StrictMode>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();