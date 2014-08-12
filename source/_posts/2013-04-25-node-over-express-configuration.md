layout: post
title: Node over Express - Configuration
comments: true
categories: Node.js
tags:
  - node
  - express
  - node over express
  - configuration
date: 2013-04-25 08:00:00
---
## Preface

I have been working on Node.js related projects for quite a while, and have built apps with node both for the clients or personal projects, such as [LiveHall](https://live-hall.herokuapp.com), [CiMonitor](https://github.com/timnew/CiMonitor), etc. I have promised some one to share my experience on node. Today I’ll begin to work on this. This will be the first blog of the series.

## Background

In this blog, I would like to talk about the configuration in node, which is common problem we need to solve in apps.

Problems related to configuration aren’t new, and there have been a dozens of mature solutions, but for Node.js apps, there is still something worth to be discussed.

Perhaps configuration could be treated as a kind of special data. Usually developers prefer to use data language to describe their configurations. Here are some examples:

*	.net and Java developer usually uses Xml to describe their configuration
*	Ruby developer prefers Yaml as the configuration language
*	JavaScript developer tend to use Json

Data languages are convenient, because developers can easily build DSL on it, then they describe the configuration with the DSL. But is the data language the best option available? Is it really suitable to be used in all scnearios?

Before we answer the questions, I would like to say something about the problem we’re facing. There is one common requirement to all kinds of configuration solutions, which is default values and overriding.

For example, as a Web app default, we use port 80; but in development environment, we prefer to use a port number over 1024, 3000 is a popular choice. That means we need to provide 80 as the default value of the port, but we wish to override the value with 3000 in the development environment.

For the languages I mentioned above, except for Yaml, Xml and Json, doesn’t provide native support of inheritance and overriding. It means we need to implement the mechanism by our own. Take Json as example, we might write the configuration in this way:

{% codeblock Sample Json configuration lang:json %}
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

The previous Json snippet is a typical example of web app configuration; it has a default section to provide the default values for all environments. Three sections for specific environments. To apply it corecctly to our app, we need to load and parse the Json file to get all data first, then load the values of the default section, then override the value with the values from specific environment.  In addition, we might wish to have the validation that yields error when the provided environment doesn’t exist. 

This solution looks simple and seems to work, but when you try to apply this approach to your app in real life, you need to watch out some pitfalls.

## Issue 1: Confidential Values

In the real world, values in configuration sometimes could be sensitive and need to be kept confidential. It could contain the credential to access your database, Or it could contain the key to decrypt the cookies. It may also contain private certificate that identifies and authenticates the app to other services. In these scenarios, you need to protect your configuration in order to avoid big trouble! 

To solve the issue, you might think about adding new feature that enable you to to encrypt confidential values or to load it from a different safe source.  To achieve it, you might need to add another layer of DSL which add more complexities to your app and make your code harder to debug or to maintain.

## Issue 2: Dynamic Data

A solution to first issue,  one could store the environment related but sensitive data in the environment variables. The solution is simple and works perfectly, so I highly recommend it. However, to do this means you need the capability to load the value not only from Json directly but also from the environment variables.

Sometimes, such as deploying your app to Heroku/Nojitsu, might give rise that make the case trickier. After deployed the app to Heroku/Nojitsu, the default values are provided in Json directly, and some of which need to be overrode with the values from environment variables or you need to do it vice versa. These tricky requirements might blow your mind and your code away easily. It causes complicated DSL design and hundreds lines of implementation, but just to load your configuration properly. Obviously it is not a good idea. 

## Issue 3: Complicated Inheritance Relationship

Scared about above cases? No, then how about complicated inheritance relationship between environments? 

In some big and complicated web apps, there might be more than 3 basic environments, such as:

*	Development: for developers to develop the app locally
*	Test: for developers to run unit or function test locally, such as mocha tests
*	Regression: for developers or QAs to run regression tests, such as cucumber tests
*	Integration: for QAs or Ops to test the integration with other apps
*	Staging: for ops and QAs to test the app in production like environment before it really goes live
*	Production: the environment serves your real users
* ...

When try to write configurations for these environments, one might find there are only a few differences between environments. To make life easier,  to avoid the redundancy, introducing the inheritance between configurations might be a good idea.

As the consequence, the whole configuration becomes environments with complex inheritance relationship. And to support this kind of configuration inheritance,  a more complex DSL and hundreds lines of codes are needed.

## Some Comments
My assumption above seems to be a little too complex.  From some people, it might be the “WORST CASE SCENERIO” and hard to come by. But according to my experience, it is very common when building real web app with node. So if to solve it isn’t too hard, it could be better to consider it seriously and solve it gracefully.

Ruby developer might think they’re lucky because Yaml supports inheritance natively. But confidential data and dynamic data still troubles.  

## My Solution

After learnt a number of painful lessons, I figured out a simple but working solution: Configuration as Code - describe the configuration with the same language that the business logic is described!

Configuration as code isn’t a new concept, but it is extremely handy when you use it in node applications! Let me explain why and how it works:

To protect the confidential configuration values, one should store them with environment variables, which are only accessible in the specific server.
Then one can load these values from the environment variables as dynamically values.

To do it in a data language such as Xml, Json or Yaml could be hard, but it will become as easy as taking a candy from a baby if it is done in the programming language that application applied/used, such as ruby or javascript.

To the configuration inheritance, OO languages have already provided very handy inheritance mechanism. Why do we need to invent one? Why not just use it? To the value overriding, OO programming tells us that it is called polymorphism. The only difference here from the typical scenario is that we override the values instead of the behaviors. But it isn’t an issue, because the value could be the result of the behavior, right?

Now I assume that everyone got a pretty good idea of what I am saying. If that is the case, then the below code should be able to be understood quite clearly,  which is a standard Node.js file written in `coffee script`:

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

See, with the approach, one can describe the configuration easily and clearly in a few lines of code, but with built-in loading dynamical values capability and configuration inheritance and overriding capability.

In fact, with my suggestions, it might work better than expected! Here are the additional free benefits:

1. Only one configuration is needed when  the app deployed to the cloud. Because all the host specific configurations are usually provided via the environment variables in Paas.
2. Have some simple and straightforward logic in the configuration, which could be very useful, especially if there is some naming convention in the configuration. But complicated or tricky logic should be strictly avoided, because it is hurts the readability and maintainability.
3. Easy to write tests for configurations, to ensure the values are properly set. It could be very handy when there are complicated inheritance relationships between configurations, or have some simple logic in your configuration.
4. Avoid to instantiate and execute the code that isn’t related to the current environment, which could be helpful to avoid overhead to instantiate unused expensive resources or to avoid errors caused because of incompatibility between environments.
5. Get runtime error when the configuration for the environment doesn’t exist.

<hr>

Besides of the content, I want to say thank you to my English teacher Marina Sarg, who helped me on this series of blog a lot. Without her, there won't be this series of blogs. Marina, thank you very much.