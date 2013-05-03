---
layout: post
title: "JSONView Chrome Extension Dark Theme"
description: ""
date: 2013-03-15 10:48
comments: true
categories: 
category: Theme
tags: 
  - JSONView
  - Chrome Extension
  - Theme
  - CSS
  - Style
  - Consolas
  - Dark
sharing: true
footer: false
---

[JSONView]( https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) is a very popular JSON formatter for Chrome, which automatically prettifies the JSON content.

JSONView provide a very sweety feature that allow user to customize the css used to format the JSON. And I love dark theme and the Consolas font so much, so I customized my dark own dark theme for JSONView.

Here is my theme css, and you can copy it to your JSONView theme editor to apply.  
Also you can find code on gist: [https://gist.github.com/timnew/5167241](https://gist.github.com/timnew/5167241)

![Theme Preview](/images/2013-03-15-jsonview-chrome-extension-dark-theme/preview.png "Theme Preview")

{% codeblock Dark Theme for JSONView lang:css %}
body {
  white-space: pre;
  font-family: consolas;
  color: white;
  background: black;
}

.property {
  color: orange;
  font-weight: bold;
}

.type-null {
  color: gray;
}

.type-boolean {
  color: orangered;
}

.type-number {
  color: lightblue;
}

.type-string {
  color: lightgreen;
}

a {
  color: dodgerBlue;
}

.callback-function {
  color: gray;
}

.collapser:after {
  content: "-";
}

.collapsed > .collapser:after {
  content: "+";
}

.ellipsis:after {
  content: " ... ";
}

.collapsible {
  margin-left: 2em;
}

.hoverable {
  padding: 1px 2px 1px 2px;
  border-radius: 3px;
}

.hovered {
  background-color: rgba(255, 255, 255, .3);  
  
}

.collapser {
  padding-right: 6px;
  padding-left: 6px;
}
{% endcodeblock %}