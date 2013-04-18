---
layout: post
title: "Mac OS X Case Insentive Filename Pitfall"
description: ""
date: 2013-04-18 13:22
comments: true
categories: 
category: Mac
tags: 
  - Mac
  - OSX
  - Case Insensitve
  - File Name
  - Pitfall
  - Asset Pipeline
  - Node.js
  - Asset
  - JavaScript
  - Snockets
  - Connect-Assets
sharing: true
footer: false
---

I was working on the YouTube video playback feature for [LiveHall](http://live-hall.herokuapp.com) last night, and have it works successfully on my local devbox, which is running Mac OS X. Then I deployed the code to Heroku, without any regression.

But today morning, when I have the demonstrate the new features, I met server error! It says 1 of the 4 javascripts are missing, so the Jade template failed to render. 

This is a very wield issue, then I try the same data on my local dev box once again, and it works perfect! But it does yield error on the production!   Then I tried to use heroku toolbelt to run ls command on the production, and I found the there are 4 coffee scripts there.  
Then I tried to enforce heroku to redeploy the app by using `git push --force`, but the issue remains!  
Then I even tried to dive into the dependency pacakges `connect-assets` and `snockets`, but still found nothing useful.

Same code, same data, but different result! Very odd issue!

After half an hour fighting against the code, I suddenly noticed I the file name is `RevealJSPresenter.coffee`, whose "S" is capital S! And I reference the file with name `#= require ./presenter/RevealJsPresenter`, whose 's' is a lowercase 's'!

And `snockets` depends on the OS feature to locate the file. On my local dev environment, I'm using Mac. Although OS X allow user to explicitly format the HFS+ into file name case sensitive mode, but it is case insensitive by default. So snockets can locate the file even the case is wrong.  
But once I have deployed to heroku, which, I assume, runs Linux, whose file system is absolutely filename case sensitive. So the snockets won't be able to locate the file due to the case issue.

To resolve the bug, I renamed my file in RubyMine, then try to commit in terminal.  
But when I commit, I met another very interesting issue, that git says there is no file changed, so it refused to commit.  
It is still the same issue, due to FS is case insensitive, git cannot detect the renaming.  

This problem is more common when coding on Windows, but CI or production runs on Linux. And the very common solution is to pull the code in case sensitive environment, then rename the file and commit it.

But I found another more easier way to do it:

Using `git mv` in terminal to rename the file, which will enforce git to track the file renaming action. 

Or

Most of Git GUIs are able to track file name case changing, so you can try to commit the change with the tool, such as RubyMine or SourceTree.
