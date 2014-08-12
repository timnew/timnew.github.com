layout: post
title: A way to expose singleton object and its constructor in node.js
tags:
  - javascript
  - node.js
  - js hack
  - js
  - pattern
  - singleton
  - module
  - exports
categories: javascript
comments: true
date: 2012-03-21 08:00:00
---
In [Node.js](nodejs.org) world, we usually encapsulate a service into a module, which means the module need to export the façade of the service. In most case the service could be a singleton, all apps use the same service.

But in some rare cases, people might would like to create several instances of the service ,which means the module also need to also export the service constructor.

A very natural idea is to export the default service, and expose the constructor as a method of the default instance. So we could consume the service in this way:

{% codeblock Ideal Usage lang:js %}
var defaultService = require('service');
var anotherService = service.newService();
{% endcodeblock %}

So we need to write the module in this way:

{% codeblock Ideal Export lang:js %}
function Service() { }

module.exports = new Service();
moudle.exports.newService = Service;

{% endcodeblock %}

<del>But for some reason, node.js doesn't allow module to expose object by assigning the a object to module.exports. 
To export a whole object, it is required to copy all the members of the object to `moudle.exports`, which drives out all kinds of tricky code.</del>
<ins>I misunderstood how node.js require works, and [HERE](/blog/2012/04/20/exports_vs_module_exports_in_node_js) is the right understanding. Even I misunderstood the mechanism, but the conclusion of this post is still correct. To export function is still a more convenient way to export both default instance and the constructor.</ins>

And things can become much worse when there are backward reference from the object property to itself.
So to solve this problem gracefully, we need to change our mind.
Since it is proved that it is tricky to export a object, can we try to expose the constructor instead?

Then answer is yes. And Node.js does allow we to assign a function to the module.exports to exports the function. 
So we got this code.

{% codeblock Export Constructor lang:js %}
function Service() { }
module.exports = Service;
{% endcodeblock %}

So we can use create service instance in this way:

{% codeblock Create Service lang:js %}
var Service = require('service');
var aService = new Service();
{% endcodeblock %}

As you see, since the one we exported is constructor so we need to create a instance manually before we can use it. Another problem is that we lost the shared instance between module users, and it is a common requirement to share the same service instance between users.

How to solve this problem? Since as we know, function is also kind of object in javascript, so we can kind of add a member to the constructor called default, which holds the shared instance of the service.

This solution works but not in a graceful way! A crazy but fancy idea is that can we transform the constructor itself into kind of singleton instance??!! Which means you can do this:

{% codeblock Export Singleton lang:js %}
var defaultService = require('service');
defaultService.foo();
var anotherService = service();
anotherService.foo();
{% endcodeblock %}

The code style looks familiar? Yes, jQuery, and many other well-designed js libraries are designed to work in this way. 
So our idea is kind of feasible but how?

Great thank to Javascript's prototype system (or maybe SELF's prototype system is more accurate.), we can simply make a service instance to be the constructor's prototype.

{% codeblock Actual Export lang:js %}
function Service() { }
module.exports = Service;
Service.__proto__ = new Serivce;
{% endcodeblock %}

Sounds crazy, but works, and gracefully! That's the beauty of Javascript.