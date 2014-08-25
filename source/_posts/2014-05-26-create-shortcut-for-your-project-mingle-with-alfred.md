layout: post
title: Create shortcut for your project Mingle with Alfred
comments: true
categories:
  - Practice
  - Mac
tags:
  - mingle
  - Alfred
  - custom search
  - shortcut
date: 2014-05-26 08:00:00
---
A few days ago, I post a blog([Create shortcut for your project Mingle with Chrome OmniBox](/blog/2014/05/09/create-shortcut-for-your-project-mingle-with-chrome-omnibox)) about that we can access specific Mingle story card directly from Chrome "OmniBox". The shortcut is created by registering Mingle search as custom search in Chrome.

Today I found applying the same trick to launch apps, we can have one step further. In Mac OS, almost all the launcher apps support custom search, such as [Aflred](http://www.alfredapp.com/), [QuickSilver](http://qsapp.com/), [Launcher](http://www.nulana.com/launcher). Even in Windows, we also have [Launchy](http://www.launchy.net/). For Linux, I believe there should be similar stuff. So the trick is environment independent.

To add custom search query in different launch app is quite different, but should be straightforward.  
I'll take Alfred as example:

1. Open Alfred Preference
{% asset_img alfred.png Alfred Preferences %}

2. Register Mingle as custom search
{% asset_img detail.png Alfred Preferences  %}

The url for custom search can be get with the same approach described in [previous post](/blog/2014/05/09/create-shortcut-for-your-project-mingle-with-chrome-omnibox). Alfred uses `{query}` as placeholder, so you should replace the `%s` with `{query}` when coping the url from chrome to Alfred.
