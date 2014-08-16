layout: post
title: Material Design Shadow in HTML
comments: true
categories:
  - Html
  - Design
tags:
  - Design
  - Material
  - Google
  - Html
  - CSS
  - Shadow
  - Visual
  - box-shadow
date: 2014-08-16 17:45:05
ribbon:
ribbon_style:
ribbon_color:
---

Working on `Hexo` theme customization in past few days. And wish to borrow some concepts from Google's [Material Design].

The concept that I'm interested most in `Material Design` is the [Dimensionality]. It identify visual area on the page with `Shadow`.
By defining multiple shadow configuration, it creates layers in a 2-D space! Simple and efficient. What a graceful solution!

By referencing the [Shadow Definition] in the spec, I recreate the effect with plain CSS.

Clicking the div will shift the shadow depth.

{% jsfiddle timnew/r3j6a92c/4 result,css,html,js %}


[Material Design]: http://www.google.com/design/spec/material-design/introduction.html
[Dimensionality]: http://www.google.com/design/spec/layout/layout-principles.html#layout-principles-dimensionality
[Shadow Definition]: http://www.google.com/design/spec/layout/layout-principles.html#dimensionality-%20Shadows-1
