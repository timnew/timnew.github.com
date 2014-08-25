layout: post
title: Trick to use CoffeeScript in Hexo
comments: true
categories:
  - Programming
  - node.js
tags:
  - hexo
  - plug-in
  - script
  - coffee
  - hack
  - trick
date: 2014-08-18 18:19:44
---

[Hexo] has a `scripts` folder, and the files under which are loaded by `Hexo` when start. I usually uses this folder as the development folder for my plug-in scripts. And extract them into independent package after polished it into package-ready quality.

Usually, the files under scripts should be `javascripts`. But as I'm a fan of [Coffee Script], so I wish to use `coffee-script` to write the plug-ins. For the formal package, I compile the `coffee scripts` into `javascripts` before release. But for development, I wish to use `coffee script` directly.

In `node.js`, it is possible to require `coffee-script` directly, if you registered the `coffee-script` runtime compiler:

```javascript
require('coffee-script/register');
```
And as how node.js `require` function is implemented, you cannot register `coffee-script` runtime compiler in `.coffee` file. Or the compiler will complain:

```
[error] HexoError: Script load failed: plugin.coffee
SyntaxError: Unexpected string
  at Module._compile (module.js:439:25)
  at Object.Module._extensions..js (module.js:474:10)
  at Module.load (module.js:356:32)
  at Function.Module._load (module.js:312:12)
  at Module.require (module.js:364:17)
  at require (module.js:380:17)
  at /usr/local/lib/node_modules/hexo/lib/loaders/scripts.js:17:11
  at Array.forEach (native)
  at /usr/local/lib/node_modules/hexo/lib/loaders/scripts.js:15:13
  at /usr/local/lib/node_modules/hexo/lib/util/file2.js:339:7
  at done (/usr/local/lib/node_modules/hexo/node_modules/async/lib/async.js:135:19)
  at /usr/local/lib/node_modules/hexo/node_modules/async/lib/async.js:32:16
  at /usr/local/lib/node_modules/hexo/lib/util/file2.js:335:11
  at Object.oncomplete (evalmachine.<anonymous>:107:15)
```
Theoretically, it is possible to put the `coffee-script` registration code in a `javascript` file and also put it under `/scripts` folder. SO `Hexo` will load it when start-up.

Well, this approach doesn't really work. If you try it, it is very likely to get the exactly same error as before. The reason is related to `Hexo` implementation. `Hexo` uses [Scripts Loader] to require files under `/scripts`. The loader doesn't really provide an explicit way to specify which file is loaded before another. So the registration file is guaranteed to be loaded before any `.coffee`.

So far, it seems that there is no cure to this problem! But actually it does. There is undocumented feature will help to solve this issue.

Hexo uses [Script Loader] to load the scripts. In [Scripts Loader] use [hexo.util.file2] to populate the source files under `/scripts`. And [hexo.util.file2] use [fs.readdir] to actully populate the file system entries. For [fs.readdir], there is a undocumented feature, that the populated entries are actually sorted alphabetically, which means `a.js` is loaded before `b.coffee`.

With this feature, we can put our `coffee-script` registration in a file with lower alphabetic-order name. Personally, I'd like called `___register_coffeescript.js`, since `_` is smaller than any letter or number.

{% emoji warning %}**WARNING**: [fs.readdir] yielding sorted files is an undocumented behavior, which means it is not guaranteed either to work across platforms or not get changed in the future. So for, it works on Mac, and I expect it behaves similar on Linux. But not sure about Windows, since `fs` uses a different native binding on Windows.

[Coffee Script]: http://coffeescript.org/
[Hexo]: http://hexo.io/
[Scripts Loader]: https://github.com/hexojs/hexo/blob/master/lib/loaders/scripts.js
[hexo.util.file2]: https://github.com/hexojs/hexo/blob/master/lib/util/file2.js#L313
[fs.readdir]: http://nodejs.org/api/fs.html#fs_fs_readdir_path_callback
