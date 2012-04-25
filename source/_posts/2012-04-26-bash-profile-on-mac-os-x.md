---
layout: post
title: "Bash Profile on Mac OS X"
description: ""
date: 2012-04-26 01:02
comments: true
categories: 
category: Mac
tags: ["Mac","Bash","Shell","Configuration","User Profile"]
sharing: true
footer: false
---

In Linux and Unix world, there are 2 common used shell profiles: ~/.bashrc and ~/.bash_profile. These two profiles are usually used to initialize user bash environment, but there still are some slightly differences between them two.
According to [bash manual](http://linux.die.net/man/1/bash), ".bashrc" is "interactive-shell startup file", and ".bash_profile" is "login-shell startup file".

### What's the difference between interactive-shell and login-shell
Basically, the login-shell means the shell opened when user log in via console. It could be the shell opened on local computer after you entered correct user name and password, or the shell opened when you ssh to a remote host. 
So according to the bash_profile will be loaded only once, that's right after you logged into a computer, either locally or remotely.

And, on the other hand, the interactive-shell could be more widely used, be seen more often. It is the shell opened after you logged in, such as the shell opened from KDE or Gnome. 

### Mac Terminal's Pitfall
According to the manual, the Terminal App on Mac is the typical "interactive-shell", so theoretically Terminal should load ".bashrc" to initialize the shell environment. But the fact is Terminal doesn't load the ".bashrc", instead it load ".bash_profile" for initialization.
So in a word, Mac's Terminal doesn't follow the routine strictly. We need to be aware it.

And not all the shell are interactive! If the shell is not interactive, the Terminal App won't load the profile file to initialize the environment.
A typical non-interactive shell in the shell that TextMate used to run command script, which means in TextMate's shell, these environment variables, path and even alias you used in you daily life might not be available for TextMate's command.
And also the most hurt one, the rvm function also won't be available in TextMate's command shell, which means if you call rake or rails in TextMate's command script, you are very possibly got error because it cannot find proper gem or other resources.
So you should always remember to source and run the ".bash_profile" file or setup these values once again.
