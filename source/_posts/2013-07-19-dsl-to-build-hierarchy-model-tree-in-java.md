---
layout: post
title: "DSL to build hierarchy model tree in Java"
description: ""
date: 2013-07-19 21:42
comments: true
categories: 
category: 
tags: 
  - Java
  - DSL
  - hierarchy
  - tree
  - prepare data
  - factory
  - builder
sharing: true
footer: false
published: false
---

In my unit test of my current android project, I need to inject some location data into the database. The location data consists 3 level of nodes, the cities, the counties and the towns. Several towns are belongs a county, and several counties are belongs to a city.  
The relationship is a typical one-to-many mapping, so I uses an extra column `parent_id` in child node to hold the `id` of its parent.

In the unit test, I need to prepare different types of location trees. In the beginning I tried to build the data with generic data injection DSL, here is a simple example:

{% codeblock Inject Location Tree with generic data injection DSL lang:java %}

{% endcodeblock %}

This solution works but not as good as I expected. The code is verbose, and hard to understand and maintain. So I tried to build specific `Injector` for `Location`.

{% codeblock Location Injector lang:java %}

{% endcodeblock %}

The code become more readable but still verbose and not flexible. And there are a bunch of meaning less `enter` and `exit` call, which is boring. 
So I refactored the injector and refined the DSL once again.
By playing `method delegation` trick, the code is refined as concise as possible.

{% codeblock Data preparation with new DSL lang:java %}

{% endcodeblock %}

{% codeblock DSL implementation lang:java %}

{% endcodeblock %}