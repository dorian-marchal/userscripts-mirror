// ==UserScript==
// @name         Respawn Workspace Switcher
// @version      0.1
// @description  Adds workspace switcher in Respawn debug bar
// @match        http://*.jeuxvideo.com/*
// @match        https://*.jeuxvideo.com/*
// @grant        none
// ==/UserScript==

const workspaces = [
  'www',
  'dorianm1-www.dev',
  'demo1-www.dev',
  'adrienw1-www.dev',
  'antoinez1-www.dev',
  'bricel1-www.dev'
];

const currentWorkspace = location.hostname.match(/^(.*?)\.jeuxvideo.com/)[1];

const debugBar = document.querySelector('#content-debug');

const workspaceList = document.createElement('select');
workspaceList.style = 'height: 100%;';

const defaultOption = document.createElement('option');
defaultOption.label = 'Workspace...';
workspaceList.appendChild(defaultOption);

workspaces.forEach((workspace) => {
  const option = document.createElement('option');
  option.label = workspace;
  option.value = workspace;
  option.selected = currentWorkspace === workspace;
  workspaceList.appendChild(option);
});

debugBar.appendChild(workspaceList);

workspaceList.onchange = (event) => {
  const workspace = event.target.value;
  if (!workspace) {
    return;
  }
  document.location.href = document.location.href.replace(/\/\/.*?(.jeuxvideo.com.*)$/, `//${workspace}$1`);
};
