layout: post
title: Dynamic Singleton Methods in Ruby
comments: true
categories: ruby
tags:
  - ruby
  - mixin
  - meta programming
  - singleton methods
  - mixin
  - module
date: 2012-05-08 08:00:00
---
Today, I pair with Ma Wei to refactor a piece of pre-existed code. We try to eliminate some "static methods" (in fact, there is no real static method in ruby, I use this term to describe the methods that only depends on its parameters other than any instance variables). 

The code is like this:

{% codeblock Recruiter.rb lang:ruby %}

class Recruiter
  
  def approve! candidates
    Candidate.transaction do
      candidates.each do |candidate|
        candidate.status.approve!
      end
    end
  end

  def reject! candidates
    Candidate.transaction do
      candidates.each do |candidate|
        candidate.status.reject!
      end
    end
  end

  def revoke! candidates
    Candidate.transaction do
      candidates.each do |candidate|
        candidate.status.revoke!
      end
    end
  end
  
  # ...
  # Some other methods similar
  
end

{% endcodeblock %}

As you can see the class Recruiter is used as a host for the methods that manipulate the array of candidates, which is a strong bad smell . So we decide to move these methods to their context class.

In Java or C#, the solution to this smell is quite obvious, which could be announced as "Standard Answers": 
0. Mark all methods static.
1. Create a new class named CandiateCollection.
2. Change the type of candidates to CandidateCollection.
3. Mark all methods non-static, and move it to CandidateCollection class. 
If you use Resharper or IntelliJ enterprise version, then the tool can even do this for you.

But in ruby world, or even in dynamic language world, we don't like to create so many classes, especially these "strong-typed collection". I wish I could inject these domain related methods to the array instance when necessary, which is known as "singleton methods" in ruby. 
To achieve this, I might need the code like this:

{% codeblock Singleton Methods lang:ruby %}

def wrap_array array
	def array.approve!
		# ...
	end 
	
	def array.reject!
		# ...
	end
	
 	# ...
  	# Some other methods similar
	
	array
end

{% endcodeblock %}

With the help of this `wrap_array` method, we can dynamic inject the method into the array like this:

{% codeblock call wrap_array lang:ruby %}
wrap_array(Candidate.scoped_by_id(candidate_ids)).approve!
{% endcodeblock %}

This is cool, but still not cool enough. We still have problems:
1. All the business logic is included in the wrap method. It is hard to maintain.
2. Where should we declare this wrap method? In class Array or another "static class"?

The answer to the 1st question is easy, our solution is encapsulate these logics into a module:

{% codeblock Module CandidateCollection lang:ruby %}

module CandidateCollection
  
  def approve! 
   # ...
  end

  def reject! 
   # ...
  end

  def revoke! 
   # ...
  end
	
  # ...
  # Some other methods similar

  end
end

{% endcodeblock %}

By encapsulate the logic into a module, then we can extract it into a single file, so the logic could be organized in the way as we want.
Now we need to solve the second problem and reuse the module we just created.

To achieve this, we wrote the following code:

{% codeblock Array.to_candidate_collection lang:ruby %}
class Array
  def to_candidate_collection
	class << self
	  include CandidateCollection
	end
	self
  end
end 
{% endcodeblock %}

In the code, we re-opened the class Array, and define a new method called `to_candidate_collection`, which is used to inject domain methods into a generic array.
So we can have the following code:

{% codeblock Call to_candidate_collection lang:ruby %}
Candidate.scoped_by_id(candidate_ids).to_candidate_collection.approve!
{% endcodeblock %}

Now our refactoring is basically completed.

But soon, we realize that is pattern is really powerful and should be able to be reused easily. So we decide to move on.
We want `to_candiate_collection` be more generic, so we can dynamically inject any module, not just CandidateCollection.
So we wrote the following code:

{% codeblock dynamic_inject lang:ruby %}
class Array
  def dynamic_inject module
	class << self
	  include module
	end
	self
  end
end
{% endcodeblock %}

<del>So we can have the code like this:</del>

{% codeblock call dynamic_inject lang:ruby %}
Candidate.scoped_by_id(candidate_ids).dynamic_inject(CandidateCollection).approve!
{% endcodeblock %}

<del>The code looks cool, but failed to run. 
The reason is that we opened the meta class of the instance, which means we enter another level of context, so the parameter module is no longer visible. 
To solve this problem, we need to flatten the context by using closure. So we modified the code as following:</del>

{% codeblock dynamic_inject version 2 lang:ruby %}
class Array
  def dynamic_inject module
	metaclass = class << self; self; end
	metaclass.class_eval do
	  include module
	end
	self
  end
end
{% endcodeblock %}

<del>The code `metaclass = class << self; self; end` is very tricky, we use this statement to get the meta class of the array instance.
Then we call class_eval on meta class, which then mixed-in the module we want.</del>

<del>Now the code is looked nice. We can dynamically inject any module into "Array" instance.
Wait a minute, why only "Array"? We'd like to have this capability on any object! 
Ok, that's easy, let's move the method to Kernel module, which is mixed-in by Object class.</del>

{% codeblock dynamic_inject version 3 lang:ruby %}
module Kernel
  def dynamic_inject module
	metaclass = class << self; self; end
	metaclass.class_eval do
	  include module
	end
	self
  end
end
{% endcodeblock %}

<del>Now we can say the code looks beautiful.</del>

**NOTICE:**
<del>Have you noticed that we have a `self` expression at the end of the `dynamic_inject` method as return value.
This statement is quite important! 
Since we will get "undefined method error" when calling `Candidate.scoped_by_id(candidate_ids).dynamic_inject(CandidateCollection).approve!` if we missed this statement.
We spent almost 1 hour to figure out this stupid mistake. It is really a stupid but expensive mistake!</del>

<ins>
Instead of these tricky ways, for Ruby 1.9+, it is okay to use `extend` method to replace the tricky code.
The `extend` method is the official way to do "dyanamic inject" as described before.
</ins>