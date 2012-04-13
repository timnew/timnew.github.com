---
layout: post
title: "Powershell Script to rename computer without reboot"
description: ""
date: 2012-04-13 11:46
comments: true
categories: 
category: Powershell
tags: ["powershell", "computer name", "provision", "script", "reboot", "windows"]
sharing: true
footer: false
---

We found a computer name issue when building our private cloud environment on CloudStack over KVM. We found that KVM doesn't support to rename new created instance automatically. 
As a result, all the instance booted from the same disk image have the exactly same computer name, same administrator password.

So we need to do some manual provision work before user can use the new booted instances.
Administrator password can be changed in several ways, it is not a difficult job. But to rename the computer running Windows is not an easy work. The typical way is to call the WMI interface to rename the computer, which is taken as the most "formal" and "documented" way to rename the computer. But this approach require to reboot the instance, which is what we don't like.

So we try some "hack" way to solve this problem, we use powershell scripts to hack the registry. By doing this, we can rename the computer without rebooting, and it works fine on our environment. 
But since it is a hacking way, so there might be some unknown potential issues. Take if on your own risk:

Here is the gist:

{% gist 2373475 %}
