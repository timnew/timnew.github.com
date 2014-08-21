layout: post
title: I decided to turn to Octopress
tags:
  - jekyll
  - octopress
  - highlight
categories:
  - Thinking
comments: true
date: 2012-04-08 08:00:00
---
I have spent almost a week to fight against the code highlight system in jekyll, but finally failed.

At very beginning, I tried the "legendary" "github flavored markdown", which supports use "```" to quote and highlight code. But soon, I failed.

Then I tried pygements, but sooner I found the perfectly local rendered code fails to be rendered on github pages, the reason seems caused because the github use a older version of the pygements.

Since I cannot fully control pygements as I expected, so I turned to a javascript version code highlighter, [SyntaxHighliter](http://alexgorbatchev.com/SyntaxHighlighter/).

Soon, I found SyntaxHighlighter cannot cooperate with jekyll's markdown compiler well, so I tried several approaches to make them work together. I change part of the SyntaxHighlighter's implementation and added several new includes liquid template based on Jekyll Bootstrap.
But it still cannot work perfect.

The problem is that jekyll markdown parser cannot distinguish the html snippet perfect, it usually try to parse the code as html.
Then I tried to quote my code with CData tag, but I found the generated html are not consistent. Some of which the "<" and ">" are escaped with "&amp;gt;" and "&amp;lt;". And some other are not escaped but quoted with "". It is really hard to deal with so many cases in javascript.

So I gave up. I gave up to use the github to render my pages. So I guess Octopress must be a good option for me.
Since [Octopress](http://octopress.org/) is based on jekyll but with a lot of new goodies. These new liquid markups are powerful and can fulfill my requirements.
