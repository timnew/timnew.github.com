layout: post
title: "Weird! \"def\" behaves different in class_eval and instance_eval"
comments: true
categories: ruby
tags:
  - ruby
  - meta programming
  - class_eval
  - instance_eval
  - comparison
  - define method
date: 2012-08-31 08:00:00
---
I found the behavior of keyword `def` in ruby is really confusing! At least, really confusing to me!
In most case, we use `def` in `class` context, then it defines a instance method on specific class.

{% codeblock Use "def" in "class" lang:ruby %}
class Foo
  def foo
    :foo
  end
  $context = self
end

Foo.new.foo.should == :foo
$context.should == Foo
{% endcodeblock %}

Besides the typical usage, we can also use `def` in block.

{% codeblock Use "def" in "class_eval" block lang:ruby %}
class Foo; end

Foo.class_eval do
  def foo
    :foo
  end
  $context = self
end

Foo.new.foo.should == :foo
$context.should == Foo
{% endcodeblock %}

This previous piece of code works as we reopened the class `Foo`, and add a new method to it. It is also not hard to understand.

The fact that really surprised me is in the following code:

{% codeblock Use "def" in "instance_eval" block lang:ruby %}
class Foo; end

Foo.instance_eval do
  def foo
    :foo
  end
  $context = self
end

Foo.foo.should == :foo # Method foo goes into the Foo class itself rather than Foo's instance!
$context.should == Foo
{% endcodeblock %}

Here we can found that method foo goes into the `Foo` class itself, rather than `Foo`'s instance! But the $context is still `Foo` class!

So in a word, calling `def foo` in `instance_eval` block is equivalent to calling 'def self.foo' in `class_eval` block, even though the context of both block are the class itself. 
So we can figure out that keyword `def` works different than method `define_method` and `define_singleton_method`, since it doesn't depend on self, but the two methods does!

To me it is kind of hard to understand. and confusing. And I think it is not a good design!
Ruby is different to other Java or C#, ruby uses methods on class to take place of the keywords in other languages, such as public, protected and private. In most of the language, they are keywords. But in ruby they are actually the class methods of Class.
This design is good, because it is kind of enabled the developer to extend the "keyword" they can use! But at the same time, this design melted the boundary between customizable methods and predefined keywords, so people won't pay much attention to the difference of the two. So it is important to keep the consistency between methods and keyword behaviors. But `def` breaks the consistency, so it is confusing!

Look the following code:

{% codeblock def vs define_method lang:ruby %}

definition_block = Proc.new do
  def foo
    :foo
  end
  
  define_method :bar do
    :bar
  end
end


class A; end
class B; end

A.class_eval &definition_block
B.instance_eval &definition_block

{% endcodeblock %}

Comparing class `A` and class `B`, we can find that they are different, even they are defined with exactly same block!
