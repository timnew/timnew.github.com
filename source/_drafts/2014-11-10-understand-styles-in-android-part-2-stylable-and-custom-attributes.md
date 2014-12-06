layout: post
title: Understand Styles in Android - Part 2. Styleable view and custom attributes
categories:
  - Programming
  - Android
tags:
  - styleable
  - custom attributes
  - android
  - style
date: 2014-11-10 00:27:22
---

* [Part 1: What it is for and how to used it]
* [Part 2: Styleable view and custom attributes]

- - - - - -

In Part 1, we discussed the basic use cases of Android Style. We mainly focused on how to "use" the style, but we haven't touched that how to make a view styleable. Actually create a stylable view isn't a very stright-forward process, and there are actually pitfall in it. I'll explain this later.

To explain how to make view stylable, I'll try to create a `Dot Pager Indicator`, which draw itself on `onDraw` callback according to `ViewPager` status. Here is how it looks:

{% asset_img DesktopPagerIndicator.png %}

For the indicator, there are a bunch of paramters that we need to specify:

* The interval between the dots
* The size of the dots
* The side of the active dot
* The color of the dots
* The color of the current active dot
* The background color of the view

To make the `DotPageIndicator` stylable, we need to specify what attributes that `DotPageIndicator` accepts. To do that, we need to declare the styleable:

```xml
<declare-styleable name="DotPageIndicator">
    <attr name="interval" format="dimension" />

    <attr name="radius" format="dimension" />
    <attr name="activeRadius" format="dimension" />

    <attr name="dotColor" format="color"/>
    <attr name="activeDotColor" format="color" />

    <attr name="android:background" />
</declare-styleable>
```

In the code, we declared a `stylable attribute group` called `DotPageIndicator`, it contains a bunch of attributes. Some of them are unique here, so we need to specify the `format` of the attribute, which will create a new `R.attr.???` resource in the system. Some of them are reused, such as `android:background`, so we don't need to and also cannot specify the `format` here.

```java
 public DotPageIndicator(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);

    if (isInEditMode()) return;

    TypedArray attributes = context.obtainStyledAttributes(attrs, R.styleable.DotPageIndicator, defStyle, 0);

    activeDotPaint.setStyle(FILL);
    activeDotPaint.setColor(attributes.getColor(R.styleable.DotPageIndicator_activeDotColor, defaultActiveDotColor));
    dotPaint.setStyle(FILL);
    dotPaint.setColor(attributes.getColor(R.styleable.DotPageIndicator_dotColor, defaultDotColor));

    radius = attributes.getDimension(R.styleable.DotPageIndicator_radius, defaultRadius);
    activeRadius = attributes.getDimension(R.styleable.DotPageIndicator_activeRadius, defaultActiveRadius);
    interval = attributes.getDimension(R.styleable.DotPageIndicator_interval, defaultInterval);

    Drawable background = attributes.getDrawable(R.styleable.DesktopPageIndicator_android_background);
    if (background != null) {
        //noinspection deprecation
        setBackgroundDrawable(background);
    }

    attributes.recycle();
}
```
* R.styleable is just a int[]
* Styleable is just for IDE hints, not necessary
* 


[Part 1: What it is for and how to used it]: /blog/2014/11/09/understand-styles-in-android-part-1-what-it-is-for-and-how-to-used-it/
[Part 2: Styleable view and custom attributes]: /blog/2014/11/10/understand-styles-in-android-part-2-stylable-and-custom-attributes/
