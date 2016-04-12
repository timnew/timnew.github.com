layout: post
title: A clean way to test rejected promise
date: 2015-08-14 16:08:53
categories:
  - Programming
  - JavaScript
tags:
  - JavaScript
  - Promise
  - Test
  - Mocha
---

To test the the exception in a rejected promise could be a little bit painful.

And [Mocha] is Promise-friendly, which means it fails the test if exception is not caught.

So as a result, here is a simple code example to explain how it is being done:

```coffeescript
it 'should throw session-expired exception'
  new Session().generateId().bindUserFromRedis()
  .then ->
    null
  .catch (ex) ->
    ex
  .then (ex) ->
    expect(ex).to.be.instanceof(ResponseError)
              .and.that.have.property('errorName', 'session-expired')
```
<hr>

**Update:** A Chai Plugin can mitigate the pain

```js
it('should throw session-expired exception', () => {
  return expect(new Session().generateId().bindUserFromRedis())
           .to.evetually.rejected
              .and.that.have.property('errorName', 'session-expired')
})
```

**Update 2:** With async, it can be converted into normal test
```js
it('should throw session-expired exception', () => {
  return expect(async () => await new Session().generateId().bindUserFromRedis())
          .to.throw
             .and.that.have.property('errorName', 'session-expired')
})
```

[Mocha]: https://mochajs.org/
[Chai-As-Promised]: https://github.com/domenic/chai-as-promised
