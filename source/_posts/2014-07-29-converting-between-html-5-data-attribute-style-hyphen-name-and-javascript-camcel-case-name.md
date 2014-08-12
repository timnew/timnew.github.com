layout: post
title: converting between HTML 5 data-attribute style hyphen name and javascript camcel-case name
comments: true
categories: javascript
tags:
  - html
  - hyphen
  - name
  - conversion
  - camel-case
  - data attribute
  - javascript
date: 2014-07-29 08:00:00
---
I found a bug in [widget.coffee](http://bower.io/search/?q=widget.coffee) today. To fix the issue, I need the conversion between HTML 5 `data-attribute` name and javascript function name, e.g. conversion between `data-action-handler` and `actionHandler`.

By taking jQuery implementation as reference, I come up 2 utility functions for the conversion:

{% codeblock NameConversion lang:coffeescript %}

Utils = 
  hyphenToCamelCase: (hyphen) -> # Convert 'action-handler' to 'actionHandler'
    hyphen.replace /-([a-z])/g, (match) ->
      match[1].toUppercase()

  camelCaseToHyphen: (camelCase) -> # Convert 'actionHandler' to 'action-handler'
    camelCase.replace(/[A-Z]/g, '-$1').toLowerCase()

  attributeToCamelCase: (attribute) -> # Convert 'data-action-handler' or 'action-handler' to 'actionHandler'
    Utils.hyphenToCamelCase dataAttribute.replace(/^(data-)?(.*)/, '$2')

  camelCaseToAttribute: (camelCase) -> # Convert 'actionHanlder' to 'data-action-handler'
    'data-' + Utils.camelCaseToHyphen(camelCase)

{% endcodeblock %}

Here is a more solid implementation based on previous one.

{% codeblock a sloid javascript version lang:javascript %}

var Utils = (function() {
  function hyphenToCamelCase(hyphen) {
    return hyphen.replace(/-([a-z])/g, function(match) {
      return match[1].toUppercase();
    });
  }

  function camelCaseToHyphen(camelCase) {
    return camelCase.replace(/[A-Z]/g, '-$1').toLowerCase();
  }

  function attributeToCamelCase(attribute) {
    return hyphenToCamelCase(dataAttribute.replace(/^(data-)?(.*)/, '$2'));
  }

  function camelCaseToAttribute(camelCase) {
    return 'data-' + camelCaseToHyphen(camelCase);
  }

  return {
    hyphenToCamelCase: hyphenToCamelCase,
    camelCaseToHyphen: camelCaseToHyphen,
    attributeToCamelCase: attributeToCamelCase,
    camelCaseToAttribute: camelCaseToAttribute
  };
})();

{% endcodeblock%}