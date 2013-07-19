---
layout: post
title: "DSL to inject data into SQL in Andriod unit test"
description: ""
date: 2013-07-19 21:52
comments: true
categories: 
category: 
tags: []
sharing: true
footer: false
published: false
---


Preparing data in unit test with fixture is bad. Comparing to builder, fixture is harder to maintain. 

When fixture is shared between tests, changing the fixture for one test is very likely to break others. On the other hand, if the fixture is not shared, then the number of fixtures will be increased like explosion, to maintain a huge number of fixtures is also a nightmare.

A good idea to resolve the issue is to introduce builder. With builder, we can easily build a DSL to make the data preparation code more developer friendly