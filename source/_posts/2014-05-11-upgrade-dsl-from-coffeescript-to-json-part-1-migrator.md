---
layout: post
title: "Upgrading DSL from CoffeeScript to JSON: Part.1. Migrator"
description: ""
date: 2014-05-11 20:02
comments: true
categories: 
category: javascript
tags: 
  - dsl
  - upgrading
  - language
  - javascript
  - coffeescript
  - json
  - migration
  - schema
  - update  
sharing: true
footer: false
published: true
---

I'm working on the Harvester-AdKiller version 2 recently. Version 2 dropped the idea "Code as Configuration", because the nature of Chrome Extension. Recompiling and reloading the extension every time when configuration changed is the pain in the ass for me as an user.

For security reason, Chrome Extension disabled all the Javascript runtime evaluation features, such as `eval` or `new Function('code')`. So that it become almost impossible to edit code as data, and later applied it on the fly.

Thanks to the version 1, the feature and DSL has almost fully settled, little updates needed in the near future. So I can use a less flexible language as the DSL instead of CoffeeScript. 

Finally I decided to replace CoffeeScript to JSON, which can be easily edited and applied on the fly. 

After introducing JSON DSL, to enable DSL upgrading in the future, an migration system become important and urgent. (Actually, this prediction is so solid. I have changed the JSON schema once today.) So I come up a new migration system:

{% codeblock Upgrader lang:coffeescript %}

class Upgrader
  constructor: ->
    @execute()

  execute: =>
    console.log "[Upgrader] Current Version: #{Configuration.version}"
    migrationName = "#{Configuration.version}"
    migration = this[migrationName]

    unless migration?
      console.log '[Upgrader] Latest version, no migration needed.'
      return

    console.log "[Upgrader] Migration needed..."
    migration.call(this, @execute)

  'undefined': (done) ->
    console.log "[Upgrader] Load data from seed..."
    Configuration.resetDataFromSeed(done)

  '1.0': (done) ->
    console.log "[Upgrader] Migrating configuration schema from 1.0 to 1.1..."
    # Do the migration logic here
    done() 

{% endcodeblock %}

The `Upgrader` will be instantiate when extension started, after `Configuration` is initialized, which holds the DSL data for runtime usage. 

When the `execute` method is invoked, it check the current version, and check is there a upgrading method match to this version. If yes, it triggers the migration; otherwise it succeed the migration. Each time a migration process is completed, it re-trigger `execute` method for another round of check.

Adding migration for a specific version of schema is quite simple. Just as method `1.0` does, declaring a method with the version number in the `Upgrader`.

`'undefined'` method is a special migration method, which is invoked there is no previous configuration found. So I initialize the configuration from seed data json file, which is generated from the version 1 DSL. 

The seed data generation is also an interesting topic. Please refer to [next post(Redfine DSL behavior)](/blog/2014/05/11/upgrading-dsl-from-coffeescript-to-json-part-dot-2-redefine-dsl-behavior) of this series for details.

