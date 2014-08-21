layout: post
title: "TDD vs Natural Selection : Part II"
tags:
  - TDD
  - design
  - methodology
categories:
  - Thinking
comments: true
date: 2011-09-16 08:00:00
---
As discussed in [previous part](/Thinking/2011/09/14/tdd-vs-natural-selection/), both TDD and natural selection can produce suitable designs. But there are costs.
The design from natural selection is just perfect, but the cost is 99% unsuitable species die out. It is the cost of life.
Same to TDD, except TDD isn't so cruel. If you try to write a piece of code in TDD and pure factoring way, which means all the designs are in order to eliminate smell. And you might find that to eliminate the smell sometime is not so easy that you can have it done in minutes. You might need several tries to find out the most proper approach, since you might find that you just introduced a new, and maybe more serious smell while you eliminating a smell. Sometimes you might find that the upcoming new smells just drive into a dead road, and you just want revert the changes and retry from a fresh start. In worst case, you might find you can hardly find the right way, and you just got lost in the code.
In some simple project, you might find the situation is just acceptable, but in some complex project, you can hardly do that or you might find at the  end of the day you and your pair produced nothing with great effort.

So in my opinion, TDD doesn't mean no design at all. When you practicing TDD, you must focus on the detailed code. At this time if you can easily got lost without the guide from a clear, more general, high level vision. It just works like the architecture design or general solution to specific type of problem.

Such design can save you tons of time wasted on times of retries.
