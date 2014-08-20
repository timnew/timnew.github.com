layout: post
title: "Upgrading DSL From CoffeeScript to JSON: Part.2. Redefine DSL behavior"
comments: true
categories: javascript
tags:
  - dsl
  - upgrading
  - language
  - javascript
  - coffeescript
  - json
date: 2014-05-11 08:00:00
---

This is the second post in this series, [previous one](/blog/2014/05/11/upgrade-dsl-from-coffeescript-to-json-part-1-migrator) discussed the JSON schema migration mechanism.

After finish JSON DSL implementation, the No.1 problem I need to handle is how to upgrading the configuration in CoffeeScript to JSON format.

One of the solutions is to do it manually. Well, it is possible, but... JSON isn't a language really designed for human, composing configuration for 50+ sites doesn't sound like a pleasant work for me. Even when I finished it, how can I ensure all the configuration is properly upgraded? The sun is bright today, I don't want to waste whole afternoon in front of the computer checking the JSON. In one word, I'm lazy...

Since most of the change of DSL is happened on representation instead of structure. So in most cases, there is 1-to-1 mapping between v1 DSL and v2 DSL. So maybe I can generate the most of v2 DSL by using V1 DSL! Then manually handle some exceptions.

Here is a snippet of V1 DSL

{% codeblock Ver 1 DSL snippet lang:coffeescript %}
AdKiller.run -> 

  @host 'imagetwist.com', ->
    @clean('#myad', '#popupOverlay')
    @revealImg('.pic')

  @host 'yankoimages.net', ->
    @clean('#firopage')
    @revealImg('img')

  @host 'imageback.info', 'imagepong.info', 'imgking.us', 'imgabc.us', ->
    @revealA('.text_align_center a')

  @host 'imgserve.net',
    'imgcloud.co',
    'hosterbin.com',
    'myhotimage.org',
    'img-zone.com',
    'imgtube.net',
    'pixup.us',
    'imgcandy.net',
    'croftimage.com',
    'www.imagefolks.com',
    'imgcloud.co',
    'imgmoney.com',
    'imagepicsa.com',
    'imagecorn.com',
    'imgcorn.com',
    "imgboo.me",
    'imgrim.com',
    'imgdig.com',
    'imgnext.com',
    'hosturimage.com',
    'image-gallery.us',
    'imgmaster.net',
    'img.spicyzilla.com',
    'bulkimg.info',
    'pic.apollon-fervor.com',
    '08lkk.com',
    'damimage.com',
    ->
      @click('#continuetoimage input')
      @clean('#logo')
      @safeRevealImg('#container img[class]')

{% endcodeblock %}   

In version 1 implementation, `@host` defines the sites. And in the block of `@host` method, `@click`, `@clean`, `@revealImg` methods define the actions for the sites. The `@host` method instantiate new instance of `Cleaner`. The code block is invoked when cleaner is triggered, which does the actually cleaning.

Now I want to keep this file, since it shares the configuration between version 1 and version 2. And I redefine the behaviors of the cleaning method, such as `@clean`, `@click`, etc., I generate the JSON data when it is invoked instead of really altering the DOM. So I got this:

{% codeblock seed_data_generator lang:coffeescript %}
#!/usr/bin/env coffee

fs = require('fs')

AdKiller =
  run: (block) ->
    @scripts = {}
    @hosts = {}

    block.call(this)

    fs.writeFileSync 'seed_data.json', JSON.stringify({version: 1, @hosts, @scripts})

  host: (hosts..., block) ->
    @currentScript = []
    scriptId = hosts[0]

    @scripts[scriptId] = @currentScript
    for host in hosts
      @hosts[host] = scriptId

    block.call(this)

  remove: (selectors...) ->
    selectors.unshift 'remove'
    @currentScript.push selectors

  clean: (selectors...) -> # Backward compatibility
    selectors.unshift 'remove'
    @currentScript.push selectors

  hide: (selectors...) ->
    selectors.unshift 'clean'
    @currentScript.push selectors

  click: (selector) ->
    @currentScript.push ['click', selector]

  revealA: (selector) ->
    @currentScript.push ['revealA', selector]

  revealImg: (selector) ->
    @currentScript.push ['revealImg', selector]

  safeRevealA: (selector) ->
    @currentScript.push ['safeRevealA', selector]

  safeRevealImg: (selector) ->
    @currentScript.push ['safeRevealImg', selector]

AdKiller.run ->
  @host 'imagetwist.com', ->
    @clean('#myad', '#popupOverlay')
    @revealImg('.pic')
  
  # ...
{% endcodeblock %}

So now I can easily invoking this piece of code, to convert verion 1 DSL to JSON format.

DSL behavior redefinition is a super powerful trick, we used it on JSON parsing, validation, and generation before on PlayUp project. Which saved us tons of time from writing boring code.
