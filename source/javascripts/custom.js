$.domReady(function() {
  var padding = $(window).height() * 0.8;
  $('<style> body > header:hover { padding-top: '+ padding +'px; } </style>').prependTo('body')
});