---
layout: post
title: "JavaScript Prototype Chain Mutator"
description: ""
date: 2014-07-30 21:10
comments: true
categories: 
category: javascript
tags: 
  - javascript
  - prototype
  - inheritance
  - class
  - mutation
  - mutator
  - node.js
  - browser
  - json
  - ajax
  - npm
  - bower
sharing: true
footer: false
published: true
---

In JavaScript world, JSON serialization is widely used. When fetching data from server via Ajax, the data is usually represented in JSON; or loading configuration/data from file in Node.js application, the configuration/data is usually in JSON format.

JSON serialization is powerful and convenient, but there is limitation. For security and other reason, behavior and type information are forbidden in JSON. Functions members are removed when stringify a JavaScript object, also functions are not allowed in JSON.

Comparing Yaml to Ruby, this limitation isn't that convenient when writing JavaScript application. For example, to consume the JSON data fetched via ajax from server, I really wish I can invoke some method on the deserialized model. 

Here is simple example:

{% codeblock Ideal World  lang:coffeescript %}

class Rect
  constructor: (width, height) ->
    @width = width if width?
    @height = height if height?
    
  area: ->
    @width * @height

$.get '/rect/latest', (rectJSON) ->  
  rect = JSON.parse(rectJSON)
  console.log rect.area() # This code doesn't work because there is rect is a plain object

{% endcodeblock %}

The code doesn't work, because `rect` in a plain object, which doesn't contains any behavior. Someone called the rect `DTO`, Data Transfer Object, or POJO, Plain Old Java Object, a concept borrowed from Java world. Here we call it `DTO`.

To add behaviors to `DTO`, there are variant approaches. Such as create a behavior wrapper around the `DTO`, or create a new model with behavior and copy all the data from `DTO` to model. These practices are borrowed from Java world, or traditional Object Oriented world.

In fact, in JavaScript, there could be a better and smarter way to achieve that: `Object Mutation`, altering object prototype chain on the fly to convert a object into the instance of a specific type. The process is really similar to biologic genetic mutation, converting a species into another by altering the gene, so I borrow the term `mutation`.

With the idea, we can achieve this:

{% codeblock Mutate rect with Mutator lang:coffeescript %}

class Rect
  constructor: (width, height) ->
    @width = width if width?
    @height = height if height?
    
  area: ->
    @width * @height

$.get '/rect/latest', (rectJSON) ->  
  rect = JSON.parse(rectJSON)

  mutate(rect, Rect)
  
  console.log rect.area() 

{% endcodeblock %}

The key to implement `mutate` function is to simulate `new` operator behavior, alerting `object.__proto__` and apply `constructor` to the instance! For more detail, check out the library [mutator](https://github.com/timnew/mutator) [![Bower version][bower-image]][homepage] [![NPM version][npm-image]][npm-url], which is available as both `NPM` package and `bower` package.

When implementing the `mutator`, in IE, again, in the evil IE, the idea doesn't work. Before IE 11, JavaScript prototype chain for instance is not accessible. There is nothing equivalent to `object.__proto__` in IE 10 and prior. The most similar workaround is doing a hard-copy of all the members, but it still fails in type check and some dynamical usage.

**Background** 

> `object.__proto__` is a Mozilla "private" implementation until EcmaScript 6.    
> It is interesting that most JavaScript support it except IE.  
> Luckily, IE 11 introduced some features in EcmaScript 6, `object.__proto__` is one of them.

[bower-image]: https://badge.fury.io/bo/widget.coffee.svg
[homepage]: https://github.com/timnew/mutator
[npm-image]: http://img.shields.io/npm/v/mutator.svg
[npm-url]: https://www.npmjs.org/package/mutator