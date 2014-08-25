layout: post
title: Migrate Blog to Hexo
comments: true
date: 2014-08-12 22:59:14
categories:
  - Practice
  - Hexo
tags:
  - blog
  - hexo
  - octopress
  - migration
---

This post is a celebration for the migration from [Octopress](http://octopress.org/) to [Hexo](http://hexo.io/)

`Octopress` has done an excellent job on filling the gap between `jekyll` and full function repo based blog engine. But because of the tech stack it is based on. It isn't really a awesome framework to use.

The first time I got pissed off by `Octopress` was by the end of 2012. Then I come up the idea to rewrite it in `Node.js`. But I wasn't able to make it happen, because I was held by the new project assignment, and didn't have too many spare time on the blog engine.

To save effort, I began to customize `Octopress` by rewriting some code in `Octopress` and `Jekyll`, which started the long march of `Octopress` customization.

I did a number of customization on `Octopress`, from erb template to Jekyll generators, from `Rake` script to TextMate bundles.

Before I switch to Sublime, I uses TextMate for quite long time. So I customized the `Rake` script and TextMate bundle, which enables me to invoke almost every rake command in TextMate with hotkey. I can even rename the blog post file name according to the title in front-matter without leaving TextMate. Besides the functionality, I also customized the templates and the widgets a lot to get better visual effects and reading experience.

I've benefited from these customization a lot. On the other hand, these deep customization blocks me from migrating to `Hexo`, a better alternative. Even I have found `Hexo` in the early 2013, and believe it is a better blog platform. But it is really costy for me to migrate the blogs away from the Octopress.

Luckily, after years development, a bunch of tools and libraries came up, which has minimized the gap between `Octopress` and `Hexo`.
After several days effort, finally retired the `Octoress` engine, and completed the journey of moving from `Octopress` to `Hexo`.
