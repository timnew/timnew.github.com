$.domReady(function() {
  var padding = $(window).height() * 0.7;
  $('<style> body > header .header-expander:hover { padding-bottom: '+ padding +'px; } </style>').prependTo('body')
});