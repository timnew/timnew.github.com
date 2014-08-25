layout: post
title: The problem introduced by making structure as a property
tags:
  - C#
  - WPF
  - XAML
  - .net
categories:
  - Programming
  - WPF
comments: true
date: 2010-03-05 08:00:00
---
I met a strange problem while I was evaluating the Xaml Services that introduced in .net 4.
I created 2 types for Xaml Serialization Test:

{% codeblock Model lang:csharp %}
public class Foo
{
    public Foo() { }
    public Foo(int a)
    {
        Random RND = new Random();
        Value = RND.Next();
        MyProperty = RND.Next();
        Complex.Init(); // Complex is value type, which is automatically instantiated by default constructor.
    }

    [Ambient]
    public int Value { get; private set; }

    [Ambient]
    public int MyProperty { get;  private set; }

    [Ambient]
    public Nested Complex;
}

public struct Nested
{
    public void Init()
    {
        this.Temp = Guid.NewGuid();
    }

    [Ambient]
    public Guid Temp { get; set; }
}
{% endcodeblock %}

So I can create a test instance of Foo by calling Foo(int a), e.g:

{% codeblock Instantiate Foo lang:csharp %}
Foo foo = new Foo(1);
{% endcodeblock %}

But since `Xaml` doesn't support serialize fields, I cannot apply AmbientAttribute to field, so the compilation fails. So I changed the field Complex of Class Foo to a property:

{% codeblock Change Field to Property lang:csharp %}
[Ambient]
// public Nested Complex;
public Nested Complex { get; set;}
{% endcodeblock %}

Then the code compiles correct. But when I executed the code, I found the Temp property of Complex is empty guid. But I found I do called the Init method in the constructor of Foo. What's the problem?

I believe that the problem must be special behavior related to ValueType. So I omitted to call Init(), I try to assign the Complex in Foo's Constructor as following code

{% codeblock Replace the initializer with assignment lang:csharp %}
//Complex.Init();
this.Complex.Temp = Guid.NewGuid();
{% endcodeblock %}

Compiles fails!  Visual Studio tells me "Cannot modify the return value of 'structTest.Foo.Complex' because it is not a variable"

Still now, everything is explainable:
1. It is because this.Complex is pointed to the variable itself  that Code Complex.Init() works when Complex is field.
2. It is because this.Complex is a return value, a copy of the original variable, instead of the original variable that the Code Complex.Init() doesn't work when Complex is a property. this.Complex.Init() do changed the value of the Temp, but it modified the new copy instead of the original one.

So we need to be careful while change a value type field into a property, which may modify the program behavior a lot, and really difficult to debug while the code is complicated.
