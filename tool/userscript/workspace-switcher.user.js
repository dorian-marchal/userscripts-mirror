// ==UserScript==
// @name         Respawn Workspace Switcher
// @version      0.2
// @description  Adds workspace switcher in Respawn debug bar
// @updateURL    https://github.com/dorian-marchal/phoenix/raw/userscript-jira-links/tool/userscript/workspace-switcher.user.js
// @downloadURL  https://github.com/dorian-marchal/phoenix/raw/userscript-jira-links/tool/userscript/workspace-switcher.user.js
// @match        http://*.jeuxvideo.com/*
// @match        https://*.jeuxvideo.com/*
// @grant        none
// ==/UserScript==

const removeDuplicates = (array) => array.filter((v, i, a) => a.indexOf(v) === i);

const recentWorkspacesCookieName = '__RECENT_WORKSPACES__';

const defaultWorkspaces = [
  'www',
  'dorianm1-www.dev',
  'demo1-www.dev',
  'adrienw1-www.dev',
  'antoinez1-www.dev',
  'bricel1-www.dev'
];

const currentWorkspace = location.hostname.match(/^(.*?)\.jeuxvideo.com/)[1];

// Get and update recent workspaces.
const workspaceCookieMatches = document.cookie.match(new RegExp(`${recentWorkspacesCookieName}=(.*?)(?:$|;)`));
let recentWorkspaces = workspaceCookieMatches ? JSON.parse(atob(workspaceCookieMatches[1])) : [];
recentWorkspaces.unshift(currentWorkspace);
recentWorkspaces = removeDuplicates(recentWorkspaces);
document.cookie = `${recentWorkspacesCookieName}=${btoa(JSON.stringify(recentWorkspaces))};domain=.jeuxvideo.com;path=/`;

const workspaces = removeDuplicates([...defaultWorkspaces, ...recentWorkspaces]);

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
