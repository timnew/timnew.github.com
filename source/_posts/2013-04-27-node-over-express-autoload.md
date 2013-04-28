---
layout: post
title: "Node over Express - Autoload"
description: ""
date: 2013-04-27 10:56
comments: true
categories: 
category: Node.js
tags: 
  - node
  - express
  - node over express
  - configurationsharing: true
footer: false
---

## Preface

This is the 2nd post of my `Node over Express` series blog. I'd like to discuss a famous paint point of Node.js.

## Pain Point

There is well known joke about LISP that you might heard of: 

{% blockquote %}
A top hacker successfully stole the last 100 lines of a top secret program from the Pentagon. The program is written in LISP, so the code he found is just thousands of all kinds of end brackets.
{% endblockquote %}

Actually, in Node.js there is a similar issue: 

{% blockquote %}
Open a complex node.js program file, the top tens of lines could be all kinds 'require'.
{% endblockquote %}

Due to the sandbox design of Node.js, the developer need to require every external resources used in current file, which could be very boring and hurt the readability of the code. Once if the developer want to replace one library with another used in the code, such as to replace `underscore` with `lodash`, then developer need to replace every require statement across files. It is big hurt to maintainability.

If we take the packages or files we required as kind of dependency, then our issue could be solved with `dependency injection` and `IoC`. Actually, rails does well in this domain.

## Rails Approaches

"Require hell" doesn't only occur in node.js apps, but also in Ruby apps. But rails have solved this issue gracefully, you barely need to require anything manually in Rails app.

### External Resources

My saying `external resources` here means the resources encapsulated into and provided with ruby gems. In rails or other ruby apps, developer describe the dependencies in `Gemfile`, and load the dependencies with the `Bundler`. For the frameworks already integrated with `Bundler`, such as Rails 3.x+, developer doesn't need to do anything manually. For other cases, developer can use `bundle execute` to load the ruby code into a environment with all gems required.

### Internal Resources

The term `Internal Resources` here means the code in your app, such as the models, the services or the controllers. `Railtie` takes the responsibility to require the internal resources for the app automatically when the app first time need them. So the whole process is "Lazy", Rails will only require the class when you need it (In fact Rails behaves different in different environment. In production, Rails require pre-require all classes when app starts, but the loading progress is still similar).

## Autoload in Node.js

Rails avoid the "require-hell" with two "autoload" mechanisms. Although there are still debates about whether autoload is good. But at least, developer not required to keep a close eye on dependency is helpful to increase the developer productivity. And the most important, developers loves this feature in most cases.

So to avoid require-hell in Node.js, my solution is to provide autoload mechanism for Node.js app. 

Since there are some significant differences between Node.js and Ruby, before I go deep into my solution, I would like to explain Node.js module system fist.

### Node.js Module System

Node.js have similar mechanisms as Ruby. `npm` in Node.js is equivalent to `Gem` and `Bundler` in `Ruby`. And we have `package.json`, which takes the place of `Gemfile` and `Gemfile.lock` in Ruby. And Node.js have module and package, which is similar to `Gem` in Ruby.

Although there are similarity between Node.js and Ruby. But it is still not easy to achieve autoload in Node.js. The major reason isNode.js's sandbox model, which works quite different to Ruby Type system.

Because Javascript doesn't have a real type system, all the types in Node.js are actually the functions stored in local variables. And Node.js load each file into different sandboxes, all the local variables are isolated between files to resolve "global leak", a deep-seated ill of JavaScript.

Because of the isolation, Node.js developer need to require every all used types in every file. In ruby, developer just need to require the types not required yet. So in Node.js the problem is more severe and more annoying. And the problem is also more difficult to resolve because it is caused by design. 

In the days before Node.js, in the browser, global leak in bad written JavaScript program drives thousands of JS developers up to the wall. People aware the horror of global leak so deep, so born such a strict limitation in Node.js. We understand it, but tens of require statements in each files are not acceptable, but are common in production-level node.js web apps. 

### Global Variable

The root cause of the problem is caused because Node.js enforced a strict isolations on modules. And with the help of JSLint or coffe-script language, and awareness of the problem, global leak isn't as scary as imagined. So  in my point of view, the isolation seems to be somehow over strict.

The issue is caused because of isolation, so we should be able to solve it by sharing the variables between files in a managed way. Luckily, Node.js have considered this when it is designed.

There is a special variable called `global`, which is accessible in every file and the values is shared between files. And the most important, node.js treats global as default context of functions, you can refer the child of global without explicitly identify it. So `SomeType === global.SomeType`.

### JS Property

Autoload mechanism in Rails loads the class lazily. It only load the class when it doesn't exists. Rails achieve it by tracking the exception of "Uninitialized Constant". But it is hard to do this in Node.js, so I chose a different approach, I uses JSProperty.

Property(called attribute in Ruby) is a popular feature among OO languages, which enables functions invoked as same accessing field on object. But due to JavaScript ins't a real OO language, property is a "new" feature declared in [ECMAScript 5 standard](http://www.ecma-international.org/publications/standards/Ecma-262.htm). ([Doc for Object.defineProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty))

With the help of property, we're enabled to hook the callback on the type is accessed, and we can require the type in callback. So the module won't be required when it is not used. And node.js `require` is smart enough to cache the module its required before. So as a result, we make the autoload lazy!

### My Implementation

To make autoload work, we need to require a bootstrap script when the app starts. 

{% codeblock Bootstrap Script: initEnvironment.coffee lang:coffeescript %}
global.createLazyLoader = require('./services/LazyLoader')
global.createPathHelper = require('./services/PathHelper')

global.rootPath = createPathHelper(__dirname).consolidate()

global.Configuration = require(rootPath.config('configuration'))

global.Services = createLazyLoader rootPath.services()
global.Routes = createLazyLoader rootPath.routes()
global.Records = createLazyLoader rootPath.records()
global.Models = createLazyLoader rootPath.models()
global.Admin = createLazyLoader rootPath.adminTools()
global.assets = {} # initialize this context for connect-assets helpers
{% endcodeblock %}

The script setup the autoload stubs for all services, routes, records, models for my app. Then the following code is feasible:

{% codeblock Sample Usage lang:coffeescript %}
Records.User.findById uid, (err, user) ->
  badge = new Models.Badget(badgeInfo)
  user.addBadge badge
  user.save()
{% endcodeblock %}

Besides of the `initEnvironment.coffee` script, there are 2 very important classes: `PathHelper` and "LazyLoader"

{% codeblock PathHelper lang:coffeescript %}
_ = require('underscore')
fs = require('fs')
path = require('path')

makePath = (rootPath) ->
  rootPath = path.normalize rootPath
  result = (args...) ->
    return rootPath if args.length == 0
    parts = _.flatten [rootPath, args]
    path.join.apply(this, parts)

  result.consolidate = ->
    self = result()
    files = fs.readdirSync(self)
    _.forEach files, (file) ->
      fullName = path.join(self, file)
      stats = fs.statSync(fullName)
      if stats.isDirectory()
        extName = path.extname(file)
        name = path.basename(file, extName)
        result[name] = makePath(fullName)
    result

  result

exports = module.exports = makePath
{% endcodeblock %}

{% codeblock LazyLoader lang:coffeescript %}
_ = require('underscore')
path = require('path')
fs = require('fs')

class LazyLoader
  constructor: (@__rootPath) ->
    files = fs.readdirSync(@__rootPath)

    @__names = []
    _.forEach files, (file) =>
      extName = path.extname file
      if require.extensions[extName]?
        name = path.basename file, extName
        fullname = path.join(@__rootPath, file)
        @__names.push name
        Object.defineProperty this, name,
          get: ->
            require(fullname)

createLazyLoader = (rootPath) ->
  new LazyLoader(rootPath)

createLazyLoader.LazyLoader = LazyLoader

exports = module.exports = createLazyLoader
{% endcodeblock %}



