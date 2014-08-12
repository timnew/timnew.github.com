---
layout: post
title: "Some tricky ways to calculate integer in javascript"
description: ""
date: 2013-02-24 22:09
comments: true
categories: 
category: javascript
tags: 
  - javascript
  - integer
  - bitwise
  - calculation
  - trick
sharing: true
footer: false
---

Javascript is famous for its lack of preciseness, so it always surprises and make joke with the developers by breaking the common sense or instinct.

Javascript doesn't provide `integer` type, but in daily life, `integer` sometimes is necessary, then how can we convert a trim a float number into integer in Javascript?  
Some very common answers might be `Math.floor`, `Math.round` or even `parseInt`. But besides calling Math functions, is there any other answer? 

The answer is bitwise operations. Amazing? Yes. Because bitwise operations are usually only applied to integers, so Javascript will try to convert the `number` into `"integer"` internally when a bitwise operation is applied, even it is still represented in type of `number`

Suppose `value = 3.1415926`, and we want `integer` is the trimmed value of `value`, then we can have:

{% codeblock Trim Float Number lang:js %}

var value = 3.1415926;

var integer = Math.floor(value);
integer = Math.round(value);
integer = parseInt(value);
integer = ~~value; // Bitwise NOT
integer = value | 0; // Bitwise OR
integer = value << 0; // Left Shift
integer = value >> 0; // Sign-propagating Right Shift
integer = value >>> 0; // Zero-fill Right Shift

{% endcodeblock %}

For more detail information about bitwise operation in javascript, please check out the [MDN document](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators)

All approaches listed before are working, but with different performance. And according to the result from [JsPerf](http://jsperf.com/math-floor-vs-math-round-vs-parseint/42), I sort the algorithms by performance from good to bad:

1. `integer = ~~value;`
2. `integer = value >>> 0;` and `integer = value << 0;`
3. `integer = Math.floor(value);`
4. `integer = value >> 0;`
5. `integer = value | 0;`
6. `integer = Math.round(value);`
7. `integer = parseInt(value);`

NOTE: The test cases are running in Chrome 24.0.1312.57 on Mac OS X 10.8.2

