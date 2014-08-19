layout: post
title: exports vs module.exports in node.js
comments: true
categories: javascript
tags:
  - javascript
  - node.js
  - js
  - module
  - exports
date: 2012-04-20 08:00:00
---
I was confused about how require function works in node.js for a long time. I found when I require a module, sometimes I can get the object I want, but sometimes, I don't I just got an empty object, which give an [imagination](/blog/2012/03/21/a-way-to-expose-singleton-object-and-its-constructor-in-nodejs) that we cannot export the object by assigning it to exports, but it seems somehow we can export a function by assignment.

Today, I re-read the [document](http://docs.nodejs.org/api/modules.html#modules_the_module_object) again, and I finally make clear that I misunderstood the "require" mechanism and how I did that. 

I clearly remember this sentence in the [doc](http://docs.nodejs.org/api/modules.html#modules_the_module_object)

>  In particular **module.exports** is the **same** as the **exports** object.

So I believed that the exports is just a shortcut alias to module.exports, we can use one instead of another without worrying about the differences between them two. 
But this understanding is proved to be wrong. exports and module.exports are different.

Today I found this in the [doc](http://docs.nodejs.org/api/modules.html#modules_module_exports):

> The **exports** object is **created by** the **Module system**. Sometimes this is **not acceptable**, many want their module to be an instance of some class. **To do this assign the desired export object to module.exports.**

So it says that module.exports is different from exports. And it you exports something by assignment, you need to assign it to module.exports.

Let's try to understand these sentences deeper by code examples.

In the saying

> The **exports** object is **created by** the **Module system**.

The word "created by" actually means when node.js try to load a javascript file, before executing any line of code in your file, the module system executes the following code first for you:

{% codeblock lang:js %}
var exports = module.exports
{% endcodeblock %}

So the actual interface in node.js's module system is module object. the actual exported object is `module.exports` not `exports`.
And the `exports` is just a normal variable, and there is not "magic" in it. So if you assign something to it, it is replaced absolutely.

That's why I failed to get the exported object I want when I assign the it to exports variable.

So to export some variable as a whole, we should always assign it to `module.exports`. 
And at same time, if there is no good excuse, we'd better to keep the convention that `exports` is the shortcut alias to `module.exports`. So we should also assign the module.exports to exports.

As a conclusion, to export something in node.js by assignment, we should always follow the following pattern:

{% codeblock lang:js %}
exports = module.exports = {
	...
}
{% endcodeblock %}

 