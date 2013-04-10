---
layout: post
title: "Pitfall in matching line head and line end in regexp"
description: ""
date: 2013-04-10 11:15
comments: true
categories: 
category: regexp
tags:
  - pitfall
  - regular expression
  - regex
  - regexp
  - line head
  - line end
sharing: true
footer: false
---

I usually uses `\^\` and `\$\` to verify user input, e.g:  
I uses following regexp to verify whether a user input is valid gmail email address:

{% codeblock Matching Gmail %}
^[a-zA-Z_\.]+@gmail.com$
{% endcodeblock %}


But in fact it is potentially vulnerable!  
According to the RegExp document, `^` and `$` is matching to **line head** and **line end**!  
So I might rush into pitfall when user try to fool me with following input:
{% codeblock bad input %}
"hacker@gmail.com\n&lt;script&gt;alert('bang!')&lt;/script&gt;"
{% endcodeblock %}


Since there is a `\n` in the string, so `$` won't really match to the end of the string but actually matched to the `\n`, then the whole string become a valid input, but actually it isn't!

To avoid such issue, we should stick to `\A` and `\z`, which is literally means the **the beginning of the string** and **end of the string**!


