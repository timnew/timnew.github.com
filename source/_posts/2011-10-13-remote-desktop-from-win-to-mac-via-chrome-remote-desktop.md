---
layout: post
title: "Remote Desktop from Win to Mac via Chrome Remote Desktop"
description: ""
category: GeekToy
tags: ["Chrome", "Remote Desktop", "Google"]
languages: 
---

Google Chrome Remote Desktop Extension is really amazing!!!!!
I try to install the extension on both Chrome on my iMac and the one on my laptop with Win 7.
Then I try to connect the iMac from Win 7 via Chrome Remote Desktop!
The performance is really amazing!!!! It is less well than Windows RDP but much better than the famous but sucks VNC!!!!!
I totally have no idea how Google implemented this! But it do works super well in my environment!

![Control Mac](Chrome-Remote-Desktop-Control-Mac.png "Chrome Remote Desktop to Mac")

You know, before Chrome Remote Desktop, there is only one real cross platform remote desktop solution: VNC, and the performance of which is unacceptable poor, and we have to install a lot of ugly software to make it happen.
 But now, we can achieve it by simply install chrome and the chrome extension....
It is amazing!

I found the desktop fade in animation works smoothly via remote desktop! And I can even play movie from Mac!!!!!

![Play Movie](Chrome-Remote-Desktop-Play-Video.png "Play Movie on Mac via Chrome Remote Desktop")

While playing video, the peak of the network traffic might be reach 800kBps to 1MBps... but normally it should be 300 kBps.....

But since it is only the beta version, so there are some limitations in Chrome Remote Desktop:
1. The Hotkey doesn't work well, which means you cannot Press Cmd+Space to pop up quick-silver or spot-light...
2. Mouse Wheel doesn't work well, which means you cannot scroll the page with your mouse wheel, or magic mouse.
3. Sound doesn't bring to remote side, if you wanna play movie with Chrome Remote Desktop, then you might be have to read the subtitle rather than hear the speech.
4. CPU consuming is high, I guess Chrome Remote Desktop spend a lot of CPU power on compressing the data to be transferred, so the CPU consuming is higher than other Remote Desktop solution......

And special Precondition required for Chinese Netizens:
If you are try to use Chrome Remote Desktop in China, this miracle land, you might need some other special technology tool to help you get rid of the famous GFW. To my experience, sometimes Remote Desktop OAuth might be blocked by GFW. 
