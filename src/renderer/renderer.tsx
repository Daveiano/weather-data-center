/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import '../index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';

import App from './App';
import { appReducerDefaultState, appReducer } from './reducer-app';
import { isLoadingAction } from "./actions-app";
import { HashRouter } from "react-router-dom";

const store = createStore(
  combineReducers({
    appState: appReducer
  }),
  {
    appState: appReducerDefaultState
  }
);

const ipcMainLoadingListener = (event: any, arg: any): void => {
  store.dispatch(isLoadingAction(arg));
};

window.electron.IpcOn('app-is-loading', ipcMainLoadingListener);

console.log('👋 This message is being logged by "renderer.js", included via webpack');

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);