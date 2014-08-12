layout: post
title: Dynamically inflates UI in Android App
comments: true
categories: android
tags:
  - android
  - dynamic
  - ui
  - inflate
  - layout inflater
  - xml
  - runtime
  - on the fly
date: 2013-12-13 08:00:00
---
There is a fascinating idea that inflates UI according to an android layout xml downloaded from server. According to the Android API, it looks quite feasible.

One of `LayoutInflate.inflate` <a href="http://developer.android.com/reference/android/view/LayoutInflater.html#inflate(org.xmlpull.v1.XmlPullParser, android.view.ViewGroup)">method overloads</a> accept Layout Xml as `XmlPullParser`.

And `XmlPullParser` can wrap around an input stream, so as consequence, following code seems to be working:

{% codeblock Inflate view on the fly lang:java %}

public class DynamicView extends FrameLayout {

    public DynamicView(Context context, InputStream layoutData) throws XmlPullParserException {
        super(context);

        createView(context, layoutData);
    }

    private void createView(Context context, InputStream layoutData) throws XmlPullParserException {
        LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);

        XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
        factory.setNamespaceAware(true);
        XmlPullParser parser = factory.newPullParser();

        parser.setInput(layoutData, "UTF-8");

        inflater.inflate(parser, this, true);
    }
}

{% endcodeblock %}

The code looks great, compiling looks fine, but when the code excuted, an exception is thrown by the inflater. 

According to the LayoutInflater document, this approach won't work(at least for now, it won't).

{% blockquote LayoutInflater Document http://developer.android.com/reference/android/view/LayoutInflater.html developer.android.com %}

  For performance reasons, view inflation relies heavily on pre-processing of XML files that is done at build time. Therefore, it is not currently possible to use LayoutInflater with an XmlPullParser over a plain XML file at runtime.

{% endblockquote %}

Actually, Android compiler compiles the layout xml files into binary xml block, which has convert attributes into some special format. And in Android SDK, the `LayoutInflater` uses `XmlResourceParser` instead of plain `XmlPullParser`, which is created by `XmlBlock`.

`XmlBlock` is an internal class used in `Resources` to cache the binary xml document.

And there is no way to create XmlResourceParser or other classes to inject custom behavior into this process. Personally assume that it is pretty much related to the Android Resource and Theming mechanism, there are quite a number cross references between resources. To make it works in a efficient way, Android Runtime did a lot work, such as cache and pre-processing. To override this behavior require quite a number of work and need to aware of potential performance issue. Since the inflating could happen quite often during navigation.

As a not that fansy alternative, UI based on HTML hosted in WebView could be considered. 