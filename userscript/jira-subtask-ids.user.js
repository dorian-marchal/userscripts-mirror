// ==UserScript==
// @name         jira-subtask-ids.user
// @version      2
// @match        https://jira.webedia-group.net/browse/*
// @grant        none
// ==/UserScript==

document.querySelectorAll('#issuetable .issuerow .issue-link').forEach((issue) => {
  issue.textContent = `${issue.dataset.issueKey} ${issue.textContent}`;
});
