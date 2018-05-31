// ==UserScript==
// @name         Respawn Workspace Switcher
// @version      0.11
// @description  Adds workspace switcher in Respawn debug bar
// @updateURL    https://github.com/dorian-marchal/phoenix/raw/userscript-jira-links/tool/userscript/workspace-switcher.user.js
// @downloadURL  https://github.com/dorian-marchal/phoenix/raw/userscript-jira-links/tool/userscript/workspace-switcher.user.js
// @match        http://*.jeuxvideo.com/*
// @match        https://*.jeuxvideo.com/*
// @grant        none
// ==/UserScript==

const removeDuplicates = (array) => array.filter((v, i, a) => a.indexOf(v) === i);

const debugBar = document.querySelector('#content-debug');

if (debugBar === null) {
  return;
}

const MAX_WORKSPACE_COUNT = 30;
const RECENT_WORKSPACES_COOKIE_NAME = '__WORKSPACES_v1__';
const WORKSPACE_SEPARATOR = '---------------';

const defaultWorkspaces = [
  'www',
  'preprod-www',
  'dorianm1-www.dev',
  'adrienw1-www.dev',
  'antoinez1-www.dev',
  'bricel1-www.dev',
  'demo1-www.dev',
  'demo2-www.dev',
  WORKSPACE_SEPARATOR
];

const currentWorkspace = location.hostname.match(/^(.*?)\.jeuxvideo.com/)[1];

// Get recent workspaces.
const workspaceCookieMatches = document.cookie.match(new RegExp(`${RECENT_WORKSPACES_COOKIE_NAME}=(.*?)(?:$|;)`));
let recentWorkspaces = workspaceCookieMatches
  ? JSON.parse(atob(workspaceCookieMatches[1])).slice(0, MAX_WORKSPACE_COUNT)
  : [];

// Update recent workspaces
if (currentWorkspace.endsWith('.dev')) {
  recentWorkspaces.unshift(currentWorkspace);
  recentWorkspaces = removeDuplicates(recentWorkspaces);
  document.cookie = `${RECENT_WORKSPACES_COOKIE_NAME}=${btoa(
    JSON.stringify(recentWorkspaces)
  )};domain=.jeuxvideo.com;path=/;Expires=Wed, 23 Oct 2030 07:28:00 GMT;`;
}

const workspaces = removeDuplicates([...defaultWorkspaces, ...recentWorkspaces]);

const workspaceList = document.createElement('select');
workspaceList.style = 'height: 100%;max-width:280px';

const defaultOption = document.createElement('option');
defaultOption.label = 'Workspace...';
workspaceList.appendChild(defaultOption);

workspaces.forEach((workspace) => {
  const option = document.createElement('option');
  option.label = workspace;
  if (workspace === WORKSPACE_SEPARATOR) {
    option.disabled = true;
  } else {
    option.value = workspace;
    option.selected = currentWorkspace === workspace;
  }
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
