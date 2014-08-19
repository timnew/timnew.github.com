layout: post
title: Process.nextTick Implementation in Browser
comments: true
categories: javascript
tags:
  - node.js
  - nextTick
  - browser
  - nextTick
  - infinite recursion
date: 2014-06-23 08:00:00
---
Recursion is a common trick that is often used in JavaScript programming. So infinite recursion will cause stack overflow errors. 
Some languages resolves this issue by introduce automatically tail call optimization, but in JavaScript we need to take care it on our own.

To solve the issue, `Node.js` has the utility functions `nextTick` to ensure specific code is invoked after the current function returned. 
In Browser there is no standard approach to solve this issue, so workarounds are needed.

Thanks to [Roman Shtylman(@defunctzombie)](https://github.com/defunctzombie), who created the `node-process` for `Browserify`, which simulate the `Node.js` API in browser environment.
Here is his implementation:

[node-process](https://github.com/defunctzombie/node-process/blob/master/browser.js)
{% codeblock Infinite Recursion lang:js %}

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener;
 
    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }
 
    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);
 
        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }
 
    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

{% endcodeblock %}

Here is some comments on the implementation.

### setTimeout

To simulate the nextTick behavior, `setTimeout(fn, 0)` is a well-known and easy to adopt approach. The issue of this method is that `setTimeout` function does heavy operations, call it in loop causes significant performance issue. So we should try to use cheaper approach when possible.

### setImmidate

There is a function called `setImmediate`, which behaves quite similar to `nextTick` but with a few differences when dealing with IO stuff. But in browser environment, there is no IO issue, so we can definitely replace the `nextTick` with it.   

{% blockquote setImmediate(callback, [arg], [...]) http://nodejs.org/api/timers.html#timers_setimmediate_callback_arg Node.js %}
Immediates are queued in the order created, and are popped off the queue once per loop iteration. This is different from process.nextTick which will execute process.maxTickDepth queued callbacks per iteration. setImmediate will yield to the event loop after firing a queued callback to make sure I/O is not being starved. While order is preserved for execution, other I/O events may fire between any two scheduled immediate callbacks.
{% endblockquote %}

The `setImmediate` function is perfect replacement for `nextTick`, but it is not supported by all the browsers. Only `IE 10` and `Node.js 0.10.+` supports it. Chrome, Firefox, Opera and all mobile browsers don't.

{% blockquote window.setImmediate https://developer.mozilla.org/en-US/docs/Web/API/Window.setImmediate MDN %}
Note: This method is not expected to become standard, and is only implemented by recent builds of Internet Explorer and Node.js 0.10+. It meets resistance both from Gecko (Firefox) and Webkit (Google/Apple).
{% endblockquote %}

### window.postMessage
`window.postMessage` enable developer to access message queue in the browser. By adding some additional code, we can simulate nextTick behavior based on message queue. It works in most modern browser, except `IE 8`. In `IE 8`, the API is implemented in a  synchronous way, which introduce an extra level of stack-push, so it cannot be used to simulate `nextTick`.

Overall, there is no perfect workaround to the `nextTick` issue for now. All the solutions have different limitations, we can only hope that this issue can be resolved in the future ECMAScript standard. 