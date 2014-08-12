layout: post
title: Handle dynamic argument in dynamic language
comments: true
categories:
  - general
tags: []
date: 2012-06-28 08:00:00
---
In dynamic language, most language doesn't provide the function overload mechanism like static language does, which means you cannot define functions with same name but different arguments, and the language itself won't help you to dispatch the call according to the arguments.
So you have to deal with the overload by yourself in dynamic languages.

In dynamic language, since you have to dispatch the call by yourself, so you can play some tricks during process the arguments. The most common trick is grammar sugar, which can help you simplify the code and increase the readability. And it is a very important feature when you're building DSL.

Grammar sugar in argument means you can omit something unnecessary or unimportant parameters in specific context, then the function will try to infer and complete the parameters. For example, developer should be able to omit the password parameter if the system enable authentication mechanism. These kind of tricks are very common in dynamic language frameworks, such as jQuery.

Here is a list of some common grammar sugar cases:

* Set default value for omit parameter, such as for jQuery animation function `jQuery.fadeIn( [duration] [, callback] )`, you can omit the parameter _duration_, which is equivalent to provide _duration_ as 400
* Provide different type of value for a same parameter, still the jQuery animation function `jQuery.fadeIn( [duration] [, callback] )`, you can provide number for _duration_, or you can provide string "fast" and "slow" as the value of _duration_.
* Provide a single value rather than a complex hash, such as function jQuery ajax function `jQuery.ajax( settings )`, you can provide a url string, which is equivalent to provide a hash`{ url: <url string>}`
* Pass a single element instead of a array of the element.

After we analyze the cases, we will find that all the grammar sugar is to allow user to provide exactly same information but in different formats. Since all the data are same piece of information, so it should be possible to unify all the information into one format! Which means to support grammar sugar, the major problem is to unify the type of parameter.   
Besides unify the type, another important problem is to handle the null values, such as`null` and `undefined` in javascript, `nil` in ruby, etc.

Here is a piece of ruby code that I parse the argument by unifying the parameter type:

{% codeblock code lang:ruby %}

  def apply_to_items(options = nil)
    options = unify_type(options, Hash) { |items| {:only => items} }
    options[:only] = unify_type(options[:only], Array) { |item| item.nil? ? list_all_items : [item]  }
    options[:except] = unify_type(options[:except], Array) { |item| item.nil? ? [] : [item] }

    options[:only] = unify_array_item_type(options[:only], String) { |symbol| symbol.to_s }
    options[:except] = unify_array_item_type(options[:except], String) { |symbol| symbol.to_s }

    target_items = options[:only].select { |item| options[:except].exclude? item }

    target_items.each do |item|
      yield item
    end
  end

  private

  def list_all_items
	# return all items fetched from database or API
	# ...
  end

  def unify_type(input, type)
    if input.is_a?(type)
      input
    else
      yield input
    end
  end
end

{% endcodeblock %}

And here is the test for the code:

{% codeblock title lang:ruby %}
require 'spec_helper'

describe Module  do
  before do
    extend Moudle
  end

  it "should populate all items" do
    visited = []
    apply_to_items do |item|
      visited << item
    end

    visited.should =~ %w(public another_item)
  end

  describe "should populate the provided items" do
    it "provide as string array" do
      visited = []
      apply_to_items(%w(another_item)) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "provide as symbol array" do
      visited = []
      apply_to_items([:another_item]) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "provide as string item" do
      visited = []
      apply_to_items('another_item') do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "provide as symbol item" do
      visited = []
      apply_to_items(:another_item) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "provide as string array in hash" do
      visited = []
      apply_to_items(:only => %w(another_item)) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "provide as symbol array in hash" do
      visited = []
      apply_to_items(:only => [:another_item]) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "provide as string item in hash" do
      visited = []
      apply_to_items(:only => 'public') do |item|
        visited << item
      end

      visited.should =~ %w(public)
    end

    it "provide as symbol item in hash" do
      visited = []
      apply_to_items(:only => :public) do |item|
        visited << item
      end

      visited.should =~ %w(public)
    end
  end

  describe "should except the not used items" do

    it "except as string item in hash" do
      visited = []
      apply_to_items(:except => 'public') do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "except as symbol item in hash" do
      visited = []
      apply_to_items(:except => :public) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "except as string array in hash" do
      visited = []
      apply_to_items(:except => %w(public)) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end

    it "except as symbol array in hash" do
      visited = []
      apply_to_items(:except => :public) do |item|
        visited << item
      end

      visited.should =~ %w(another_item)
    end
  end
end

{% endcodeblock %}

The algorithm in previous code is language independent, so ideally, it could be reused in any language, such as java script or python.
  