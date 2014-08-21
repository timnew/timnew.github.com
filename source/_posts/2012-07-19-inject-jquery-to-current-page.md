layout: post
title: Inject jQuery to current page
comments: true
categories:
  - Practice
  - Web
tags:
  - jQuery
  - browser
  - javascript
  - bookmark
  - execution
  - inject
  - script
  - trick
date: 2012-07-19 08:00:00
---
Now I'm hacking some web sites to try to grab the interesting informations from the page. But for some reason, all the sites I'm working on now, doesn't included jQuery, they uses YUI or extJS, which makes me feel super inconvenient when trying hacking the page pattern.

Do I need to find a way to inject jQuery into the current page that I'm browsing.
Thanks to the browser address bar which allow us to execute javascript directly on current session. And also thanks to bookmark, which allow us to persists the script into bookmark, and invoke it with only one mouse click.

So I wrote this:

{% gist 3137257 %}

With this, we can quickly inject jQuery into current session in no time.

You can drag the following link to your browser favorites bar to:
<a href="javascript:var%20b=document.body;if(b){void(z=document.createElement('script'));void(z.type='text/javascript');void(z.src='http://code.jquery.com/jquery-1.7.2.min.js');void(b.appendChild(z));}else{}">Inject jQuery</a>
