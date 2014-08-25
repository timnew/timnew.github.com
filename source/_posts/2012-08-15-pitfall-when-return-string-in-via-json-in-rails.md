layout: post
title: pitfall when return string in via json in rails
comments: true
categories:
  - Programming
  - Ruby
tags:
  - json
  - rails
  - pitfall
date: 2012-08-15 08:00:00
---
Today we met a weird problem when return a string via json.

Here is the coffee script code:

{% codeblock Front End lang:coffeescript %}

$.post serverUrl, data, (status) ->
	console.log status

{% endcodeblock %}

And here is our controller:

{% codeblock Backend Action lang:ruby %}

def action
	# do some complex logic

	render json: "success"
end

{% endcodeblock %}

Code looks perfect, but we found that the callback is never called! When we check the network traffic, you will found that server does send its response "success", but the callback is not called!

After spending half an hour to struggle against the jQuery, we finally find the problem!

The reason is that `success` is not a valid json data! A valid json string should be quoted with "", or JSON parser will treat it as token, like true or false or nil.

So to fix the problem, we need to change our action code:

{% codeblock Fixed Backend Action lang:ruby %}

def action
	# do some complex logic

	render json: '"success"'
end

{% endcodeblock %}

This is really a pitfall, since the wrong code looks so nature!
