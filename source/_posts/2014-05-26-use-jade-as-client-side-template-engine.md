layout: post
title: Use Jade as client-side template engine
comments: true
categories:
  - Programming
  - node.js
tags:
  - jade
  - html
  - front-end
  - template engine
  - pre-compile
  - grunt
  - build
  - client side
date: 2014-05-26 08:00:00
---
[Jade](http://jade-lang.com/) is a powerful JavaScript HTML template engine, which is concise and powerful. Due to its awesome syntax and powerful features, it almost become the default template engine for node.js web servers.

Jade is well known as a server-side HTML template, but actually it can also be used as a client-side template engine, which is barely known by people! To have a better understanding of this issue, firstly we should how Jade engine works.

When we're translating a jade file into HTML, Jade engine actually does 2 separate tasks: **Compiling** and **Rendering**.

### Compiling

Compiling is almost a transparent process when rendering jade files directly into HTML, including, rendering a jade file with `jade` cli tool. But it is actually the most important step while translating the jade template to HTML.
Compiling will be translate the jade file into a JavaScript function. During the process, all the static content has been translated.

Here is simple example:

{% codeblock Jade template lang:jade %}
doctype html
html(lang="en")
  head
    title Title  
  body
    h1 Jade - node template engine
    #container.col
      p You are amazing
      p.
        Jade is a terse and simple
        templating language with a
        strong focus on performance
        and powerful features.
{% endcodeblock %}

{% codeblock Compiled template lang:js %}
function template(locals) {
    var buf = [];
    var jade_mixins = {};
    buf.push('<!DOCTYPE html><html lang="en"><head><title>Title  </title></head><body><h1>Jade - node template engine</h1><div id="container" class="col">     <p>You are amazing</p><p>Jade is a terse and simple\ntemplating language with a\nstrong focus on performance\nand powerful features.</p></div></body></html>');
    return buf.join("");
}
{% endcodeblock %}

As you can see, the template is translated into a JavaScript function, which contains all the HTML data. In this case, since we didn't introduce any interpolation, so the HTML content has been fully generated.

The case will become more complicated when interpolation, `each`, `if` statement is introduced.

{% codeblock Jade template with interpolation lang:jade %}
doctype html
html(lang="en")
  head
    title =title  
  body
    h1 Jade - node template engine
    #container.col
    ul
      each item in items
        li= item

    if usingJade
      p You are amazing
    else
      p Get it!

    p.
      Jade is a terse and simple
      templating language with a
      strong focus on performance
      and powerful features.
{% endcodeblock %}

{% codeblock Compiled template with interpolation lang:js %}
function template(locals) {
    var buf = [];
    var jade_mixins = {};
    var locals_ = locals || {}, items = locals_.items, usingJade = locals_.usingJade;
    buf.push('<!DOCTYPE html><html lang="en"><head><title>=title  </title></head><body><h1>Jade - node template engine</h1><div id="container" class="col"></div><ul>');
    (function() {
        var $$obj = items;
        if ("number" == typeof $$obj.length) {
            for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
                var item = $$obj[$index];
                buf.push("<li>" + jade.escape(null == (jade.interp = item) ? "" : jade.interp) + "</li>");
            }
        } else {
            var $$l = 0;
            for (var $index in $$obj) {
                $$l++;
                var item = $$obj[$index];
                buf.push("<li>" + jade.escape(null == (jade.interp = item) ? "" : jade.interp) + "</li>");
            }
        }
    }).call(this);
    buf.push("</ul>");
    if (usingJade) {
        buf.push("<p>You are amazing</p>");
    } else {
        buf.push("<p>Get it!</p>");
    }
    buf.push("<p>Jade is a terse and simple\ntemplating language with a\nstrong focus on performance\nand powerful features.</p></body></html>");
    return buf.join("");
}
{% endcodeblock %}

{% codeblock Data for interpolation lang:json %}
{
  "title": "Jade Demo",
  "usingJade": true,
  "items":[
    "item1",
    "item2",
    "item3"
  ]
}
{% endcodeblock %}

{% codeblock Output Html lang:html %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>=title  </title>
  </head>
  <body>
    <h1>Jade - node template engine</h1>
    <div id="container" class="col"></div>
    <ul>
      <li>item1</li>
      <li>item2</li>
      <li>item3</li>
    </ul>
    <p>You are amazing</p>
    <p>
      Jade is a terse and simple
      templating language with a
      strong focus on performance
      and powerful features.
    </p>
  </body>
</html>
{% endcodeblock %}

Well, as you can see, the function has become quite complicated than before. It could become more complicated when `extend`, `include` or `mixin` introduced, you can trial it on your own.

### Rendering

After the compiling, the rendering process is quite simple. Just invoking the compiled function, the return string is rendered html. The only thing need to mentioned here is the interpolation data should be passed to the template function as `locals`.

### Using Jade as front-end template engine

Still now, you probably have got my idea. To use jade a front-end template, we can compose the template in jade. Later compile it into JavaScript file. And then we can invoke the JavaScript function in front-end to achieve dynamic client-side rendering!

Since Jade template has been precompiled at server side, so there is very little runtime effort when rendering the template at client-side. So it is a cheaper solution when you have lots of templates.

To compile the jade files into JavaScript instead of HTML, you need to pass `-c` or `--client` option to `jade` cli tool. Or calling `jade.compile` instead of `jade.render` while using JavaScript API.

### Configure Grunt

Well, since [Grunt](http://gruntjs.com/) is popular in node.js world. So we can also use Grunt to do the stuff for us.  
Basically, use grunt for jade is straightforward. But it is a little bit tricky when you want to compile the back-end template into HTML as well as to compile the front-end template into JavaScripts.

I used a little trick to solve the issue. I follow the convention in Rails, that prefix the front-end template files with underscore.
So

{% codeblock %}

/layouts/default.jade       -> Layout file, extended by back-end/front-end templates, should not be compiled.
/views/settings/index.jade  -> Back-end template, should be compiled into HTML
/views/settings/_item.jade  -> Front-end template, should be compiled into JavaScript

{% endcodeblock %}

{% codeblock Gruntfile.coffee lang:coffeescript %}

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    jade:
      options:
        pretty: true

      compile:
        expand: true
        cwd: 'views'
        src: ['**/*.jade', '!**/_*.jade']
        dest: 'build/'
        ext: '.html'

      template:
        options:
          client: true
          namespace: 'Templates'

        expand: true
        cwd: 'views'
        src: ['**/_*.jade']
        dest: 'build/'
        ext: '.js'

  grunt.loadNpmTasks('grunt-contrib-jade')  

{% endcodeblock %}

I distinguish the layouts and templates by file path. And distinguish the front-end/back-end templates by prefix. The filter `!**/_*.jade` excludes the front-end templates when compiling the back-end templates.

This approach should work fine in most cases, but if you are facing more complicated situation, and can't be handled with this trick, try defining your own convention, and recognizing it with custom filter function to categorize them.
