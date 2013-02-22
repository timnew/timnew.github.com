---
layout: post
title: "Manage configuration in Rails way on node.js by using inheritance"
description: ""
date: 2013-02-22 10:13
comments: true
categories: node.js
category: 
tags: 
  - express
  - node.js
  - configuration
  - inheritance
  - scheme
  - environment
  - ruby
  - rails
sharing: true
footer: false
---

Application is usually required to run in different environments. To manage the differences between the environments, we usually introduce the concept of Environment Specific Configuration.  
In Rails application, by default, Rails have provided 3 different environments, they are the well known, `development`, `test` and `production`.   
And we can use the environment variable `RAILS_ENV` to tell Rails which environment to be loaded, if the `RAILS_ENV` is not provided, Rails will load the app in `development` env by default.

This approach is very convenient, so we want to apply it to anywhere. But in node.js, Express doesn't provide any configuration management. So we need to built the feature by ourselves.

The environment management usually provide the following functionalities:

  * Allow us to provide some configuration values as the default, which will be loaded in all environments, usually we call it `common`.
  * Specific configuration will be loaded according to the environment variable, and will override some values in the `common` if necessary.

Rails uses `YAML` to hold these configurations, which is concise but powerful enough for this purpose. And YAML provided inheritance mechanism by default, so you can reduce the duplication by using inheritance.

{% codeblock Inheritance in Rails YAML Configuration lang:yaml %}

development: &defaults
  adapter: mysql
  encoding: utf8
  database: sample_app_development
  username: root

test:
  <<: *defaults
  database: sample_app_test

cucumber:
  <<: *defaults
  database: sample_app_cucumber
  
production:
  <<: *defaults
  database: sample_app_production
  username: sample_app
  password: secret_word
  host: ec2-10-18-1-115.us-west-2.compute.amazonaws.com

{% endcodeblock %}

In `express` and `node.js`, if we follow the same approach, comparing to `YAML`, we prefer `JSON`, which is supported natively by `Javascript`.
But to me, `JSON` isn't the best option, there are some disadvantages of `JSON`:

  * JSON Syntax is not concise enough
  * Matching the brackets and appending commas to the line end are distractions
  * Lack of flexility

As an answer to these issues, I chose `coffee-script` instead of `JSON`.  
`Coffee` is concise. And similar to `YAML`, `coffee` uses indention to indicate the nested level. And `coffee` is executable, which provides a lot of flexibilities to the configuration. So we can implement a Domain Specific Language form

To do it, we need to solve 4 problems:

  1. Allow dev to declare default configuration.
  2. Load specific configuration besides of default one. 
  3. Specific configuration can overrides the values in the default one.
  4. Code is concise, clean and reading-friendly.

Inspired by the YAML solution, I work out my first solution:

{% codeblock Configuration in coffee script lang:coffeescript %}

_ = require('underscore')

config = {}

config['common'] =
  adapter: "mysql"
  encoding: "utf8"
  database: "sample_app_development"
  username: "root"
  
config['development'] = {}
  
config['test] =
  database: "sample_app_test"
  
config['cucumber'] = 
  database: "sample_app_cucumber"

config['production'] = 
  database: "sample_app_production"
  username: "sample_app"
  password: "secret_word"
  host: "ec2-10-18-1-115.us-west-2.compute.amazonaws.com"

_.extend exports, config.common

specificConfig = config[process.env.NODE_ENV ? 'development']

if specificConfig?
  _.extend exports, specificConfig

{% endcodeblock %}

`YAML` is data centric language, so its inheritance is more like "mixin" another piece of data. So I uses `underscore` to help me to mixin the specific configuration over the default one, which overrides the overlapped values.

But if we jump out of the YAML's box, let us think about the `Javascript` itself, Javascript is a prototype language, which means it had already provide an overriding mechanism natively. Each object inherits and overrides the value from its prototype.
So I worked out the 2nd solution:

{% codeblock Prototype based Configuration lang:coffeescript %}

config = {}

config['common'] =
  adapter: "mysql"
  encoding: "utf8"
  database: "sample_app_development"
  username: "root"
  
config['development'] = {}
config['development'].__proto__ = config['common']
  
config['test] =
  __proto__: config['common']
  database: "sample_app_test"
  
config['cucumber'] = 
  __proto__: config['test']
  database: "sample_app_cucumber"

config['production'] = 
  __proto__: config['common']
  database: "sample_app_production"
  username: "sample_app"
  password: "secret_word"
  host: "ec2-10-18-1-115.us-west-2.compute.amazonaws.com"  

process.env.NODE_ENV = process.env.NODE_ENV?.toLowerCase() ? 'development'

module.exports = config[process.env.NODE_ENV]

{% endcodeblock %}

This approach works, but looks kind of ugly. Since we're using `coffee`, which provides the syntax sugar for class and class inheritance.
So we have the 3rd version:

{% codeblock Class based configuration lang:coffeescript %}

process.env.NODE_ENV = process.env.NODE_ENV?.toLowerCase() ? 'development'

class Config
  adapter: "mysql"
  encoding: "utf8"
  database: "sample_app_development"
  username: "root"
  
class Config.development extends Config
  
class Config.test extends Config
  database: "sample_app_test"
  
class Config.cucumber extends Config
  database: "sample_app_cucumber"

class Config.common extends Config
  database: "sample_app_production"
  username: "sample_app"
  password: "secret_word"
  host: "ec2-10-18-1-115.us-west-2.compute.amazonaws.com"

module.exports = new Config[process.env.NODE_ENV]()

{% endcodeblock %}

Now the code looks clean, and we can improve it a step further if necessary. We can try to separate the configurations into files, and required by the file name:

{% codeblock Class based configuration lang:coffeescript %}

# config/config.coffee
configName = process.env.NODE_ENV = process.env.NODE_ENV?.toLowerCase() ? 'development'

SpecificConfig  = requrie("./envs/#{configName}")

module.exports = new SpecificConfig()

# config/envs/commmon.coffee
class Common
  adapter: "mysql"
  encoding: "utf8"
  database: "sample_app_development"
  username: "root"
  
module.exports = Common

# config/envs/development.coffee
Common = require('./common')
class Development extends Common

module.exports = Development
  
# config/envs/test.coffee
Common = require('./common')  
class Test extends Common
  database: "sample_app_test"

module.exports = Test

# config/envs/cucumber.coffee
Test = require('./common')    
class Cucumber extends Test
  database: "sample_app_cucumber"
  
module.exports = Cucumber

# config/envs/production.coffee
Common = require('./common')  
class Production extends Common
  database: "sample_app_production"
  username: "sample_app"
  password: "secret_word"
  host: "ec2-10-18-1-115.us-west-2.compute.amazonaws.com"

module.exports = Production

{% endcodeblock %}




