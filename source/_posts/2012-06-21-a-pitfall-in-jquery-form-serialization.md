layout: post
title: A pitfall in jQuery form serialization
comments: true
categories: javascript
tags:
  - pitfall
  - javascript
  - jquery
  - form
  - serialization
  - id
  - name
date: 2012-06-21 08:00:00
---
Today, I was so surprised that I got an empty string when I call the serialize method on a jQuery wrapped form. 
The html is written in Haml:

{% codeblock Html lang:haml %}
%form#graph-option.horizontal-form
	%fieldset
		%label{ :for=>'start-date'} Start Date
		%select#start-date
		%label{ :for=>'end-date'} End Date
		%select#end-date
		%button#submit-option.btn.large-btn
{% endcodeblock %}

And the script is written in coffee-script:

{% codeblock Script lang:coffeescript %}

$ ->
	$('#submit-option').click ->
		option = $('#graph-option').serialize()
		$.post '/dashboard/graph', option, (data) ->
			renderCharts data

{% endcodeblock %}

When I execute the script, I got 500 error. And the reason is that the option is empty.
I believe this must be caused by a super silly mistake, so I try to call serialize methods on Twitter Bootstrap website, and I still got empty string!!!!

After half an hour debugging, I just realize that I forgot to assign the name to all the input elements. And according to html specification, the browser uses the name of the elements to identify whom the value belongs to. 
So when the name is omitted, the serailizeArray method in jQuery returns an empty array, as a result, the serialize method returns empty string.

According to my experience, it is easy to identify this problem, if the html is in html-like format, such as erb. But it is really hard to identify this issue if the page is written in haml, because in haml, id is used much more often.
To fix this problem, we need to specify the name explicitly for each form element.

Here is the fixed haml code:

{% codeblock Html lang:haml %}
%form#graph-option.horizontal-form
	%fieldset
		%label{ :for=>'start-date'} Start Date
		%select#start-date{ :name=>'start-date' }
		%label{ :for=>'end-date'} End Date
		%select#end-date{ :name=>'end-date' }
		%button#submit-option.btn.large-btn
{% endcodeblock %}


