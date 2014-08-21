layout: post
title: Negative Index in Coffee-Script
comments: true
categories:
  - Programming
  - JavaScript
  - CoffeeScript
tags:
  - coffeescript
  - array
  - index
  - slice
  - negative
date: 2012-05-29 08:00:00
---
Coffee Script borrowed quite a lot syntax patterns from both Ruby and Python, especially from Ruby.
So people, like me, usually tends to write coffee-script in ruby way.

In ruby, we can retrieve the element in an array in reversed order by using a negative index, which means `array[-1]` returns the last element in the array. This grammar sugar is really convenient and powerful, so we can omit the code like this `array[array.length - 1]`.

But for some reason, coffee-script doesn't inherit this syntax. To me, it is weird. But after analyze this problem in detail, I found the reason.
Coffee script announce it has a golden rule: "coffee-script is just javascript". So all the coffee script must be able to compiled into javascript.

Let's try to analyze how the coffee script is compiled into javascript:

{% codeblock Coffee Script lang:coffeescript %}
array = [1..10]
second = array[1]
last = array[-1] // Psudocode
{% endcodeblock %}

Obviously, the previous code should be compiled as following:

{% codeblock JavaScript lang:js %}
var array, last, second;
array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
second = array[1];
last = array[array.length - 1];
{% endcodeblock %}

The negative index should be processed specially, so we should check the index is negative or not while compiling. This translation seems easy but actually not, since we can and usually use variable as the index.

{% codeblock Variable as index lang:coffeescript %}
array = [1..10]
index = 1
second = array[index]
index = -index
last = array[index]
{% endcodeblock %}

In the previous code, because we use the variable as index, which cannot be verified in compile-time, which means we need to compile the array reference code as following:

{% codeblock Compile Result lang:js %}
var array, index, last, second;
array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
index = 1;
second = index >=0 ? array[index] : array[array.length + index];
index = -index;
last = index >=0 ? array[index] : array[array.length + index];
{% endcodeblock %}

So every time we reference the array, we need to check whether the index is negative or not. This approach absolutely hurts the performance a lot, which in basically unacceptable.
So that's why coffee-script doesn't support the negative index.
