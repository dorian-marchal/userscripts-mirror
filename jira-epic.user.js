// ==UserScript==
// @name        Hide closed tickets in epic
// @namespace   dorian.marchal
// @include     https://jira.webedia.fr/browse/*
// @version     1
// @grant       none
// ==/UserScript==

var issueRows = document.getElementsByClassName('issuerow');

for (var i = 0; i < issueRows.length; ++i) {
  var row = issueRows[i];
  console.log(row.childNodes[0]);
  // No icon on opened issues.
  if (row.querySelectorAll('.ghx-accept').length > 0) {
    row.style.opacity = 0.35;
    row.style.textDecoration = 'line-through';
  }
}
