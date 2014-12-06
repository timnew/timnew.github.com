layout: post
title: Understand Styles in Android - Part 1. What it is for and how to used it
date: 2014-11-09T13:44:29.000Z
categories:
  - Programming
  - Android
tags:
  - android
  - style
  - xml
  - understanding
  - view
---

* [Part 1: What it is for and how to used it]

- - - - - -

In android, view hierarchy usually are created via `layout` xml file. In the file, to instantiate a `TextView` we write:

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Sample 1" />
```

Usually, we need to specify the visual of the `TextView`, so we keep adding attributes to the `TextView` element:

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Sample 1"
    android:background="@drawable/category_indicator_background"
    android:gravity="center"
    android:maxLines="1"
    android:paddingBottom="12dp"
    android:paddingLeft="22dp"
    android:paddingRight="22dp"
    android:paddingTop="12dp"
    android:textSize="12sp" />
```
Usually to fully customize visual representation of a view needs a lot of attributes and resources. Such as in this example. we added `background`, `gravity`, `maxLines`, `padding` and `textSize`, which is a lot of code.

And if we want to create another `TextView` with exactly same visual representation, we need to copy all the values again:

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Sample 1"
    android:background="@drawable/category_indicator_background"
    android:gravity="center"
    android:maxLines="1"
    android:paddingBottom="12dp"
    android:paddingLeft="22dp"
    android:paddingRight="22dp"
    android:paddingTop="12dp"
    android:textSize="12sp" />

<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Sample 2"
    android:background="@drawable/category_indicator_background"
    android:gravity="center"
    android:maxLines="1"
    android:paddingBottom="12dp"
    android:paddingLeft="22dp"
    android:paddingRight="22dp"
    android:paddingTop="12dp"
    android:textSize="12sp" />
```

Obviously, in this piece of code, there are a lot of duplications. We need to compare all the values to figure out the 2 `TextViews` have the same visual. If we want to change the style, we need to update 2 TextViews. And the last, if we want to create the 3rd `TextView` or even more ones, we need copy the code again and again, which makes the issue become more troublsome.

In a short word, the code has bad readability, bad maintainability, bad reusability. In the book `Refactor`, we know that code redundancy is bad smell. To mitigate the issue, we need to extract the shared code into another "unit", and replace all the occurrences with the reference.

In Android layout xml, the extract "unit", which represents the shared attributes, are called `Style`. After introduced `Style`, we have:

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Sample 1"
    style="@style/TextView.Customized"/>

<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Sample 2"
    style="@style/TextView.Customized"/>
```
```xml
<resources>
    <style name="TextView.Customized">
        <item name="android:gravity">center</item>
        <item name="android:background">@drawable/category_indicator_background</item>
        <item name="android:paddingLeft">22dp</item>
        <item name="android:paddingRight">22dp</item>
        <item name="android:paddingTop">12dp</item>
        <item name="android:paddingBottom">12dp</item>
        <item name="android:textAppearance">@style/CategoryIndicator.Text</item>
        <item name="android:textSize">12sp</item>
        <item name="android:maxLines">1</item>
    </style>
</resources>
```

Well, this is the basics about the `Style`: why we need it and how it is used.

[Part 1: What it is for and how to used it]: /blog/2014/11/09/understand-styles-in-android-part-1-what-it-is-for-and-how-to-used-it/
