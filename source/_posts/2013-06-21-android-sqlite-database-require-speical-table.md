---
layout: post
title: "Android SQLite database require speical table"
description: ""
date: 2013-06-21 00:03
comments: true
categories: 
category: android
tags: 
  - android
  - sqlite
  - table
  - crash
  - exception
  - android_metadata
sharing: true
footer: false
published: true
---

I'm working on an Android application recently. During the development, our new app inherited a legacy SQLite database that created by a WinCE application.

Android announce that it supports the SQLite database, so we don't worry about that too much. But when we try to open the legacy database with  `SQLiteDatabase.openDatabase`, it throws exception on our face!

After debugging, we found to open SQLite database with `SQLiteDatabase` class requires the database to have a special table called `android_metadata`, which contains the locale information. And `SQLiteDatabase` yields exception when the table cannot be found.

The table will be created automatically when `SQLiteDatabase` creates the database, but if the app need to open the database not created by android, some patch is needed.

Here is the script to patch the database:

{% codeblock Patch Database lang:sql%}

CREATE TABLE android_metadata (locale TEXT);
INSERT INTO android_metadata VALUES('en-US');

{% endcodeblock %}
