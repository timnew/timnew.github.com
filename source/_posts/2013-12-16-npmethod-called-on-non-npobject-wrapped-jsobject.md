layout: post
title: NPMethod called on non-NPObject wrapped JSObject
comments: true
categories:
  - Programming
  - Android
tags:
  - js
  - browser
  - binding
  - NPObject
  - NPMethod
  - Wrapper
  - Android
  - WebView
  - javascript
date: 2013-12-16 08:00:00
---
I'm working on a "hybrid" android appilcation. In the app, part of the UI was written in HTML and hosted in a WebView. And I exposed several Java objects to JavaScript as `Java Script Interface`.

{% codeblock Setup WebView lang:java %}  
  webView.getSettings().setJavaScriptEnabled(true);
  webView.addJavascriptInterface(irBlaster, "irBlaster");
{% endcodeblock %}

The `irBlaster` object contains several methods, and js will invoke the specific method according to the data-attribute bound to the element.

{% codeblock Script that handles the button click in HTML lang:coffeescript %}  
  onIrButtonClicked: (e) =>
    $button = $(e.currentTarget)
    type = $button.data('irType')

    sendFunc = irBlaster[type]

    code = @parseCode($button.data('irCode'))
    length = $button.data('irLength')

    sendFunc(length, code)
{% endcodeblock %}

The previous coffee-script works fine in my Jasmine tests with javascript mock version of irBlaster. When the button clicked, the proper method was invoked with proper arguments.
But when I run this code with real android app, WebView yields error says "NPMethod called on non-NPObject wrapped JSObject".

The error message looks quite hard to understand the meaning, so I spent quite time to diagnose the code.

After several try, I found the following code works fine, but original one doesn't:

{% codeblock Code works lang:coffeescript %}
  onIrButtonClicked: (e) =>
    $button = $(e.currentTarget)
    type = $button.data('irType')

    switch irBlaster[type]
      when 'NEC'

        code = @parseCode($button.data('irCode'))
        length = $button.data('irLength')

        irBlaster.NEC(length, code)

      .
      .
      .

{% endcodeblock %}

So I realize the issue was occurd in the javascript contextual binding.

Javascript is function-first-citizen language, and method call on object was simulate by invoking the function with specific context, and the code behavior won't change if there is no reference to this pointer in the method. So it is quite normal that fetch a method from a object than invoke it without context.

That is why the Jasmine tests passed successfully. But the `irBlaster` isn't real or simple javascript, but a native java object provided by js binding interface, so there is a limitation that the method on it cannot be invoked without context. Or it causes error.

So the issue can be resolved as following code by invoking the method in a "reflection" flavor:

{% codeblock Invoking native binding object with context provided in HTML lang:coffeescript %}
  onIrButtonClicked: (e) =>
    $button = $(e.currentTarget)
    type = $button.data('irType')

    sendFunc = irBlaster[type]

    code = @parseCode($button.data('irCode'))
    length = $button.data('irLength')

    sendFunc.call(irBlaster, length, code)
{% endcodeblock %}

In previous code, I invoke the `sendFunc` with `call`, and provids irBlaster as the context as `this`. So the problem solved, the code runs smoothly without issue.
