layout: post
title: Embed CodePen snippet in Hexo
comments: true
categories:
  - Package
  - Node.js
  - Hexo
tags:
  - hexo
  - node.js
  - blog
  - tag
  - plugin
  - codepen
  - embedded
ribbon: Package  
date: 2014-08-17 12:49:50
---

[CodePen] is a service that provide `Html`, `JavaScript` and `Css` live show-case. It is another clone of [Js Fiddle], but with cooler UI and support.

Both `CodePen` and `Js Fiddle` provides embedded widget that allow user to embedded their code into blog or articles.

Here is the example, code from `CodePen`:

{% codepen timnew cGEqB 7928 result 257 %}

This is from `Js Fiddle`:

{% jsfiddle timnew/r3j6a92c/4 result,css,html,js %}

[Hexo] has built-in the [Js Fiddle Plug-in] to allow writer to embed code from `Js Fiddle`, which is probably ported from `Octopress`.
But for `CodePen`, there is not such thing.

So I created [hexo-tag-codepen], its provides similar syntax as built-in 'Js Fiddle' plug in:

```
{% raw %}{% codepen userId|anonymous|anon slugHash theme [defaultTab [height [width]]] %}{%endraw%}
```

Now you can embedded `Pens` from `CodePen` in your `Hexo` blog. Enjoy.

For detail, check out [hexo-tag-codepen] document.

[CodePen]: http://codepen.io/
[Js Fiddle]: http://jsfiddle.net/
[Hexo]: http://hexo.io/
[Js Fiddle Plug-in]: http://hexo.io/docs/tag-plugins.html#jsFiddle
[hexo-tag-codepen]: https://github.com/timnew/hexo-tag-codepen
