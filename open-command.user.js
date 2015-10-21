// ==UserScript==
// @name        Open command in Pull Request
// @namespace   dorian.marchal
// @include     https://github.com/*/pull/*
// @version     1
// @grant       none
// ==/UserScript==

$('.inline-comments:visible').each(function () {
  var $comment = $(this);
  var lineNumber = $comment.prev().find('[data-line-number]').data('line-number');
  var fileName = $comment.parents('.file').find('.file-info .user-select-contain').attr('title');
  var command = 'atom ' + fileName + ':' + lineNumber;

  $comment.find('.timeline-comment-header-text').append($('<input>', {
    value: command,
    css: {
      float: 'right',
      'font-size': '0.8em',
    },
    mouseup: function () {
      $(this).select();
    },
  }));
});
