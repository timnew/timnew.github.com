---
layout: post
title: "Chrome Extension RPC Router"
description: ""
date: 2014-05-11 01:48
comments: true
categories: 
category: chrome 
tags: 
  - chrome
  - extension
  - messaging
  - RPC
  - router
  - routing
sharing: true
footer: false
published: true
---

When developing chrome extension, communication between background script and content scripts is very typical use case. Chrome provides messaging APIs to achieve this goal. But this API has limitation that every message goes to the same listener.

Background script in Chrome extension usually works as a function hub for the whole extension, so background scripts usually required to process different types of messages. Then the limit of Chrome messaging API become an issue we need to face.

There are several approaches to resolve the limitation. Since API allow multiple listener, a simple and cheap solution is Responsibility Chain; adding listener for each message type, and checking message type at beginning of the listener.

{% codeblock Responsbility Chain lang:js %}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.type != 'reloadData')
    return;
  
  // reload data logic here
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if(message.type != 'updateBrowerAction')
    return;
  
  // update browser action logic here
});

{% endcodeblock %}

This approach works, but not that graceful. And there is potential performance issue when message types increases.

So I come up a new more graceful solution: RPC Message Router

{% codeblock RCPRouter lang:coffeescript %}

extractResponseHandler = (args) ->
  return undefined if args.length == 0

  last = args.pop()

  if typeof last == 'function'
    return last
  else
    args.push last
    return undefined

class @RPCRouter
  constructor: ->
    chrome.runtime.onMessage.addListener @handleMassage

  handleMassage: (message, sender, sendResponse) =>
    {method: methodName, args} = message
    method = this[methodName]

    unless method?
      console.error "Unknown RPC method: %s", methodName
      return

    args.push sendResponse

    console.log "RPC Call: %s, args: %o", methodName, args
    method.apply(this, args)

  callBackground: (method, args...) ->
    responseHandler = extractResponseHandler(args)
    console.log "RPC Call to Background: %s, args: %o", method, args
    chrome.runtime.sendMessage {method, args}, responseHandler

  callTab: (tabId, method, args...) ->
    responseHandler = extractResponseHandler(args)
    console.log "RPC Call to Tab \"%s\": %s, args: %o", tabId, method, args
    chrome.tabs.sendMessage tabId, {method, args}, responseHandler

{% endcodeblock %}

So this new RPCRouter wraps the chrome original messaging API and provides a more convenient way to invoke a remote method. To create a specific RPC Router for background page or content page is quite easy.

{% codeblock Responsbility Chain lang:coffeescript %}

class BackgroundRPCRouter extends RPCRouter
  refreshData: (isForceUpdate, dataLoadedCallback) ->
    # reload data logic here

    dataLoadedCallback(data)

  updateBrowerAction: (icon, hintText) ->
    # update browser action logic here

    return false # protection: avoid channel leak

{% endcodeblock %}

**HINT:**  
Using messaging API in chrome here should be careful. Coffee script will return the last executed statement result as function result, which could be potentially truthy, such as non-zero number, object. The truthy return value will make the channel become a async channel, which won't be closed until the `sendResponse` callback is invoked. But just as the handler `updateBrowserAction`, the handler doesn't need a `sendResponse` callback, the issue will keep the channel alive forever. So do add `false` or `return false` at the end of the method unless you can ensure the function will never yield truthy value in last statement.