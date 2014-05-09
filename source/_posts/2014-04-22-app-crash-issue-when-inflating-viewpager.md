---
layout: post
title: "App crash issue when inflating ViewPager"
description: ""
date: 2014-04-22 22:32
comments: true
categories: 
category: android
tags: 
  - android
  - view pager
  - crash
  - inflator  
sharing: true
footer: false
published: true
---

I wrote a very simple layout file with a `ViewPager`, but the app crashes when inflating it.

{% codeblock Layout file lang:xml %}
<?xml version="1.0" encoding="utf-8"?>

<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ViewPager
        android:id="@+id/view_pager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</FrameLayout>
{% endcodeblock %}

Here is the error message:

{% codeblock %}
04-22 22:27:00.828    1128-1479/com.github.timnew.rubiktimer E/AndroidRuntime﹕ FATAL EXCEPTION: main
    Process: com.github.timnew.rubiktimer, PID: 1128
    java.lang.RuntimeException: Unable to start activity ComponentInfo{com.github.timnew.rubiktimer/com.github.timnew.rubiktimer.history.HistoryActivity_}: android.view.InflateException: Binary XML file line #7: Error inflating class ViewPager
            at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2282)
            at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2340)
            at android.app.ActivityThread.access$800(ActivityThread.java:157)
            at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1247)
            at android.os.Handler.dispatchMessage(Handler.java:102)
            at android.os.Looper.loop(Looper.java:157)
            at android.app.ActivityThread.main(ActivityThread.java:5293)
            at java.lang.reflect.Method.invokeNative(Native Method)
            at java.lang.reflect.Method.invoke(Method.java:515)
            at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1265)
            at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1081)
            at dalvik.system.NativeStart.main(Native Method)
     Caused by: android.view.InflateException: Binary XML file line #7: Error inflating class ViewPager
            at android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:713)
            at android.view.LayoutInflater.rInflate(LayoutInflater.java:761)
            at android.view.LayoutInflater.inflate(LayoutInflater.java:498)
            at android.view.LayoutInflater.inflate(LayoutInflater.java:398)
            at android.view.LayoutInflater.inflate(LayoutInflater.java:354)
            at com.android.internal.policy.impl.PhoneWindow.setContentView(PhoneWindow.java:340)
            at com.actionbarsherlock.internal.ActionBarSherlockNative.setContentView(ActionBarSherlockNative.java:134)
            at com.actionbarsherlock.app.SherlockFragmentActivity.setContentView(SherlockFragmentActivity.java:262)
            at com.github.timnew.rubiktimer.history.HistoryActivity_.setContentView(HistoryActivity_.java from OutputFileObject:44)
            at com.github.timnew.rubiktimer.history.HistoryActivity_.onCreate(HistoryActivity_.java from OutputFileObject:34)
            at android.app.Activity.performCreate(Activity.java:5389)
            at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1105)
            at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2246)
            at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2340)
            at android.app.ActivityThread.access$800(ActivityThread.java:157)
            at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1247)
            at android.os.Handler.dispatchMessage(Handler.java:102)
            at android.os.Looper.loop(Looper.java:157)
            at android.app.ActivityThread.main(ActivityThread.java:5293)
            at java.lang.reflect.Method.invokeNative(Native Method)
            at java.lang.reflect.Method.invoke(Method.java:515)
            at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1265)
            at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1081)
            at dalvik.system.NativeStart.main(Native Method)
     Caused by: java.lang.ClassNotFoundException: Didn't find class "android.view.ViewPager" on path: DexPathList[[zip file "/data/app/com.github.timnew.rubiktimer-76.apk"],nativeLibraryDirectories=[/data/app-lib/com.github.timnew.rubiktimer-76, /vendor/lib, /system/lib]]
            at dalvik.system.BaseDexClassLoader.findClass(BaseDexClassLoader.java:67)
            at java.lang.ClassLoader.loadClass(ClassLoader.java:497)
            at java.lang.ClassLoader.loadClass(ClassLoader.java:457)
            at android.view.LayoutInflater.createView(LayoutInflater.java:565)
            at android.view.LayoutInflater.onCreateView(LayoutInflater.java:658)
            at com.android.internal.policy.impl.PhoneLayoutInflater.onCreateView(PhoneLayoutInflater.java:66)
            at android.view.LayoutInflater.onCreateView(LayoutInflater.java:675)
            at android.view.LayoutInflater.createViewFromTag(LayoutInflater.java:700)
            at android.view.LayoutInflater.rInflate(LayoutInflater.java:761)
            at android.view.LayoutInflater.inflate(LayoutInflater.java:498)
            at android.view.LayoutInflater.inflate(LayoutInflater.java:398)
            at android.view.LayoutInflater.inflate(LayoutInflater.java:354)
            at com.android.internal.policy.impl.PhoneWindow.setContentView(PhoneWindow.java:340)
            at com.actionbarsherlock.internal.ActionBarSherlockNative.setContentView(ActionBarSherlockNative.java:134)
            at com.actionbarsherlock.app.SherlockFragmentActivity.setContentView(SherlockFragmentActivity.java:262)
            at com.github.timnew.rubiktimer.history.HistoryActivity_.setContentView(HistoryActivity_.java from OutputFileObject:44)
            at com.github.timnew.rubiktimer.history.HistoryActivity_.onCreate(HistoryActivity_.java from OutputFileObject:34)
            at android.app.Activity.performCreate(Activity.java:5389)
            at android.app.Instrumentation.callActivityOnCreate(Instrumentation.java:1105)
            at android.app.ActivityThread.performLaunchActivity(ActivityThread.java:2246)
            at android.app.ActivityThread.handleLaunchActivity(ActivityThread.java:2340)
            at android.app.ActivityThread.access$800(ActivityThread.java:157)
            at android.app.ActivityThread$H.handleMessage(ActivityThread.java:1247)
            at android.os.Handler.dispatchMessage(Handler.java:102)
            at android.os.Looper.loop(Looper.java:157)
            at android.app.ActivityThread.main(ActivityThread.java:5293)
            at java.lang.reflect.Method.invokeNative(Native Method)
            at java.lang.reflect.Method.invoke(Method.java:515)
            at com.android.internal.os.ZygoteInit$MethodAndArgsCaller.run(ZygoteInit.java:1265)
            at com.android.internal.os.ZygoteInit.main(ZygoteInit.java:1081)
            at dalvik.system.NativeStart.main(Native Method)

{% endcodeblock%}

According to the message, we can figure out that the issue is caused because Android cannot found the class `android.view.ViewPager`. 

If we're careful enough, we can figure out that there is something wrong with the `ViewPager` fullname. Since `ViewPager` isn't a standard widget, so it is provided in Support Library instead in the core SDK. So it is not in the package of `android.view`, it is in the pacakge `android.support.v4.view`. 

To fix the issue, we should not reference the `ViewPager` with plain name but with the full name `android.support.v4.view.ViewPager`.

So this is the updated layout xml:

{% codeblock Fixed Lyaout lang:xml %}
<?xml version="1.0" encoding="utf-8"?>

<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <android.support.v4.view.ViewPager
        android:id="@+id/view_pager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</FrameLayout>
{% endcodeblock %}
