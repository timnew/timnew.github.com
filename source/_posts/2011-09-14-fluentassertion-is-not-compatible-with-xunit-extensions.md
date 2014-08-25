layout: post
title: FluentAssertion is not compatible with xUnit.Extensions
tags:
  - fluent assertion
  - compatibility
  - xUnit
  - extension
  - Should.Fluent
  - ShouldIt
  - unit test
  - test
  - library
categories:
  - Programming
  - "C#"
comments: true
date: 2011-09-14 08:00:00
---
I met a weird problem that I found the Resharper Test Runner hangs when I introduced theory test case in my unit test.
After some spikes, I found the problem seems caused by the incompatibility between [Fluent Assertion] and [xUnit.Extension].
It is wired, and there seems to be no quick fix.
So I replace the Fluent Assertion with Should and [Should.Fluent], which is a port of [ShouldIt].
After that, everything goes well except the syntax between Fluent Assertion and Should Fluent are not compatible with each other, although they're really similar.
But Should.Fluent doesn't support `something.Should.Be()`, it requires `something.Should.Be.Equals()`, which is really annoying to me.

According to the Fluent's introduction, Fluent is a direct fork of xUnit. And I'm not sure what's the impact caused by this.

[Fluent Assertion]: http://fluentassertions.codeplex.com/
[xUnit.Extension]: http://xunit.codeplex.com/
[Should.Fluent]: http://should.codeplex.com/
[ShouldIt]: http://code.google.com/p/shouldit/
