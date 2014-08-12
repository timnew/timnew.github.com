---
layout: post
title: "How to print multiple line string on bash"
description: ""
date: 2012-05-14 10:32
comments: true
categories: 
category: "bash"
tags: ["bash", "shell","output","multiple-line"]
sharing: true
footer: false
---

To display some pre-formatted text onto screen, we need the following 2 capabilities:

### Construct Multiple Text

There are 2 ways to construct multiple line strings:

* String literal
{% codeblock String Literal lang:bash %}
text = "
First Line
Second Line
Third Line
"
{% endcodeblock %}

* Use cat
{% codeblock cat lang:bash %}
text = $( cat << EOF
First Line
Second Line
Third Line
EOF
)
{% endcodeblock %}

### Print Multiple Text to Screen
For some reason, `echo` command will eat all the line break in the text, so we should use printf instead of echo. 
And printf supports back-slash-escape, so we can use `\n` to print a new-line on screen.
