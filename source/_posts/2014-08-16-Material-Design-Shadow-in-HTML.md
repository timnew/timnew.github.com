layout: post
title: Material Design Shadow in HTML
comments: true
categories:  
  - Design
  - Html
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
update: 2014-08-16 18:24:30
ribbon: Design
---

Working on `Hexo` theme customization in past few days. And wish to borrow some concepts from Google's [Material Design].

The concept that I'm interested most in `Material Design` is the [Dimensionality]. It identify visual area on the page with `Shadow`.
By defining multiple shadow configuration, it creates layers in a 2-D space! Simple and efficient. What a graceful solution!

By referencing the [Shadow Definition] in the spec, I recreate the effect with plain CSS.

Clicking the div will shift the shadow depth.

{% jsfiddle timnew/r3j6a92c/4 result,css,html,js %}

-----

### Mobile Support

Test it on Mobile, and found the top-shadow is not displayed properly. The reason is that I used `multiple-shadow` to apply `Top Shadow` and `Bottom Shadow` to the same div. But according to [Box-Shadow MDN Document], `Multiple shadows` is only supported by iOS Safari with `-webkit-` prefix. So it doesn't work properly.

---

### Polymer and Angular-Js official implementations

Before recreate it, I also checked the [Polymer] and [Angular JS], and the result is disappointing. `Ploymer` version has better quality than `Angular Js` version, `Angular JS` one is still very buggy.

Even they're functioning, either `Polymer` or `Angular-JS` is too intrusive or too heavy for simple page to use, such as blog. If you don't really need these transition animations, to implement these basic effects, CSS3 should be enough.

[Material Design]: http://www.google.com/design/spec/material-design/introduction.html
[Dimensionality]: http://www.google.com/design/spec/layout/layout-principles.html#layout-principles-dimensionality
[Shadow Definition]: http://www.google.com/design/spec/layout/layout-principles.html#dimensionality-%20Shadows-1
[Box-Shadow MDN Document]: https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow

[Polymer]: http://www.polymer-project.org/components/paper-elements/demo.html
[Angular JS]: https://material.angularjs.org/
