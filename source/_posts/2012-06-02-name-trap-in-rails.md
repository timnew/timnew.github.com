layout: post
title: Name trap in Rails
comments: true
categories: Rails
tags:
  - ruby
  - rails
  - active model
  - name
  - convention
  - error
  - trap
  - pitfall
date: 2012-06-02 08:00:00
---
I'm a newbie to Rails, and my past few projects are all rails based, including MetaPaas, Recruiting On Rails and current SFP.
I was amazed by the convenience of Rails, and also hurt by its "smartness".
The power of Rails was described in quite a lot of posts, so I wanna to share some failure experiences.
Actually I have felt into quite a number of pitfalls in Rails, and here is one of the most painful ones.

To explain the problem easier, I just simplify the scenario:  
I have a model called "Candidate", which holds a "Status" to store the status of the candidate, so I have the code like this:

{% codeblock Candidate and Status lang:ruby %}
class Candidate < ActiveRecord::Base
	has_one status
	
	# other definition
end

class Status < ActiveRecord::Base 
	belongs_to candidate

	# other definition
end
{% endcodeblock %}

For some reason, I change the relationship between Candidate and Status. It is changed from one-to-one to one-to-many.
So I changed the `has_one` to `has_many`:

{% codeblock Candidate and Status lang:ruby %}
class Candidate < ActiveRecord::Base
	has_many status
	
	# other definition
end

class Status < ActiveRecord::Base 
	belongs_to candidate

	# other definition
end
{% endcodeblock %}

I thought it is an easy modification, but the app fails to run, even I have done the database migration.
It said rails cannot find a constant named "Statu"! 

After my first sight on this error message, I believed it is caused by a typo, I must mistyped "Status" as "Statu". 
So I full-text search the whole project for "Statu", but I cannot find any.

This error message is quite weird to me, since I have no idea about where the word "Statu" come from!
After spent half an hour on pointless trying, I suddenly noticed that the word "status" is end with "s", and according to Rails' convention, rails must think "status" is the plural form of "statu". So according to the convention again, it try to find a class named "Statu".
And we should use the plural form noun as name for one-to-many field, since that holds an array rather than a single object.

So after changing `status` to `statuses`, the problem solved. 

Convention based system is powerful, a lot magic just happened there. But also the magic things are hard to debug when some special case breaks the convention presumption.
