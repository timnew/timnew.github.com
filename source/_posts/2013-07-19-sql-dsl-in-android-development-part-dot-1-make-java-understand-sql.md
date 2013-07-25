---
layout: post
title: "SQL DSL in Android development  - Part.1 Make Java understand SQL"
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

Android supports Sqlite database for application to manage big dataset. Due to the limitation of Java language, the API isn't as convenient as expected. Event with `SQLiteQueryBuilder` and `DatabaseUtils`, it is still a nightmare to manage complex queries in database heavy application.

