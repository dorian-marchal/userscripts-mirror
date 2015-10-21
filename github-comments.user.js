// ==UserScript==
// @name        Next comment in Pull Request
// @namespace   dorian.marchal
// @include     https://github.com/*/pull/*
// @version     1
// @grant       none
// ==/UserScript==

var currentCommentIndex = null;

var goToComment = function (index) {

  switch (index) {
    case '-1':
      currentCommentIndex = Math.max(0, currentCommentIndex - 1);
      goToComment(currentCommentIndex);
      break;
    case '+1':
      currentCommentIndex = Math.min($('.timeline-comment:visible').length - 1, currentCommentIndex + 1);
      goToComment(currentCommentIndex);
      break;
    default:
      location.hash = '#' + $('.timeline-comment:visible').eq(index).attr('id');
  }
}


var $navButtons = $('<div>', {
  css: {
    position: 'fixed',
    right: '10px',
    bottom: '10px',
  }
});

// prev
$navButtons.append($('<button>', {
  text: 'Commentaire précédent',
  class: 'btn btn-sm',
  css: {
    'margin-right': '10px',
  },
  click: function () {
    goToComment('-1');
  }
}));

// next
$navButtons.append($('<button>', {
  text: 'Commentaire suivant',
  class: 'btn btn-sm',
  click: function () {
    goToComment('+1');
  }
}));

$('body').append($navButtons);
