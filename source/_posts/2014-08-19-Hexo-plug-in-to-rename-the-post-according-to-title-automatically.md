layout: post
title: Hexo plug-in to rename the post according to title automatically
comments: true
categories:
  - Package
  - Hexo
tags:
  - hexo
  - plugin
  - rename
  - post
  - title
ribbon: Package
date: 2014-08-19 01:17:28
updated: 2014-09-19 11:00:22
---

When writing blog with [Hexo], I uses `hexo new` command to create new post file. If the title of the post is provided, then the file is named according to the tile. This is super convinient, and I'm really loving it.

But there is problem! If I changed my mind when during the writing, so I changed the title of the post. As a consequence, the post file name doesn't match to the post title any longer.

In the past, I have to rename the post file manually. If there is asset folder, I also have to remember rename it accordingly. And I have to becareful to avoid introduce typo, or it either break the reference or cause other problems.

Besides, if you have special name pattern for your post, such as have time-stamp in your post name. The problem is more complicated. You have to reserve the time-stamp carefully, and replace all the space or any other improper characters with `-`.

At least for me, it is a complicated, error-proning and unpleasant work to do.

I'm a lazy guy, I don't want to repeat this pain time and time again. To save myself from such pain, I create the plug-in [hexo-console-rename].

The plug-in reads the `front-matter` of the post, then figure out the proper name. It is smart enough to know what is the proper name for the post, when you changed your configuration, it changes its behavior also.

To use the plug-in is super easy. I usually use it in this way:

```shell
 $ hexo r source/**/*.md
```
Then it scans all the posts for me, and fix the filename when necessary. Easy and efficient.

## Advanced Usages

Actually after I created the plugin, I figured out sevearl advance usages of this plug-in. Sometimes, it could become your life savor!

### `new_post_name` updated

If you change the `new_post_name` in your `_config.yml`. You new post will follow a different name pattern than old ones. At this time, you might really want to rename all the old posts to keep consistency! But do it manually is a painful job to do!

Then [hexo-console-rename] is your live-savor! You just run

```shell
 $ hexo r -p ':title.md' source/**/*.md
```
Then all the old files will be renamed under your new naming rule! Aesome!

### `date` in your post changed

It isn't a common case, but if you have changed the `date` field in the `front-matter` of your post. And you have time-stamp in your file name. You can also use [hexo-console-rename] to rename the file for you.

For more detail, check out the [hexo-console-rename] home page.

[hexo-console-rename]: https://github.com/timnew/hexo-console-rename
