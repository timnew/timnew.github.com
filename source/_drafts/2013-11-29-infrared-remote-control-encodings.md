---
layout: post
title: "Infrared Remote Control Encodings"
description: ""
date: 2013-11-29 23:04
comments: true
categories: 
category: Infrared
tags: 
  - Infrared
  - Encoding
  - Remote Control
  - Pronto
  - IRremote
  - Samsung
  - Note 3
sharing: true
footer: false
published: false
---

New Samsung Galaxy phone equips an Infrared(IR) blast LED, which could be used to build universal remote control. 
But besides IR blast LED, it doesn't equipt any IR sensor. So I built my IR sensor with an Arduino board.

On Arduino board, I uses the [IRremote](https://github.com/shirriff/Arduino-IRremote) library for IR encoding and decoding. The library provides a raw encoidng to encode any IR commands in an universal way. It mesures the on and off time length of the IR command, in the unit of millisecond. e.g. `800 200 800 200 300 200 300 200` means turn on the LED for 800ms, turn off for 200ms, then turn on 800ms, then turn off 200ms...

So ideally, we can record any IR command in this kind of encoding.

In Galaxy phone, the IR blast LED driver is provided as a system service. It accepts a series of 


