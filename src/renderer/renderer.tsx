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

import { App } from './app';
import { appReducerDefaultState, appReducer } from './reducer-app';
import {configAction, isLoadingAction} from "./actions-app";
import { HashRouter } from "react-router-dom";
import {ImportSettingsFormValues} from "./components/import-settings-modal";

const store = createStore(
  combineReducers({
    appState: appReducer
  }),
  {
    appState: appReducerDefaultState
  }
);

const ipcMainLoadingListener = (arg: [boolean]): void => {
  store.dispatch(isLoadingAction(arg[0]));
};
const configListener = (arg: [ImportSettingsFormValues]): void => {
  store.dispatch(configAction(arg[0]));
};

window.electron.IpcOn('app-is-loading', (event, arg) => ipcMainLoadingListener(arg));
window.electron.IpcOn('config', (event, arg) => configListener(arg));

window.electron.IpcSend('config', null);

console.log('👋 This message is being logged by "renderer.js", included via webpack');

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('app')
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch