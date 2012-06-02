---
layout: post
title: "Eigenclass in ruby"
description: ""
date: 2012-05-25 15:25
comments: true
categories: 
category: "ruby"
tags: ["ruby", "meta programming", "eigen", "eigenclass", "meta class", "singleton class"]
sharing: true
footer: false
---

To me, "Eigenclass" is a weird name. Here is the definition of "Eigenclass" from [wikipedia](https://en.wiktionary.org/wiki/eigenclass):

{% blockquote 松本行弘(Yukihiro Matsumoto) https://en.wiktionary.org/wiki/eigenclass [Wikipedia] %}
A hidden class associated with each specific instance of another class.
{% endblockquote %}

"Eigen" is a Dutch word, which means "own" or "one's own". So "Eigenclass" means the class that class owned by the instance itself.

To open the eigenclass of the object, Ruby provide the following way:

{% codeblock Open Eigenclass lang:ruby %}

foo = Foo.new

class << foo
	# do something with the eigenclass of foo
end 

{% endcodeblock %}

Since the in most cases, the purpose that we open a eigenclass is to define singleton methods on specific object. So Ruby provide an easy way to define the singleton method on specific instance:

{% codeblock Shorten saying lang:ruby %}

foo = Foo.new

def foo.some_method
	# do something
end

{% endcodeblock %}

Since "static method" or "class method" is actually the singleton method of a specific class. So this statement is usually used to declare the "class method".

Besides this simpler statment, we also can open the eigenclass of the class to achieve the same result.
We can write this:

{% codeblock Open eigenclass of the class lang:ruby %}

class Foo
	
	class << self
		# define class methods
	end
	
	# define instance methods
	
end

{% endcodeblock %}

Since we're in the class block, so the "self" indicates the Foo class instance. So we can use `class << self; end` to open the eigenclass of the class.