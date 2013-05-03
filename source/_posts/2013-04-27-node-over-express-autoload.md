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
  - autoload
sharing: true
footer: false
published: false
---

## Preface

This is the 2nd post of the [Node over Express](/blog/tags/#node over express-ref) series (Previous one is [Configuration](/blog/2013/04/25/node-over-express-configuration/)). In this post, I'd like to discuss a famous pain point in Node.js.

## Pain Point

There is well known joke about Lisp: 

{% blockquote %}
A top hacker successfully stole the last 100 lines of a top secret program from the Pentagon. Because the program is written in Lisp, so the code stolen is just close brackets.
{% endblockquote %}

It is joking about there are too many brackets in Lisp. In Node.js there is similar issue that there are too many `require`. Open any node.js file, usually one could find several lines of `require`.

Due to the node's sandbox model, developer has to require resources time and time again in every files. It is boring to write or read lines of meaningless `require`. And the worst, it could be a nightmare once developer wish to replace some library with another. 

## Rails Approaches

"Require hell" isn't only for node.js, but also for Ruby apps. Rails has solved it gracefully, and the developer barely need to require anything manually in Rails.

There are 2 kinds of dependencies in rails app, one the is external resource, another is internal resource.

### External Resources

External resources are classes encapsulated in ruby gems. In ruby application, developer describe the dependencies in `Gemfile`, and load them with `Bundler`. Some frameworks have already integrated with `Bundler`, such as Rails. When using them, developer doesn't need to do anything manually, all the dependencies are required automatically. For others, use `bundle execute` to create the ruby runtime with all gems required.

### Internal Resources

Internal Resources are the classes declared in the app, they could be models, the services or the controllers. Rails uses `Railtie` to to require them automatically. The resource is loaded when first time used, the requiring process is "Lazy". (In fact, this description isn't that precise, because Rails behaves differently in production environment. It loads all the classes during the launching for performance reason).

## Autoload in Node.js

Rails avoid the "require-hell" with two "autoload" mechanisms. Although there are still debates about whether autoload is good or not. But at least, autoload frees the developer from the boring dependency management and increases the productivity of developers. Developers love autoload in most cases.

So to avoid "require-hell" in Node.js, I prefers autoload mechanism. But because there are significant differences in type system between Node.js and Ruby, we cannot copy the mechanism from ruby to node as is. So before dive into the solution, we need to understand the differences first.

### Node.js Module System

There are a number of similarities between Node.js and ruby, things in node.js usually have the equivalences in ruby. For example, `package` in node is similar to the `gem` in Ruby, `npm` equals to `Gem` and `Bundler`, `package.json` takes the responsibility of `Gemfile` and `Gemfile.lock`. The similarity enables porting autoload from ruby to node. 

Although there are similarities between Node.js and Ruby in some aspects, but there are also significant differences between them in some other aspects. One of the major differences is the type system and module sandbox in Node.js, which works in a quite different way to Ruby type system.

JavaScript isn't a real OO language, so it doesn't have real type system. All the types in JavaScript are actually functions, which are stored in local variables instead of in type system. Node.js loads files into different sandboxes, all the local variables are isolated between files to avoid "global leak", a well-known deep-seated bad part of JavaScript. As a result, Node.js developer need to require used types again and again in every file.

In ruby, it is a lot better. With the help of the well designed type system, types are shared all over the runtime, developer just need to require the types not yet loaded.

So in node.js programs, there are much more `require` statements than in ruby. And due to the design of node.js and javascript, the issue is harder to be resolved.

### Global Variable

In the browser, the JavaScript runtime other than node, global variables are very common. Global variable could be abused easily, which brings global leak to bad written JavaScript programs, and drives thousands of developers up to the wall. The JavaScript developers are scared of global leak so much that they designed such a strict isolation model in node.js. But to my understanding, the isolation avoided global leaks effectively. But at the same time, it brought tens of require statements to every files, which is also not acceptable.

In fact, with the help of JSLint, CoffeScript and some other tools, developer can avoid global leak easily. And global sharing isn't the source of evil. If abuse is avoided, I believes a reasonable level of global sharing could be useful and helpful. Actually Node.js have built-in a global sharing mechanism.

To share values across file, a special variable `global` is needed, which could be accessed in every file, and the value of which is also shared across files.

Besides sharing value around, `global` has another important feature: node treats `global` as default context, you can refer the child of `global` without explicitly identifying. So `SomeType === global.SomeType`.

With the help of `global`, we find a way to share types across files naturally.

### JS Property

Autoload mechanism of Rails loads the classes lazily. It only load the class when it is used for first time. It is a neat feature, and Rails achieve it by tracking the exception of "Uninitialized Constant". To implement similar feature in Node.js, tracking exception is hardly feasible, so I chose a different approach, I uses Property.

Property(Attribute in Ruby) enables method(function) being invoked as the field of an object is accessed. Property is a common feature among OO languages, but is a "new" feature to JavaScript. Property is a feature declared in [ECMAScript 5 standard](http://www.ecma-international.org/publications/standards/Ecma-262.htm), which enables the developers to declare property on object by using the API [Object.defineProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty). With the property, we're able to hook the callback on the type variables, and require the types when the type is accessed. So the module won't be required until it is used. On the other hand, node.js `require` function have built in the cache mechanism, that it won't load the file twice, instead it return the value from its cache. 

With property, we make the autoload lazy!

### My Implementation

To make autoload work, we need to create a magic host object to hold the type variables. In my implementation, I call the magic object Autoloader
we need to require a bootstrap script when the app starts, which is used to describe which types and how they should be required.

{% codeblock Bootstrap Script: initEnvironment.coffee lang:coffeescript %}
global.createAutoLoader = require('./services/AutoLoader')
global.createPathHelper = require('./services/PathHelper')

global.rootPath = createPathHelper(__dirname, true)

global.Configuration = require(rootPath.config('configuration'))

global.Services = createAutoLoader rootPath.services()
global.Routes = createAutoLoader rootPath.routes()
global.Records = createAutoLoader rootPath.records()
global.Models = createAutoLoader rootPath.models()

global.assets = {} # initialize this context for connect-assets helpers
{% endcodeblock %}

The script setup the autoload hosts for all services, routes, records, models for my app. And we can reference the types as following:

{% codeblock Sample Usage lang:coffeescript %}
# User = require('../models/User')
# Badget = require('../models/Badget')
# With the help of AutoLoader, the require statement above is not needed any longer
Records.User.findById uid, (err, user) ->
  badge = new Models.Badget(badgeInfo)
  user.addBadge badge
  user.save()
{% endcodeblock %}

In the `initEnvironment.coffee` script, there are 2 very important classes are used:
* AutoLoader: The class that works as the type variable hosts. All the magic happens here.
* PathHelper: The class used to handle the path combination issue.

The detailed implementation is here:
{% codeblock Autoload lang:coffeescript %}
_ = require('lodash')
path = require('path')
fs = require('fs')
createPathHelper = require('./PathHelper')

createLoaderMethod = (host, name, fullName) ->
  host.__names.push name
  Object.defineProperty host, name,
                        get: ->
                          require(fullName)

class AutoLoader
  constructor: (source) ->
    @__names = []
    for name, fullName of source
      extName = path.extname fullName
      createLoaderMethod(this, name, fullName) if require.extensions[extName]? or extName == ''

expandPath = (rootPath) ->
  createPathHelper(rootPath).toPathObject()

buildSource = (items) ->
  result = {}

  for item in items
    extName = path.extname(item)
    name = path.basename(item, extName)
    result[name] = item

  result

createAutoLoader = (option) ->
  pathObj = switch typeof(option)
    when 'string'
      expandPath(option)
    when 'object'
      if option instanceof Array
        buildSource(option)
      else
        option

  new AutoLoader(pathObj)

createAutoLoader.AutoLoader = AutoLoader

exports = module.exports = createAutoLoader
{% endcodeblock %}

{% codeblock PathHelper lang:coffeescript %}
_ = require('lodash')
fs = require('fs')
path = require('path')

createPathHelper = (rootPath, isConsolidated) ->
  rootPath = path.normalize rootPath
  result = (args...) ->
    return rootPath if args.length == 0
    parts = _.flatten [rootPath, args]
    path.join.apply(this, parts)

  result.toPathObject = ->
    self = result()
    files = fs.readdirSync(self)
    pathObj = {}

    for file in files
      fullName = path.join(self, file)
      extName =  path.extname(file)
      name = path.basename(file, extName)
      pathObj[name] = fullName

    pathObj

  result.consolidate = ->
    pathObj = result.toPathObject()

    for name, fullName of pathObj
      stats = fs.statSync(fullName)
      result[name] = createPathHelper(fullName) if stats.isDirectory()

    result

  if isConsolidated
    result.consolidate()
  else
    result

exports = module.exports = createPathHelper
{% endcodeblock %}

The code above are part of the [Express over Node](https://github.com/timnew/ExpressOverNode), to access the complete codebase, please check out the [repo](https://github.com/timnew/ExpressOverNode) on github.