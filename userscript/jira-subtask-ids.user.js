// ==UserScript==
// @name         jira-subtask-ids.user
// @version      1
// @match        https://jira.webedia.fr/browse/*
// @grant        none
// ==/UserScript==

document.querySelectorAll('#issuetable .issuerow .issue-link').forEach((issue) => {
  issue.textContent = `${issue.dataset.issueKey} ${issue.textContent}`;
});
