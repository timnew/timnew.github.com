---
layout: post
title: "Steps to manually uninstall mysql from Mac OS X"
description: ""
date: 2012-05-09 13:05
comments: true
categories: 
category: MacOS
tags: ["mysql","uninstall","trick"]
sharing: true
footer: false
---

1. Execute the following commands in terminal
	{% gist 2642022 %}
2. Update hostConfig
	* Open `/etc/hostconfig` 
	* Remove the line `MYSQLCOM=-YES-`

[Credits](https://steveno.wordpress.com/2009/03/26/uninstall-mysql-on-mac-os-x/)