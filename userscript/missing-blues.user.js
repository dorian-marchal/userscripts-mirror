// ==UserScript==
// @name         missing-blues.user
// @version      0.1
// @match        https://webedia.eurecia.com/eurecia/planningVacation/*
// @grant        none
// ==/UserScript==

document.querySelectorAll('#planningVacationContainer tr').forEach((tr) => {
  [/MARCHAL Dorian/, /ZIMMERMANN Antoine/, /LEYDET Brice/, /WEISSBERG Adrien/].forEach((regexp) => {
    if (tr.innerHTML.match(regexp)) {
      tr.style = 'background-color: #FFC;';
    }
  });
});
