---
layout: post
title: "Node over Express - Configuration"
description: ""
date: 2013-04-25 21:01
comments: true
categories: 
category: Node.js
tags: 
  - node
  - express
  - node over express
  - configuration
sharing: true
footer: false
---

## Preface

I have been worked on Node.js related projects for quite a while, and had built some apps with node both for the clients or for my personal projects: [LiveHall](https://live-hall.herokuapp.com), [CiMonitor](https://github.com/timnew/CiMonitor), etc.
And I have promised some people to share some experience on node.js for long time. Today I'll begin to work on this. This will be the first blog of the series.

## Some background

In this blog, I want to talk about the configuration in node.js, which is very common problem we need to solve on almost every apps.

Problems related to configuration isn't new, and there have been dozens of mature solutions, but for Node.js apps, there is still something worth to be discussed.

Perhaps configuration could be treated some kind of special data, usually people prefers to use data language to describe their configurations. Here are some examples:

* .net and Java developer usually uses Xml to describe their configuration
* Ruby developer prefers Yaml as their configuration language
* JavaScript developer loves JSON

Data languages are convenient, because we can easily build DSL over it, and then describe our configuration with the DSL. But does the data language is the only option available?

Before we answer the question, I want to say something about the problem we're facing to.   
There is one very common requirement to all kind of configuration solutions, that is default values and overriding.  

For example, we prefers use port 80 for our web app by default, but in development environment, to make our lives easier, we perhaps prefer to use a port number over 1024, could be 3000.  
That means we need to provide 80 as the default value of port, but we wish to override the value with 3000 in the development environment.

For the example languages I mentioned before, except Yaml, Xml and JSON doesn't provide native support of inheritance and overriding. Then it means we need to implement the mechanism by our own configuration framework. Take JSON as example since we're talking about node.js, we might write the configuration in this way:

{% codeblock Sample JSON configuraiton lang:json %}
{
  "default": {
    "port": 80,
    "serveAssets": true
  },
  "development": {
    "port": 3000,
    "database": "mongodb://localhost/development"
  },
  "test": {
    "database": "mongodb://localhost/test"
  },
  "production": {
    "serveAssets": false,
    "database": "mongodb://ds0123456.mongolab.com:43487/my_sample_app"
  }
}
{% endcodeblock %}

The previous JSON snippet is very typical web app configuration, it has `default` section to provide the default values for all environments, and 3 sections for specific environments. And in our app, we need to load and parse the JSON file to get all data, then load the values of `default` section first, then override the value with the values from specific environment. And we might wish to have the validation that yields error when the configuration for provided environment is not available.

This solution looks simple and seems work fine. But when you try to apply this approach in your real app, you need to watch out some pitfalls!  
Let me explain:

## Issue 1: Secret data

In real world, values in configuration sometimes could be sensitive and need to be kept confidential.  
For example, it could contain the credential to access your database, or it could contain the secret to decrypt your cookies, or it could contain the private certificate to identify and authenticate yourself to other services, or even some secrets shared between your app and other services.  
That means you need to keep your configuration in secret and safe, or you might run into troubles!

This issue could be more obvious when you're working on open-source projects. You won't be happy if everyone can get your cookie secret in your public repo hosted on github.

To solve the issue, you might think about to add some hack to your configuration mechanism that handles these confidential configurations, such as loading it in a different way to even from a different source.   
Or to make it more generic, your might wish to add another layer of DSL that allow you to tell the app how to load your configurations rather than provide the value by default.

These hacks might work fine, but they also added additional complexity to your app. And sometimes makes your code hard to debug or hard to maintain.

## Issue 2: Dynamic data

Someone said, to solve the first issue, I will store the environment related but sensitive data in the environment variables.  
This approach is simple but works perfectly. I like the idea and recommend you to do this in our app.  
But to do this means you need the capability to load the value not just form the JSON but also form the environment variables.

Sometimes, such as deploying your app to heroku or nojitsu, you might encounter some more tricky cases, such as to provide the default value in JSON directly, but to override it with the value from environment variables, or vise versa!

These tricky requirements might blow away your mind and your code very easily. You might need to design complicated DSL and write hundreds lines of code just to load your configuration properly, which is obviously not good!

## Issue 3: Complicated Inheritance Relationship

If you think these issues do not really scare you, then how about complicated inheritance relationship between environments?  Let me explain it in more detail:

In some big and complicated web apps, you might have more than 3 basic environments as we described before, you might have:

* development: for developers to develop the app locally
* test: for developers to run unit or function test locally, such as mocha tests
* regression: for developers or QAs to run regression tests, such as cucumber tests
* integration: for QAs or Ops to test the integration with other apps
* staging: for ops and QAs to test the app in production like environment before it really goes live
* production: the environment serves your real users

If you think the previous sample isn't complicated enough. Then in real life, it could be more complicated:

* You might have multiple integration environments to test integration with different services.
* Or you might have different staging environment for different level of release.
* Or you might have more environment for some special usage: such as to running tests on CI, or to test DB migrations....

I can list tens of possibilities easily.

And when you try to describe the configurations for these environments, you might find there are only a few differences between environments.  
To make your life easier, for better maintainability and readability, you might eager to avoid the redundancy by introducing the inheritance between configurations.

As a result, you might find you successfully build up a complex inheritance relationship between configurations. And to support this kind of configuration inheritance, you might need another complicated DSL and hundreds lines of codes to parse it.

## Some comments

You might think my previous words too complicated to your problem. And you can take them as "WORST CASES" that you hardly face to.  
But I think you are very possible to feel regret to your decision once you're in "bad luck". And you might pay hours or even days to your "bad luck" very soon. 

So my suggestion is to take it seriously and solve it in a reasonable way, because you will never know whether there is a day that your boss or your client ask you to deploy the app onto an IAAS or PAAS, and you found it is hard or even impossible because you cannot configure your app properly on the environment.

You might think you're lucky because you're a Ruby developer, and you're using Yaml to configure your app, which natively support inheritance. But still, you need to solve the issue 1 and issue 2 on your own!

## My Solution

After learnt a number of painful lessons, I figured out my simple but working solution to the problem: Configuration as Code, describe your configuration in the same language that you describe your business logic!

Configuration as Code isn't a new concept, but it is extremely handy when you use it in your node.js applications! Let me explain why and how it works:

To protect your secret configuration values, you should store them in environment variables, which are only accessible on the specific server.   

Then you can load these values from the environment variables as dynamically values.  
To do it in a data language such as Json or Yaml could be hard, but it will become as easy as taking a candy from a baby if you do it in your programming language.  

To the configuration inheritance, most of OO languages have already provided very handy inheritance mechanism. Why we need to invent your own? Why not just use it?
To the value overriding, OO programming told us that it is called polymorphism. The only difference here from the typical scenario that we used to is that we don't overrides the behaviors but the values.  
But it is not an issue, because the value could be the result of the behavior, isn't it?

So till now, you must have got the idea, then you must be able to understand the following code very easily, which is a standard node.js file written in `coffee script`:

{% codeblock Configuration as Code Example lang:coffeescript %}
process.env.NODE_ENV = process.env.NODE_ENV?.toLowerCase() ? 'development'

class Config
  port: 80
  cookieSecret: '!J@IOH$!BFBEI#KLjfelajf792fjdksi23989HKHD&&#^@'

class Config.development extends Config
  port: 3009
  redis:
    uri: 'redis://localhost:6379'
  mongo:
    uri: 'mongodb://localhost'

class Config.test extends Config.development

class Config.heroku extends Config
  cookieSecret: process.env.COOKIE_SECRET
  redis:
    uri: process.env.REDISCLOUD_URL
  mongo:
    uri: process.env.MONGOLAB_URI

module.exports = new Config[process.env.NODE_ENV]()
{% endcodeblock %}

See, with the approach, you can describe your configuration easily and clearly in a few lines of code, but with built-in loading dynamical values capability and configuration inheritance and overriding capability.

In fact, to my experience, it might work better than you expected! You can get some other benefits for free:

1. You just need one set of configuration when you deploying your app to cloud or cluster. Because all the host specific configurations are usually provided via the environment variables.
2. You might have some simple and straight forward logic in your configuration, which could be very useful if you have some naming convention in your configuration. But complicated or tricky logic should be strictly avoid, because it is hurts to readability and maintainability.
3. You can easily write test to test your configuration, to make sure your app is properly configured. It could be very handy when you have complicated inheritance relationship between configurations, or you have some simple logics in your configuration.
4. Avoid to instantiate and execute the code doesn't related to your current environment, which could be helpful to avoid unnecessary error due to lack of something in specific environment, and avoid overhead to parse and instantiate some expensive resources.
5. You will get runtime error when the configuration for the environment doesn't exists.