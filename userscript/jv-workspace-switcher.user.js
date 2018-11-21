// ==UserScript==
// @name         jv-workspace-switcher.user
// @version      0.17
// @description  Adds workspace switcher on JV
// @match        http://*.jeuxvideo.com/*
// @match        https://*.jeuxvideo.com/*
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.jv-workspace-switcher {
  position: fixed;
  bottom: 10px;
  right: 10px;
  height: 32px;
  z-index: 200;
}
.jv-workspace-switcher select {
  max-width: 280px;
  height: 100%;
}
.jv-workspace-switcher button {
  height: 100%;
}
.jv-workspace-switcher button:hover {
  filter: brightness(150%);
}
`);

const removeDuplicates = (array) => array.filter((v, i, a) => a.indexOf(v) === i);

if (!document.querySelector('meta[property="og:site_name"').content.match(/jeuxvideo.com/i)) {
  console.log('Worspace Switcher: not on jeuxvideo.com');
  return;
}

const MAX_WORKSPACE_COUNT = 30;
const RECENT_WORKSPACES_COOKIE_NAME = '__WORKSPACES_v1__';
const WORKSPACE_SEPARATOR = '---------------';

function switchWorkspace(newWorkspace) {
  document.location.href = document.location.href.replace(/\/\/.*?(.jeuxvideo.com.*)$/, `//${newWorkspace}$1`);
}

const workspaceButtons = [['www', '#7f2238'], ['dorianm1-www.dev', '#004b43']];

const defaultWorkspaces = [
  ...workspaceButtons.map(([workspace]) => workspace),
  'adrienw1-www.dev',
  'antoinez1-www.dev',
  'bricel1-www.dev',
  'preprod-www',
  'demo1-www.dev',
  'demo2-www.dev',
  'respawn',
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

const workspaceSwitcher = document.createElement('div');
workspaceSwitcher.className = 'jv-workspace-switcher';

const workspaceList = document.createElement('select');

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

workspaceList.onchange = (event) => {
  const workspace = event.target.value;
  if (!workspace) {
    return;
  }
  switchWorkspace(workspace);
};

workspaceButtons.forEach(([workspace, bgColor]) => {
  const switchButton = document.createElement('button');
  switchButton.textContent = workspace;
  switchButton.style = `
    background-color: ${bgColor};
    color: #fff;
    border: none;
  `;
  switchButton.onclick = () => switchWorkspace(switchButton.textContent);
  workspaceSwitcher.appendChild(switchButton);
});

workspaceSwitcher.appendChild(workspaceList);
document.documentElement.appendChild(workspaceSwitcher);
