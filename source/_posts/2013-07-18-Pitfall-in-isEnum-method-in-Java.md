layout: post
title: Pitfall in isEnum method in Java
comments: true
categories: Java
tags:
  - Java
  - Reflection
  - Enumeration
  - isEnum()
date: 2013-07-18 08:00:00
---
I found a very interesting phenomenon in Java type reflection when building an Android app. 
I'm trying to build a common mechanism to serialize Enum into integer when writing it into database. To make it more flexible so I fetch the value type dynamically by using reflection. So I have the following code to check whether the value to be written is an enumeration:

{% codeblock Code to check enumeration lang:java %}

CONVERTERS.add(new ValueConverter() {
    @Override
    public boolean match(Object value) {
        Class type = value.getType();
        return type.isEnum(); // Doesn't work
    }

    @Override
    public String convert(Object value) {
        return String.valueOf(((Enum) value).ordinal());
    }
});

{% endcodeblock %}

I built the converters into a `responsibility chain`. The converter is applied only when `match` method returns true.

In the converter, I check the type with `isEnum` method. I expects the method yields true when the value is a enumeration. But later I found it doesn't work as expected. And the behavior of this method is really confusing!

Here is how it works:

{% codeblock How isEnum works lang:java %}

public enum ServiceStatus {
  NOT_COVERED,
  PARTIAL,
  FULL
}

assertThat(ServiceStatus.class.isEnum()).isTrue();
assertThat(ServiceStatus.FULL.class.isEnum()).isFalse();
assertThat(ServiceStatus.FULL.getType().isEnum()).isFalse();

{% endcodeblock %}

Due to the implementation of Java Enumeration, the definition of enumeration value could be understood as the following code:

{% codeblock Java Enumeration psudo-code lang:java %}

class ServiceStatus$2 extends ServiceStatus {
}

public static final ServiceStatus FULL = new ServiceStatus$2();

{% endcodeblock %}

So the value `FULL` has a different type than `ServiceStatus` as I expected, the type of `FULL` is actually a subclass of `ServiceStatus`. And the enumeration value `FULL` is a singleton instance of the anonymous sub-class.

The the most unexpected behavior is that the `isEnum` method only returns true on Enumeration class itself, not its subclass!

To resolve this issue gracefully, I changed my implementation a little bit. Here is the updated implementation:

{% codeblock Updated implementation lang:java %}

CONVERTERS.add(new ValueConverter() {
    @Override
    public boolean match(Object value) {
        Class type = value.getType();
        return Enum.class.isAssignableFrom(type);
    }

    @Override
    public String convert(Object value) {
        return String.valueOf(((Enum) value).ordinal());
    }
});

{% endcodeblock %}

I uses `isAssignableFrom` to check whether value is the subclass of Enum or could be casted into Enum. I found this approach solved the issue gracefully.