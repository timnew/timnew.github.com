layout: post
title: Introduce Prototype Style OO inheritance in Ruby
comments: true
categories: ruby
tags:
  - ruby
  - object oriented
  - prototype
date: 2012-08-26 08:00:00
---
Days ago, I post a blog about the ruby inheritance hierarchy. When discuss the topic with Yang Lin, he mentioned a crazy but interesting idea that introducing the prototype based OO into ruby.
To introducing the prototype OO into ruby, Lin mentioned a possible approach is by using clone. But I'm not familiar with clone mechanism in ruby. So I tried another approach.
Thanks to Ruby's super powerful meta-programming mechanism, so I can forward the unknown message to prototype by using method_missing. And I encapsulate the code in a module, so every instance extended that module will obtain such capability.

{% codeblock Prototype Module lang:ruby %}
module Prototype
  def inherit_from(prototype)
    @prototype = prototype
    self
  end

  def create_child
    Object.new.extend(Prototype).inherit_from(self)
  end

  def respond_to?(msg_id, priv = false)
    return true if super

    if @prototype
      @prototype.respond_to?(msg_id, priv)
    else
      false
    end
  end

  def method_missing(symbol, *args, &block)
    if @prototype
      @prototype.send(symbol, *args, &block)
    else
      super
    end
  end

  def self.new
    Object.new.extend(Prototype)
  end
end
{% endcodeblock %}

If I have the following code:

{% codeblock Prototype Inheritance lang:ruby %}
a = Object.new

def a.foo
  'foo'
end

b = Object.new
b.extend(Prototype).inherit_from(a)

c = b.create_child

p b.foo # => 'foo'
p c.foo # => 'foo'
{% endcodeblock %}

So `b.foo` and `c.foo` will yield 'foo'.

And I can override the parent implementation by refine a method with the same name:
{% codeblock Prototype Overrides lang:ruby %}
def a.bar
  'bar'
end

def c.bar
  'c.bar'
end

p a.bar # => 'bar'
p b.bar # => 'bar'
p c.bar # => 'c.bar'
{% endcodeblock %}

So I add a new singleton method `bar` in `a`, and `b` automatically inherits the method, and I override the `bar` on object `c`.

As a conclusion that we're able to introduce the prototype based inheritance in ruby by using ruby's powerful meta-programming mechanism. This implementation is only for concept-proof, so its performance is not quite good. But we can try to improve the performance by consolidating process by defining the method dynamically. The child object will query the parent for the first time, if invoking succeeded then it can consolidate the behavior into a method to avoid calling method_missing every time.
