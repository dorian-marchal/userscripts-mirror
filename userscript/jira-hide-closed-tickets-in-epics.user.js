// ==UserScript==
// @name        jira-hide-closed-tickets-in-epics.user
// @include     https://jira.webedia-group.net/browse/*
// @version     2
// @grant       none
// ==/UserScript==

var issueRows = document.getElementsByClassName('issuerow');

for (var i = 0; i < issueRows.length; ++i) {
  var row = issueRows[i];

  // No icon on opened issues.
  if (row.querySelectorAll('.ghx-accept').length > 0) {
    row.style.opacity = 0.35;
    row.style.textDecoration = 'line-through';
  }
}
