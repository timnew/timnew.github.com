layout: post
title: Trello Confetti Effect
date: 2014-09-24T13:13:33.000Z
categories:
  - Programming
  - Web
tags:
  - trello
  - confetti
  - canvas
  - draw
  - animation
  - effect
  - particle
---

[Trello] just created a [page] to celebrate their user number reaches 5 million. In their celebration page, they introduce an interesting effect, a number of blue squares rotating and falling from the sky.

By inspecting their source code, I extracted the effect implementation from the page.

{% codepen timnew tlEBe 7928 result 500 %}

As you can see, the effect is implemented with Canvas animation. Trello guys created a light weight particle system.

* `ConfettiMachine` is the particle system controller, which takes the responsibility to create new particles and call `draw` method on them one by one.
* `Particle` is the representation of the blue square, it takes the rotation, fading out and rendering.

The source code is extracted for study purpose, all code and credits belongs to Trello guys.

[Trello]: https://trello.com
[page]: https://trello.com/5m
