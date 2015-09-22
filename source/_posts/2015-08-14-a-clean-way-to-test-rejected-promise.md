layout: post
title: A clean way to test rejected promise
date: 2015-08-14 16:08:53
categories:
tags:
---

```coffeescript
  session = new Session().generateId().bindUserFromRedis()
  .catch (ex) ->
    ex
  .then (ex) ->
    expect(ex).to.be.instanceof(ResponseError)
              .and.that.have.property('errorName', 'session-expired')
  .nodeify(done)
```

```coffeescript
  session = new Session().generateId().bindUserFromRedis()
  .then ->
    null
  .catch (ex) ->
    ex
  .then (ex) ->
    expect(ex).to.be.instanceof(ResponseError)
              .and.that.have.property('errorName', 'session-expired')
  .nodeify(done)
```
