---
layout: post
title: "How to solve key_read failed error in git push"
description: ""
date: 2012-05-14 10:47
comments: true
categories: 
category: "git"
tags: ["git","ssh","error","github","solution"]
sharing: true
footer: false
---

I assigned a dedicated ssh key pair for github repos.
And I have associated the key pair with github correctly in `~/.ssh/config`.
But each time when I try to access github repos via ssh, both read(such pull or fetch) or write(such as push), I will get a strange error:

	key_read: uudecode [some SSH key code]
	ssh-rsa [SSH key code]
	failed

I tried a lot to fix the problem, and finally I solved the problem by delete the file `~/.ssh/known_hosts`
I assume the problem might be caused that there is some invalid association cached in the file. So maybe you can solve the problem by removing the related entries instead of delete the whole file.