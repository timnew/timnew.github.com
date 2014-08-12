layout: post
title: Reuse Android built-in Bluetooth Device Picker
comments: true
categories: android
tags:
  - android
  - bluetooth
  - device
  - picker
  - built-in
  - activity
  - reuse
  - system
date: 2013-12-11 08:00:00
---
Most Android devices support Bluetooth, and most Android ROMs has built-in bluetooth device picker, which is available to other system apps to select a bluetooth device. Theoretically the Bluetooth Device Picker could be reuse in any apps. But for some reasons, the API is not documented, and not published to everyone.

But it is possible to reuse such resources, so I wrote the following code. But due to the using of undocumented API, so it is not garenteed to work on all android devices.

[Code is available as Gist](https://gist.github.com/timnew/7908603)

{% gist 7908603 %}

In the code I uses the [Android Annotations](https://github.com/excilys/androidannotations), but it should be easy to remove the dependency on `Android Annotations` by adding a constructor to BluetoothDeviceManager that accepts `Context`.