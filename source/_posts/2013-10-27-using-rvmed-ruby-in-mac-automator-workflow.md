---
layout: post
title: 'Using RVMed Ruby in Mac Automator Workflow'
description: ''
date: 2013-10-27 02:22
comments: true
categories:
category: osx
tags:
- ruby
- RVM
- automator
- Mac
- OSX
- service
- shell
- finder
sharing: true
footer: false
published: true
---

**HINT** This content is obsleted on OSX 10.9 Mavericks

## Embed Ruby into Automator Workflow

Automator workflow has the ability to execute ruby code, but it is not that obvious if you doesn't know it.

To embed ruby code into workflow, you need to create a "Run Shell Script" action first, then choose "/usr/bin/ruby" as the shell. Then the script in the text box will be parsed and executed as ruby code.

![Ruby In Automator](/blog/2013/10/27/using-rvmed-ruby-in-mac-automator-workflow/ruby_in_automator.png)

So, from now on, you know how to embed ruby into automator workflow.

## Use RVM ruby instead of System Ruby

By default, Automator will load system ruby at `/usr/bin/ruby`, which is ruby v1.8.7 without bundler support. For most ruby developers, they must have installed some kind of ruby version manager, such as `RVM` or `rbenv`. As to me, I uses `RVM`. So I wish I could use RVMed versions of Ruby rather than the system ruby, could be ruby 1.9.3 or even ruby 2.0 with bundler support.

To use the RVMed ruby, I tried several approaches by hacking different configurations or files. And at last, I made it doing this:

RVM provides a ruby executable file at `~/.rvm/bin/ruby`. On the other hand, `/usr/bin/ruby` is actually a symbol link that pointed to '/System/Library/Frameworks/Ruby.framework/Versions/Current/usr/bin/ruby'. 

So what we need to do is to replace the the symbol link with a new one pointed to `~/.rvm/bin/ruby`.

{% codeblock Replace system ruby with RVMed ruby lang:bash %}

sudo mv /usr/bin/ruby /usr/bin/system_ruby
sudo ln -s /Users/timnew/.rvm/bin/ruby /usr/bin/ruby

{% endcodeblock %}

(You might need to replace the `/Users/timnew/.rvm/bin/ruby` with the path to your ruby executable file)

After doing this, done, you have the RVMed ruby in your Automator Workflow.

You can try to excute the following code in Workflow to verify it:

{% codeblock Test Ruby Version lang:ruby %}
puts RUBY_VERSION
{% endcodeblock %}

If you do it correct, then you should see '1.9.3' or any other version of ruby you have configured.