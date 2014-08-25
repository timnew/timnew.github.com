layout: post
title: "Push Data Flow Model in C# 4.0"
tags:
  - "C#"
  - LINQ
  - push
  - Rx
  - reactive  
  - library
  - data flow  
  - FP
categories:
  - Programming
  - "C#"
comments: true
date: 2011-05-25 08:00:00
---
In the pre 4.0 era, there are two interfaces reveal a new world to .net world. The two hero are `IEnumerable<T>` and `IEnumerator<T>`.
Based on these two interfaces, .net introduced a lot of amazing staffs that dramatically simplified the development related to data flow, these well known features are: foreach loop, yield keyword, and LINQ.
These 2 interfaces provide an common abstraction layer for the operation that pull data from the data source. And with this abstraction, you can apply foreach loop to almost every kind of data source in the .net world.
`IEnumerable<T>` and `IEnumerator<T>` are cool, but they are somehow not so convenient to use in some cases, such as in asynchronous context or in obvious latency environment.
And the pull data flow model also has a capable brother, the push data flow, which can fill up the gap that pull model left for us.

So in .net 4.0, Microsoft introduce another 2 great interfaces, called `IObservable<T>` and `IObserver<T>`. These two interfaces, just as `IEnumerable<T>` and `IEnumerator<T>`, also open a door to the new world for every .net developer. With these 2 interfaces, people can setup a lot of features that corresponding to `IEnumerable<T>` and `IEnumerator<T>`.

Now Microsoft has a great library that called Rx(which stands for "Reactive Extension"), which provided a lot of features that similar to LINQ and more based on `IObserable<T>` and `IObserver<T>`.
