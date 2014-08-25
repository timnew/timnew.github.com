layout: post
title: How to launch Mac OS Terminal as Interactive Shell rather than Log-in Shell
comments: true
categories:
  - Practice
  - Mac
tags:
  - Mac
  - bash
  - shell
  - configuration
  - terminal
date: 2012-05-04 08:00:00
---
As described in [previous post](/blog/2012/04/26/bash-profile-on-mac-os-x/), Mac OS launch its terminal as Log-In shell rather than Interactive Shell, which is different to default behavior of Unix and Linux. As a result, Terminal will load "bash_profile" as its profile rather than the normal "bashrc".

This unique behavior might cause some problem when you try to port CLI tool from Unix or Linux.
Because basically, the ported app infers that the bash_profile should be loaded only once, and only when user just logged in. But in Mac OS, this inference is wrong, which can cause some weird problem.

This default behavior sometimes is annoying, and in fact, this Mac OS Terminal's "unique" behavior can be configured. And even more, you can use other shell program, such as ksh, rather than the default bash.

Mac user can customize this behavior in Terminal's Preferences dialog of Terminal app.
{% asset_img PreferencesDialog.png "Terminal Preferences Dialog" %}

If you choose the command to launch bash, the launched shell will become a interactive shell, which will load .bashrc file rather than .bash_profile file.
