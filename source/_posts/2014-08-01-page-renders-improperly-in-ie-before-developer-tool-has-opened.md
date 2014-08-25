layout: post
title: Page renders improperly in IE before developer tool has opened
comments: true
categories:
  - Programming
  - Web
tags:
  - javascript
  - IE
  - developer tool
  - pitfall
  - console
  - undefined
  - polyfill
date: 2014-08-01 08:00:00
---
Today I found a super annoying issue about IE. Our website works perfectly in any browser except IE. The page isn't rendered properly in IE 9. Well, this is common, this is the nature of IE. The mysterious issue I found is that once you opened or ever opened the developer tool, open the page or refresh the page, the problem is gone magically!!!!

As a conclusion, opening the developer tool changes the browser behavior!!!!! What a hell! So you know there is something wrong, but once you try to figure out the error message, you have to open developer tool. Once you open the developer tool, the bug is gone! **DEAD END!!!**

Because I cannot open developer tool, so I have to debug with `alert`. It is really a horrible experience to me, and feels like inspecting nuclear reaction with a plain optical magnifier or fixing a high-tech spacecraft with stones and clubs.

Since it is client-rich page, a lot of javascript is introduced. So I cannot go through the scripts line by line, instead I have to make an assumption to explain the phenomena spotted, then validate it with experiments, finally correct or extend the assumption according the validation result.

During the process I invalidated a couple of assumptions, some of them are seems very close to the "right answer", such as "some script is loaded and executed before its dependencies, and developer tool load all the scripts first because it displays all the scripts".

After spending a couple of hours on it, I put on eye on a line of code that is really out of my expectation: `console.warn`.

{% codeblock Code breaks the page rendering lang:javascript %}

console.warn('__proto__ is not supported by current browser, fallback to hard-copy approach');

{% endcodeblock %}

I displays a warning message to console when a workaround is applied. But a tricky fact about IE 9 is that `console` isn't available until developer tool is opened ([MSDN reference here](http://msdn.microsoft.com/library/ie/bg182326(v=vs.85)))!!!

The fact that console is not available until developer tools is opened really blows my mind away! (Maybe it is because I have little experience work with IE). As a chrome user, I take console as the universal log system for javascript. But in IE, according to the [document](http://msdn.microsoft.com/library/ie/bg182326(v=vs.85)), the code should check the existence of console every time print a log.

There is another pitfall here, and I saw someone really post it as answer on [StackOverflow](http://stackoverflow.com/questions/2656730/internet-explorer-console):

{% codeblock Bad polyfill implemntation lang:javascript %}

if (typeof console == "undefined") {
    this.console = { log: function (msg) { alert(msg); } };
}

{% endcodeblock %}

We usually access `console` as `console.log`, feels like `console` is a global instance to access. But actually console is an member of `window`, its full name should be `window.console`. When `console` exists, we can definitely reference to it via `console`. But if it doesn't exist, the statement `console` cause script error! So the following code doesn't work:

{% codeblock Pitfalls in console existence check lang:javascript %}

if (typeof(console) === 'undefined'){ // Break the script execution
  console.log('Never got executed');
}

if (console != null) { // Break the script execution
  console.log('Never got executed');
}

if (console) { // Break the script execution
  console.log('Never got executed');
}

if (window.console) {
  console.log('this works!');
}

{% endcodeblock %}

To avoid `console` issue, a ployfill could be very useful. Here is a great implementation available as `bower` package: [console-polyfill](https://github.com/paulmillr/console-polyfill)
