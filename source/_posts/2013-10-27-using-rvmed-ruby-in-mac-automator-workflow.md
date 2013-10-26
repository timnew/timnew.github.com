---
layout: post
title: "Using RVMed Ruby in Mac Automator Workflow"
description: ""
date: 2013-10-27 02:22
comments: true
categories: 
category: osx
tags: 
	- ruby
	- RVM	
	- automator
	- Mac
	- OSX
	- service
	- shell
	- finder
sharing: true
footer: false
published: true
---

## Embed Ruby into Automator Workflow

Automator workflow has the ability to execute ruby code, but it is not that obvious if you doesn't know it.

To embed ruby code into workflow, you need to create a "Run Shell Script" action first, then choose "/usr/bin/ruby" as the shell. Then the script in the text box will be parsed and executed as ruby code.

![Ruby In Automator](ruby_in_automator.png)

So, from now on, you know how to embed ruby into automator workflow.

## Use RVM ruby instead of System Ruby
