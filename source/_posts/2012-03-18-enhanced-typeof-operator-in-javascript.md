---
layout: post
title: "Enhanced typeof() operator in JavaScript"
description: ""
category: javascript
tags: ["javascript", "pitfall", "fix", "js hack", "typeof", "type", "js"]
languages: ["js"]
---

Javascript is weakly typed, and its type system always behaves different than your expectation.
Javascript provide typeof operator to test the type of a variable. it works fine generally. e.g.

{% codeblock typeof default behaviors lang:javascript %}

typeof(1) === 'number'
typeof('hello') === 'string'
typeof({}) === 'object'
typeof(function(){}) === 'function'

{% endcodeblock %}

But it is not enough, it behaves stupid when you dealing with objects created by constructors. e.g.
if you expected
{% codeblock Expected typeof behavior against object lang:javascript %}
typeof(new Date('2012-12-12')) === 'date' // Returns false
{% endcodeblock %}
Then you must be disappointed, since actually
{% codeblock Actual typeof behavior against object lang:javascript %}
typeof(new Date('2012-12-12')) === 'object' // Returns true
{% endcodeblock %}
Yes, when you apply `typeof()` operator on any objects, it just yield the general type "object" rather than the more meaningful type "date".

How can we make the `typeof()` operator works in the way as we expected?
As we know when we create a object, the special property of the object constructor will be set to the function that create the object. which means:

{% codeblock Get constructor property of object lang:javascript %}
(new Date('2012-1-1')).constructor // Returns [Function Date]
{% endcodeblock %}

So ideally we can retrieve the name of the function as the type of the variable. And to be compatible with javascript's native operator, we need to convert the name to lower case. So we got this expression:

{% codeblock Simulate typeof operator behavior with constructor property lang:javascript %}
function typeOf(obj) { // Use capital O to differentiate this function from typeof operator
	return obj ? obj.constructor.name.toLowerCase() : typeof(obj);
}

typeOf(new Date('2012-1-1')) === 'date' // Returns true
{% endcodeblock %}

And luckily, we can also apply this to other primitive types, e.g:

{% codeblock Apply typeOf to primitive types lang:javascript %}
typeOf(123) === 'number'; // Returns true
typeOf('hello') === 'string'; // Returns true
typeOf(function(){}) === 'function';  // Returns true
{% endcodeblock %}

or even

{% codeblock Apply typeOf to anonymous object lang:javascript %}
typeOf({}) === 'object'; // Returns true
{% endcodeblock %}


So in general, we use this expression as new implementation of the `typeof()` operator! **EXCEPT One case**!

If someone declare the object constructor in this way, our new `typeof()` implementation will work improperly!

{% codeblock Closure encapsulated anonymous constructor lang:javascript %}
var SomeClass = (function() {
	return function() {
		this.someProperty='some value';
	}
})();
{% endcodeblock %}

or even define the constructor like this

{% codeblock Anonymous Closure lang:javascript %}
var SomeClass = function() {
	this.someProperty = 'some value';
}
{% endcodeblock %}

And we will find that

{% codeblock Apply typeOf to object instantiated by anonymous constructor lang:javascript %}
typeOf(new SomeClass) === ''; // Returns true
{% endcodeblock %}

the reason behind this is because the real constructor of the SomeClass is actually an anonymous function, whose name is not set.

To solve this problem, we need to declare the name of the constructor:

{% codeblock Closure encapsulated named constructor lang:javascript %}
var SomeClass = (function() {
	return function SomeClass() {
		this.someProperty='some value';
	}
})();
{% endcodeblock %}

or even define the constructor like this

{% codeblock Named constructor lang:javascript %}
var SomeClass = function SomeClass() {
	this.someProperty = 'some value';
}
{% endcodeblock %}

