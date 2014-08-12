layout: post
title: Is Android API document on ConsumerIrManager lying?
comments: true
categories: android
tags:
  - android
  - infrared
  - api
  - document
  - Samsung
  - lying
  - error
  - kit kat
date: 2014-05-28 08:00:00
---
Just found a shocking fact that Android API document on `ConsumerIrManger.transmit` method is wrong!

KitKat has realised its own Infrared blaster API, which is incompatible with legacy Samsung private API. So I was working on [Android Infrared Library](https://github.com/timnew/AndroidInfrared) to make it adapted automatically on both Samsung private API and `Kit Kat`official API. 

After I finished the coding according the document, I found the app broke on my Galaxy Note 3 with `Kit Kat`. It works perfect when running on `Jelly Bean`.

And I figured out an issue that it takes longer time to transmit the same seqeunce when I upgraded API. ( When IR blaster is working, the LED indicator on the phone turns blue. And I found the time of indicator turning blue is significant longer than before. ) And my [IRRecorder](https://github.com/timnew/IRRecorder) cannot recognize the sequence sent by my phone any longer.

After spent several hours, I figured out the reason. The pattern was encoded in a wrong way. But I'm pretty sure that I strictly followed the API document. 

So I get a conculusion that **the `ConsumerIrManager` implementation on Samsung Note 3 is different to what described in Android API document.** However I'm not sure the reason is that the Android document is lying or Samsung implemented the driver in a wrong way.

Here is the technical details of the issue and its solution:

IR Command is trasmitted by turnning the IR blaster LED on and off for a certain period of time. So each IR command can be represented by a series of time periods, which indicates how long the led is on or off. The difference between Samsung API and Kit Kat APi is that how the time is mesured.

{% blockquote "ConsumerIrManager.transmit(int carrierFrequency, int[] pattern)" https://developer.android.com/reference/android/hardware/ConsumerIrManager.html#transmit(int,%20int[]) "Android Developer Reference" %}

<strong>carrierFrequency</strong> The IR carrier frequency in Hertz.
<strong>pattern</strong> The alternating on/off pattern in microseconds to transmit.

{% endblockquote %}

According to the [Android Developer Refernece](https://developer.android.com/reference/android/hardware/ConsumerIrManager.html#transmit(int,%20int[])), the time in KitKat is measured in the unit of microseconds. 

But for Samsung, the time is mesured by the number of cycles. Take NEC encoding as example, the frequency is 38kHz. So the cycle time `T ~= 26us`. BIT_MARK is `21 cycles`, the period of time is around `26us x 21 ~= 546us`.

So ideally, regardless of lead-in and lead-out sequence, to send the code `0xA` in NEC encoding, Samsung API needs `21 60 21 21 21 60 21 21`; and Kit Kat API needs `560 1600 560 560 560 1600 560 560`.

But accroding to my experience, the Android Developer Reference is wrong. **Even in KitKat, the time sequence is also measure by number of cycles instead of the number of microseconds!**

So to fix the issue, you need some mathmatical work. Here is the conversion formula:

{% codeblock %}
  n = t / T = t * f / 1000

  n: the number of cycles
  t: the time in microseconds
  T: the cycle time in microseconds
  f: the transmitting frequency in Hertz
  
{% endcodeblock %}
