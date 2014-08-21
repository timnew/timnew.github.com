layout: post
title: Ruby Class Inheritance
comments: true
categories:
  - Programming
  - Ruby
tags:
  - inheritance
  - ruby
  - class
  - class methods
  - inheritance hierarchy
  - eigenclass
date: 2012-08-23 08:00:00
---
I just realize I have misunderstood the ruby "class methods" for quite a long time!

Here is a piece of code:
{% codeblock Instance Methods Inheritance lang:ruby %}

class A
  def foo
    'foo'
  end
end

class B < A
end

a = A.new
b = B.new

a.foo.should == 'foo'
b.foo.should == 'foo'

{% endcodeblock %}

The previous piece of code demonstrated the typical inheritance mechanism in almost every Class-Object style OO language (There are a few exceptions, which are Prototype inheritance. Such as JavaScript, but it is also a miracle that whether Javascript is OO language XD ).
In most common OO languages, this is what inheritance about! But in Ruby, things is not that easy! Great thanks to Ruby's eigen-class (aka Singleton class or Metaclass)

In ruby, I just found that derived class not just inherits the instance methods but also the class methods! It is kind of surprise to me!
{% codeblock Class Methods Inheritance lang:ruby %}
class A
  def self.bar
    'bar'
  end
end

class B < A
end

A.bar.should == 'bar'
B.bar.should == 'bar'
{% endcodeblock %}

For most people who knows Java or C# or even C++, who won't be surprised about `A.bar.should == 'bar'`, but you might feel surprised about `B.bar.should == 'bar'` like I do.

To me, bar is declared on class A, B inherits A, than I can even call method declared on class A on class B! It is amazing!

Since in ruby, "class method" is actually the instance method of the eigen-class of the class. And `def self.foo` is just a syntax sugar. So we can rewrite the code as:

{% codeblock Rewriten Class Methods Inheritance lang:ruby %}
class A
end

class B < A
end

class << A
  def bar
    'bar'
  end
end

A.bar.should == 'bar'
B.bar.should == 'bar'
{% endcodeblock %}

If we call A's eigen-class AA, and B's eigen-class BB. Then we will found that `BB.superclass == AA`

{% codeblock BB and AA lang:ruby %}
class A; end

class B < A; end

AA = class << A; self; end

BB = class << B; self; end

B.superclass.should == A
BB.superclass.should == AA

{% endcodeblock %}
And we know `A` is actually an instance of `AA`, and `B` is an instance of `BB`, so obviously  on `B` we can call the instance methods defined on `AA`.
That's the reason why class method in Ruby can be inherited!

But there are so inconsistency in Ruby, that `AA` is the superclass of `BB`, but you won't be able to found `AA` in `BB`'s ancestors! In fact, `BB.ancestors` might yield something similar to `[Class, Module, Object, BasicObject, Kernel]` if not any module is injected to Class, Module, Object

{% codeblock Inconsistency lang:ruby %}
class A; end

class B < A; end

AA = class << A; self; end

BB = class << B; self; end

BB.superclass.should == AA
BB.ancestors.should_not includes AA

# BB.ancestors == [Class, Module, Object, BasicObject, Kernel]
{% endcodeblock %}

This design is wield to me, and kind of hard to understand, so for quite a long time, I don't even know class methods in ruby can be inherited!
I drew a graph to show the relationship about the classes, in graph I use `<class:A>` to indicate the class is the eigen class of `A`. And the line with a empty triangle to represents the inheritance, and arrow line to represents the instantiation.
And this graph is not a complete one, I omitted some unimportant classes, and I uses the dot line to indicate that something is missing on the line.

{% asset_img Inheritance-Hierarchy.png "Inheritance Hierarchy" %}
