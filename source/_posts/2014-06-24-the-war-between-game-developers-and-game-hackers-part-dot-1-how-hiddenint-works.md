---
layout: post
title: "The war between Game developers and Game Hackers - Part.1 How HiddenInt works"
description: ""
date: 2014-06-24 11:24
comments: true
categories: 
category: game hack
tags: 
  - Oxeye
  - Harvest
  - Massive Encounter
  - HiddenInt
  - Game
  - Crack
  - Cheat
  - Cheat Engine
  - Bit Slicer
  - Memory Editing
  - Debugger
sharing: true
footer: false
published: true
---

`Harvest: Massive Encounter` is a very unique strategic tower defense game published by [Oxeye Game Studio](http://www.oxeyegames.com/harvest-massive-encounter/). The game is amazing, but I won't focus on that. I will discuss something interesting I discovered when hacking the game.

By hacking the game, I want to lock down the the number of Mineral that I have in the game. Mineral is the only key resource in the game, which is used to build or upgrade structures. Theoretically locking down a value is easy. Scan the memory for specific number for a few times to filter out the list of potential memory addresses. Then try them one by one. And finally figure out the proper address, then locked it down with the game hacking tool. Very standard approach, and supported by most of the game hacking tool.

But in Harvest, the story is quite different. By searching the mineral value, we can locate a specific address. But we can easily find that the value is only used for display instead of real game state data. In fact, Harvest uses a quite unique approach to protect its game status data! Oxeye guys call it the `Hidden Int`.

Here is the psudo-code explains how the it works:

{% codeblock HiddenInt Psudo implementation lang:csharp %}

class HiddenInt {
  
  private int mask;
  private int hashedValue;
  private Random maskGenerator;

  public HiddenInt(int initialValue) {
    maskGenerator = new Random();
    setValue(initialValue);
  }

  public void setValue(int value) {
    this.mask = maskGenerator.next();
    this.hashedValue = value ^ this.mask; // ^ is xor operator.
  }

  public int getValue() {
    int value = this.hashedValue ^ this.mask;
    setValue(value); // Generate a new mask and hashed value every time when the value is read.
    return value;
  }

  public int modifyValue(int difference) {
    int value = getValue();
    value += difference;
    setValue(value);
    return value;
  }

  public ~HiddenInt() { // Destructor
    delete maskGenerator;
  }
}

{% endcodeblock %}

So from the code, you can see, the plain value is never got stored in memory. Instead, it stored a "hashed" value, which is the plain value xor a random generated mask. And every time, when either the value being read or written, the mask changes. This kills the almost all kind of memory scanning features in all kind of game hacking tool! You cannot find the plain value in the memory, so you have to use "fuzzy scan", which detects the values changes instead of scanning specific value. Again, the data in memory keeps changing even when the value doesn't (I'll explain why it happens later), so "fuzzy scan" doesn't work either here!! That's a master kill!

Besides of keeping mask changing, it also keeps reading the value out and writing it back, which kills most game editing tool "value frozen" feature! Unless you can ensure you freeze the `mask` and `hashed value` at the same time, or it breaks the value! Since the reading and writing happen in a very high frequency (Again I'll explain why it happens later), so you have to lock down the value at a specific point, or the locked value will be overwritten immediately. 

Furthermore, since this value is the key game value, which is displayed on Game UI all the time, the `getValue()` is called every time when game UI renders! And usually game UI renders in at least 60fps. So the value is read 60 times per second, and the mask changes 60 times per second! (This is why the value keep changing in a high frequency!) 

So this is the almost invincible way to keep key game state data safe from common game hacking tools!

In the next post, I'll explain how to find out a bypass to this security mechanism!

