layout: post
title: TextMate command to create new post for jekyll
tags:
  - textmate
  - jekyll
  - tmbundle
  - bash
  - shell
  - script
categories: textmate
comments: true
date: 2012-04-08 08:00:00
---
Here is a bash script that acts as a TextMate command, which enables blogger to create new post without leaving TextMate.
It depends on "Post" task of the Rakefile in Jekyll Bootstrap.

{% codeblock New Post Command for Jekyll Bootstrap lang:bash %}
cd $TM_PROJECT_DIRECTORY

title=$(CocoaDialog standard-inputbox \
 --title "New Post" \
 --informative-text "Title of the new post:")

[[ $(head -n1 <<<"$title") == "2" ]] && exit_discard

title=$(tail -n1 <<<"$title")

output=$(rake post title="$title")

expr="^\(in (.*)\) Creating new post: (.*)$"

if [[ $output =~ $expr ]]; then
   	project=${BASH_REMATCH[1]}
	post=${BASH_REMATCH[2]}
	echo "new post file created at $post"
	exit_show_tool_tip
else
   	echo "Error"
	exit_show_tool_tip
fi
{% endcodeblock %}
