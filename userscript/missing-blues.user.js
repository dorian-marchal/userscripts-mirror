// ==UserScript==
// @name         missing-blues.user
// @version      0.2
// @match        https://webedia.eurecia.com/eurecia/planningVacation/*
// @grant        none
// ==/UserScript==

document.querySelectorAll('#planningVacationContainer tr').forEach((tr) => {
  [/CORRAL Romain/, /MARCHAL Dorian/, /THEVENET Adrien/, /CAMBONI Anthony/, /WEISSBERG Adrien/].forEach((regexp) => {
    if (tr.innerHTML.match(regexp)) {
      tr.style = 'background-color: #FFC;';
    }
  });
});
