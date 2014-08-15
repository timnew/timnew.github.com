layout: post
title: Android Studio 0.6.1 SDK recognition issue when using Android SDK 19 and Gradle
comments: true
categories: android
tags:
  - android
  - android studio
  - sdk
  - gradle
  - android.jar
  - jar
date: 2014-06-20 08:00:00
---
A few days ago I upgraded my Android Studio to version 0.6.1. And migrated my android project build system from Maven to Gradle. Then nightmare happened!

{% asset_img android_studio_version.png Android Studio Version %}

It looks there are some issue with Android Studio version 0.6.1, which cannot recognize the jar files in Android SDK 19 (4.4 Kit Kat). As a consequence that all the Android fundemantal classes are not recognized properly, which makes IDEA almost impossible to be used.

{% asset_img classes_not_recognized.png Classes Not Recognized %}

After spending days on googling and trying, I realize the issue is caused that Android Studio doesn't recognize the sdk 19 content properly.

Here is the content of Android SDK 19 that Android Studio 0.6.1 identified:

{% asset_img sdk_in_android_studio.png SDK in Android Studio %}

As comparison, here is a list of proper content of Andrdoid SDK 19 with Google API:

{% asset_img sdk_in_idea.png SDK in IDEA %}

Here is a list of proper content of Andrdoid SDK 19 retrived from Maven Repository:

{% asset_img maven_sdk_in_idea.png Maven SDK %}

In the list, you can easily figure out that the `android.jar` file is missing! It is the reason why the classes are not properly recognized! Even more if you compare the list against the JDK 1.6, you will find that most of the content are the same.

{% asset_img jdk.png JDK %}

Ideally, to fix this issue should be quite easy. Android Studio provides a `Project Settings` dialog allow developer to adjust the SDK configurations.

Project Settings Dialog:

{% asset_img project_settings.png Project Settings %}

But for Gradle projects, Android Studio displays a greately simplified project settings dialog instead of the original one, which doesn't allow developer to config the SDK in dialog any longer.

Gradle Project Settings Dialog:

{% asset_img gradle_project_settings.png Project Settings  %}

Still now, I figured out several potentisal workarounds to this issue, hope these helps:

1. Downgrade the SDK version from 19 to 18 fixes the issue.  
  If you not really needs SDK 19 features, try to downgrade the SDK version to 18 to fix the issue.
2. Use IntelliJ instead of Android Studio  
  I encounters a different issue when using IDEA, it fails to sync the Gradle file.
3. Use Maven or ANT instead of Gradle  
  Gradle is powerful, but there are too many environment issues when using with IDEs... Maven is relatively more stable.

I haven't figure out a perfect solution to this issue, just hope the Google can fix the issue as soon as possible.
