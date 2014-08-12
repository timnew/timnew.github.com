---
layout: post
title: "一个关于Inheritance和Delegate的故事"
description: ""
category: Misc
tags: ["Inheritance", "Delegate", "Cocoa", "History"]
languages:
---


Cocoa Programming for Mac OS X 里看到这么一段话～挺有意思的～～～

> Once upon a time, there was a company called Taligent, which was created by IBM and Apple to develop a set of tools and libraries like Cocoa. About the time Taligent reached the peak of its mindshare, I met one of its engineers at a trade show. I asked him to create a  simple application for me: A window would appear with a button, and when the button was clicked, the words "Hello, World!" would appear in a text field. The engineer created a project and started subclassing madly: subclassing the window and the button and the event handler. Then he started generating code: dozens of lines to get the button and the text field onto the window. After 45 minutes, I had to leave. The app still did not work. That day, I knew that the company was doomed. A couple of years later, Taligent quietly closed its doors forever.

可以想象，这个故事一定发生在OO刚刚起步的年代～那个年代几乎把 inheritance 当作所有问题的 Killer Pill～随着技术的演化，在无数的 Developer 对着一堆堆让人眼花缭乱的继承树（特别是像C++这样具有多继承能力的预言的继承树）浪费的无数的 Working Hour，杀死了无数自己的脑细胞后，人们终于开始意识到或许应该有一种比 Inheritance 更好的方式去处理某些问题～ 于是有了 Composition 有了 Delegate～～～甚至把继承深度作为了代码可维护性的一个重要指标！

看新的预言中～C# 和 Java 拿掉了多继承～ 在产生变种对象的时候，Java 是采用 Handler 的新类，其实就是 Delegate 的方式～ C# 对于比较重量级的对象（比如 Form，Window，Page）依然采用 Inheritance ，但是对于轻量级的对象（Button，TextBox，MIenutem）时则采用更为灵活的方法级别的Delegate～
C#的方式和 Cocoa 比较类似。
Cocoa 中，由于界面采用溜达MVC模式～需要大量定制的对象，比如Window，View，会采用继承重载的方式。需要改变行为时一般会 Controller，而要改变Visual时，通常会重载Visual Element对象本身～ 而轻量级的定制，或者仅仅是响应某些交互的话，则会采用Delegate的方式～比如Application的Delegate～～

Vision只有一个，但是Implementation会有很多～而对比不同语言对同一个问题的处理方式是一件非常有意思的事情～在这种对比中～才能发现不同的设计模式和实现模式的优劣～～～和在现实中的实用效果～～～～
