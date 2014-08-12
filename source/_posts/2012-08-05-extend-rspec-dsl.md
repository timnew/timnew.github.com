layout: post
title: Extend RSpec DSL
comments: true
categories: rspec
tags:
  - rspec dsl extend test spec
date: 2012-08-05 08:00:00
---
I'm working on a project that need some complicated html snippets for test, which cannot be easily generated with factory. So I put these snippets into fixture files.

RSpec provides a very convenient DSL keyword `let`, which allow us to define something for test and cached it in the same test. And I want I could have some similar keyword for my html fixtures. To achieve this goal I decide to extend DSL.

So I created module which contains the new DSL I want to have:

{% codeblock DSL module lang:ruby %}

# spec/support/html_pages.rb
module HtmlPages
  def load_html(name)
    let name do
      file = Rails.root.join('spec/html_pages', "#{name}.html")
      Nokogiri::Html File.read(file)
    end
  end
end

{% endcodeblock %}

Put this file into the path `spec/support`, by default, `spec_helper.rb` would require this file for you.
Then we should tell rspec to load the DSL into test cases.

{% codeblock Load DSL lang:rb %}
RSpec.configure do |config|
	# ...
	config.extend HtmlPages	
	# ...
end
{% endcodeblock %}

By telling `config` to extend the module, our DSL will be loaded as the class methods of `RSpec::Core::ExampleGroup`, where `let` is being defined.

HINT: Rspec config has another way to extend DSL by calling `config.include`. Then the DSL methods will be injected into the test example group instance, then these methods can be used in the test cases. That's how runtime DSLs like FactoryGirl work.

 