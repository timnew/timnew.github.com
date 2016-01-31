layout: post
title: Typical EventBus Design Patterns
date: 2014-12-06 16:37:41
categories:
  - Programming
  - Design Patterns
tags:
  - Design Pattern
  - EventBus
  - Event
  - Command
  - Request
  - Android
  - Otto
  - Guava
---

`EventBus` is an special [Publish & Subscribe Pattern](`Pub & Sub`) implementation. `EventBus` enable message to be delivered between components without requiring the components to register itself to others.

Comparing `EventBus` to other `Pub & Sub` implementations, `EventBus` is:
1. Designed to replace the original event distribution system, which requires the components register itself to each other.
2. Not designed for general use, `EventBus` adds additional complexity and runtime overhead to the system. So it is not designed to replace normal method calls.
3. Not designed for inter-process communication as some other Pub&Sub.

## `EventBus` saves Android developers' life

When developing Android application, I strongly recommend developer to introduce an `EventBus` library. [EventBus] from `GreenRobot`, [Otto] from `Squqre` are good solutions. Or even to choose the original `EventBus` in [Guava] library from Google.

With `EventBus`, components can communicate with each other without need to hold direct reference of each other. This is very important to avoid app crashes when calling a method on a detached or destroyed component. Usually this kind of issue isn't that easy to handle due to Android's over-complicated life cycle management. So even in the worst case that one component is sending message to another component which has been destroyed (which should unregister itself from EventBus on that time), it only triggered a `norecipient waring` instead of crashing the app.

Also with `EventBus` as intermedia, you can avoid to exposing objects to root activity or application just for registering callbacks on each other. Components are higher cohesion & lower coupling.

As the result, `EventBus` saves tons of time to debugging crash, and make your code more readable, maintainble, extensible, and flexible.

## Abusing `EventBus` kills your app easily

"`EventBus` is awesome! It is so convenient, so let's replace everything with event"... This kind of saying is commonly heard from the developers who just realized the benefits from `EventBus`. Since `EventBus` is too convenient to use, they tends to replace everything with EventBus.

But we mentioned in the introduction of `EventBus` that `EventBus` is design to replace traditional event system in Java, and is not designed for general use. Abusing makes your code hard to understand, hard to debug. Long event chain is a common reason that cause of unexpected behavior.

## Broadcast Event, Command and Request

`EventBus` is powerful, but can be easily abused. To make a better use of EventBus, I learn a number of EventBus usages, and evaluated the scenario, and summarized out 3 typeical EventBus usage patterns: **Broadcast Event**, **Command** and **Request**.

### Broadcast Event

`Broadcast Event` is a special kind of event that used by a specific component to broadcast its status updated to other components.

#### Declaration

`Broadcast Event` should be used when several components cares about the specific component's status update. So usually `Broadcast Event` should have more than one recipients or, at least, potential recipients.

`Broadcast Event` should be an immutable data object, so:
1. It is immutable, so once it is created, its status should not changed, which guarantees the equality between recipients.
2. It is data object, so it should not has methods that might change other classes status.
3. It might have methods that helps its consumer to consume the data it contains.
4. It should be declared as a nested static class of publisher.

**NOTICE**  
If you thought a Event is "Broadcast Event", but later you found it has only one recipient, then you might need to consider refact it into a `Command` or a `Request`.

### Command

`Command` is a special kind of event that has the ability to update specific object or specific type of objects. In most cases, `Command` should have only one recipient. In some special cases, it might has a group of recipients with exactly same type.

Precisely, the latter case is a variant of `Command` pattern, `Batch Command`, which works as same as `Command` but have multiple recipients so it can update multiple instances in a batch.

`Command` should be a immutable object that able to update specific object, so:
1. It should have 1 `execute` method with 1 parameter, which represents the target that the command updates.
2. When invoking execute method shouldn't change its own status, so it does exactly same thing when applying it to multiple targets.
3. It behavior should be stable across time, so its behavior won't change when it is apply asynchronously.
4. The object that `execute` method accepts is not necessarily to be the recipient. It could be the object that recipient holds or it has access to.
5. It should be declared as nested static class of the recipient.
6. If recipient accepts multiple events, these events are recommended to derived from the same base class. So The recipient could subscribe to the base class, rather than every command.

**NOTICE**  
`Command` can be seen as recipient's special method that can be invoked without known recipient instance. So its behavior should fully contained in the class. The subscribing method on recipient should contain one line of code to invoke `execute` method on command.

### Request

`Request` is a special kind of event that has the ability to accept data from another object. If the request has multiple recipients, to avoid ambiguous behavior, there should be only one of `Request`'s respond the request.

But there is one exception, that is for the request collects data from multiple objects, multiple objects might respond to the request. This special kind of `Request` is called `Collector`.

`Request` should be a object that accept data from recipient, so:
1. It should have `respond` method with 1 parameter, which represents the data the request asks for.
2. Request should contains enough information for the recipients to determine whether to respond the request.
3. The recipients should check request's status to determine whether it should respond request.
4. The request can update the publisher directly in the `respond` method
5. It should be declared as nested class of publisher. If possible, also declare it as static, which will be helpful to simplify the tests.
6. Request might has methods to help recipient to determine whether to respond the request.

**NOTICE**  
`Request` can be seen as a special method that publisher exposes to a specific recipient, so the specific recipient can invoke the method to provide data. For `Request`, you might need to aware that that sometimes request might not found proper recipient to respond. If the responder is not guaranteed to exist, then the publish to watch out no-recipent warning from EventBus.

[Publish & Subscribe Pattern]: http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[EventBus]: https://github.com/greenrobot/EventBus
[Otto]: http://square.github.io/otto/
[Guava]: https://code.google.com/p/guava-libraries/
