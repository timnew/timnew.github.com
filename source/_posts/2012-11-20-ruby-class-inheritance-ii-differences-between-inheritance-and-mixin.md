---
layout: post
title: "Ruby Class Inheritance II: Differences between inheritance and mixin"
description: ""
date: 2012-11-20 14:18
comments: true
categories: Ruby
category: 
tags: ["Ruby", "Class", "Inheritance", "Module"]
sharing: true
footer: false
---

Guys familiar with Rails are very likely used to the following code, and will not be surprised by it:

{% codeblock ActiveRecord lang:ruby %}

class User < ActiveRecord::Base
end

first_user = User.find(0)

{% endcodeblock %}

But actually the code is not as simple as it looks like, especially for the ones from Java or C# world.  
In this piece of code, we can figure out that the class `User` inherited the method `find` from its parent class `ActiveRecord::Base`(If you are doubt or interested in how it works, you can check this post [Ruby Class Inheritance](/blog/2012/08/23/ruby-class-inheritance/)).

If you write the following code, it should works fine:

{% codeblock Simple Class lang:ruby %}
class Base 
  def self.foo
    bar_result = new.bar
    "foo #{bar_result}"
  end
  
  def bar
    'bar'
  end
end

class Derived < Base
end

Base.new.bar.should == 'bar'
Derived.new.bar.should == 'bar'

Base.foo.should == "foo bar"
Derived.foo.should == "foo bar"

{% endcodeblock %}

In Ruby's world, most of the time you can replace a inheritance with a module mixin. So we try to refactor the code as following:

{% codeblock Exract to Module lang:ruby %}
module Base
  def self.foo
    bar_result = new.bar
    "foo #{bar_result}"
  end
  
  def bar
    'bar'
  end
end

class Derived  
  include Base
end
{% endcodeblock %}

If we run the tests again, the 2nd test will fail:

{% codeblock Test lang:ruby %}

Dervied.new.bar.should == 'bar' # Passed
Dervied.foo.should == 'foo bar' # Failed

{% endcodeblock %}

The reason of the test failure is that the method 'foo' is not defined!
So it is interesting, if we inherits the class, the class method of base class will be available on the subclass; but if we include a module, the class methods on the module will be available on the host class!

As we discussed before([Ruby Class Inheritance](/blog/2012/08/23/ruby-class-inheritance)), the module mixed-in is equivalent to include insert a anonymous class with module's instance methods into the ancestor chain of child class.


So is there any way to make all tests passed with module approach? The answer is yes absolutely but we need some tricky thing to make it happen:

{% codeblock Exract to Module ver 2 lang:ruby %}
module Base
  module ClassMethods
    def foo
      bar_result = new.bar
      "foo #{bar_result}"
    end
  end
  
  def bar
    'bar'
  end
  
  private 
  
  def self.included(mod)
    mode.extend ClassMethods
  end
end

class Derived  
  include Base
end

Dervied.new.bar.should == 'bar' # Passed
Dervied.foo.should == 'foo bar' # Passed
{% endcodeblock %}

