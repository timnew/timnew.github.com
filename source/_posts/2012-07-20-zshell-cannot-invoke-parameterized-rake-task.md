---
layout: post
title: "ZShell cannot invoke parameterized Rake Task"
description: ""
date: 2012-07-20 23:52
comments: true
categories: zsh 
category: 
tags: ['zsh', 'rake', 'task', 'compatibility', 'parameter']
sharing: true
footer: false
---
Just met a super wield question in zsh when I trying to invoke a parameterized rake task.
I have a rake task that helps me to create class and related test case for coffee script. It should be invoked in this way:

{% codeblock Invoke Rake Task lang:bash %}
rake new:class[class_name]
{% endcodeblock %}

I need to pass the parameter in a pair of square brackets, the syntax work pretty fine in bash shell. But when I do it in zsh, it yield error:  
`zsh: no matches found: new:class[BottleContainer]`

So I have to create a new bash instance in zsh to invoke the shell. It is super wield and stupid.
