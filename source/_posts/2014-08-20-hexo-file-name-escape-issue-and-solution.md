layout: post
title: Hexo file name escape issue and solution
comments: true
categories:
  - Practice
  - Hexo
tags:
  - hexo
  - blog
  - name
  - case
  - escape
  - symbol
  - http
date: 2014-08-20 02:49:13
---

I'm working on reorganize posts today, and found some filename issue with `Hexo`.

## Speical symbols are not escaped properly

Just found this issue today.

To ensure filename generate from title is legal as either file name or url path, `Hexo` uses [hexo.util.escape.filename] to escape the illegal symbols. `filename` does escape some symbols, but it doesn't cover all illegal symbols, such as `+`, `=`, `&`, etc. If these symbols are not escaped properly, which generates illegal url link. As a result, your post will never be acessible.

I found this issue is because, I have a post with `+3 trainer` in its title, since `+` is not escaped, and `+` will be treated as space by http. As a consequence, my post will never be able to open, unless I escape `+` as `%2B`. To avoid this kind of problem, I wish all the symbols in post name are escaped as `-`.

Besides this issue, `Hexo` has another issue with name escaping that the escaped file name might contains continues `-`. For example, your post title is "A great introduction - part 1", you will get escaped name `a-great-introduction---part-1.md`. I wish the continues `-` in the file name should be replaced with single `-`, name `a-great-introduction-part-1.md` is more readable than previous one.

To fix the 2 issues, I just created a [pull request], hope it will be merged soon.

I cared about this issue so much is because I uses [hexo-consle-rename] plug-in, which also uses `util.escape` to handle file name. To keep naming consistency when between different version of `Hexo`, I addd a kind of evil [monkey patch] in the `v0.1.2`. So make sure the plug in can work properly even with old `Hexo`.

## File name case issue

Besides the `Hexo` naming issue, I also met the case of the filename today. Although it depends on the blog hosting, but it might cause `404` if the file name case changed.

To avoid this kind of issue, I strongly recommend to set `filename_case: 1` in `_config.yml`, which will make sure all file name are in lower case.

There is common pitfall here for Windows or Mac with case-insensitive file system. If you have deploy the website once with wrong filename casing. Regenerate after updated `filename_case` won't help, because file system won't treat case change in filename as "change". So you cannot really commit the "change" to fix the `404` issue.

To fix this issue, there is easy and efficient trick. Go to `.deploy` folder, execute following commands:

```shell
$ git rm -rf *
$ git ci -m "Clean all file"
$ hexo clean
$ hexo d -g
```
To force clean the repo once enforce git to treat 2 files with same name but different casing as different ones. So the name casing issue can be fixed.

[hexo.util.escape.filename]: https://github.com/hexojs/hexo/blob/master/lib/util/escape.js#L22
[pull request]: https://github.com/hexojs/hexo/pull/804
[hexo-consle-rename]: https://github.com/timnew/hexo-console-rename
[monkey patch]: https://github.com/timnew/hexo-console-rename/blob/master/lib_src/monkey_patch.js
