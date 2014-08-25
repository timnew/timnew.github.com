layout: post
title: Pretty Singleton in RoR app
comments: true
categories:
  - Programming
  - Ruby
tags:
  - rails
  - sigleton
  - pattern
date: 2012-08-05 08:00:00
---
Thanks to Ruby powerful meta programming capability and Rails `delegate` syntax, we can easily write graceful singleton class which makes the class works like a instance.

In traditional language such as C#, usually we write singleton code like this:

{% codeblock Singleton in C# lang:c# %}
class Foo
{
	// Singleton Declaration
	private static readonly Foo instance;
	pubilc static Foo Instance
	{
		get
		{
			if(instance == null)
			{
				instance = new Foo();
			}
			return instance;
		}
	}

	// Define instance behaviors
	// ...
}
{% endcodeblock %}

The previous approach works fine but the code that uses `Foo` will be kind of ugly. Every time when we want to invoke the method `Bar` on `Foo`, we need to write `Foo.Instance.Bar()` rather than more graceful way `Foo.Bar()`.
To solve this problem we need implement the class in this way:

{% codeblock Class Delegation in C# lang:c# %}

class Foo
{
	// Singleton Declaration
	// ...

	// Define instance behaviors
	public void Bar()
	{
		// Bar behaviors
		// ...
	}

	public static void Bar()
	{
		Instance.Bar();
	}

	public string Baz
	{
		get { /* Getter behavior */	}
		set { /* Setter behavior */	}
	}

	public static string Baz
	{
		get { return Instance.Baz;	}
		set { Instance.Baz = value;	}
	}
}

{% endcodeblock %}

This approach simplified the caller code but complicated the declaration. You can use some trick such as Code-Snippet or code generating technology such as Text Template or CodeSmith to generate the dull delegation code. But it is still not graceful at all.

If we write same code in ruby, things become much easier, great thanks to Ruby's powerful meta programming capability.

{% codeblock Singleton in Ruby lang:ruby %}
# foo.rb
class Foo
	extend ActiveSupport::Autoload

	autoload :Base
	include Base

	autoload :ClassMethods
	extend ClassMethods
end

# foo/base.rb
module Foo::Base
	# Define instance behaviors
	# ...
end

# foo/class_methods.rb
module Foo::ClassMethods
	# Singleton Declaration
	def instance
		@instance ||= new
	end

	delegate *Foo::Base.instance_methods, :to => :instance
end
{% endcodeblock %}

So in ruby solution we just use one statement `delegate *Foo::Base.instance_methods, :to => :instance` then delegate all methods defined in base to instance.

Besides this solution, there is also another kind of cheaper but working solution:
{% codeblock Singleton in Ruby lang:ruby %}
# foo.rb
class Foo

	autoload :Base
	include Base
	extend Base
end

# foo/base.rb
module Foo::Base
	# Define instance behaviors
	# ...
end

{% endcodeblock %}

Two different approaches make the code behaves slightly different, but anyway they both works.
