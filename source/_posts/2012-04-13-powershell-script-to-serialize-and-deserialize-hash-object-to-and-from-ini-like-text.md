layout: post
title: Powershell script to serialize and deserialize hash-object to and from ini-like text
comments: true
categories: Powershell
tags:
  - powershell
  - script
  - serialization
  - hash
  - configuration
  - ini
date: 2012-04-13 08:00:00
---
Powershell and .net fx provides a dozen of approaches to manipulate hash-object. And it is really easy and convenient to initialize hash-object with values from environment variables, registry or cli arguments. 
And Hash-Object can be accessed and built into hierarchy easily, so to use powershell hash-object as deploy configuration is really powerful and convenient.

But in our system, the application uses the ini-like key-value pair plain text as the initial configuration file. So our deploy script need the ability to serialize and deserialize hash-object to and from ini-like config.

So I composed this piece of script.

{% gist 2373809 %}