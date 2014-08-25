layout: post
title: Arduino IDE 1.5.3 is too buggy to use and work arounds
comments: true
categories:
  - Programming
  - Arduino
tags:
  - arduino
  - IDE
  - buggy
  - workaround
  - solution
  - compile
  - error
  - String
  - nano
date: 2013-10-27 08:00:00
---
The Arduino IDE 1.5.3 introduced some new features, such as support latest board Yun, or introduces new libraries and samples. But I found it is too buggy to use.

## 1. Compile code against Arduino Nano fails due to parameter `mcu` passed to `avrdude` is missing.

**Reason:**  
The issue seems caused because the new IDE merged the menu items for Nano board. But for some reason, the configuration haven't been updated accordingly.

**Workaround:**  
Choose `Arduino Duemilanove and Diecimila` instead of `Arduino Nano`. Nano uses same chip as Duemilanove(ATmega328) and Diecimila(ATmega168), but uses a different PCB design. So the binary should be compatible.

## 2. Compile `String(100, DEC)` throws `ambiguous matching` error

**Reason:**  
The issue is caused because the API signature updated to `String(*, unsigned char)`, but constants are still declared as `int`.

**Workaround:**  
Add force cast `DEC`, `HEX`, `BIN` to `byte` instead of `int`.
