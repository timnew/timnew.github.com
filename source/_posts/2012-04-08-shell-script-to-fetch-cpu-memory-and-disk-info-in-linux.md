layout: post
title: "Shell Script to fetch CPU, Memory and Disk Info in Linux"
tags:
  - bash
  - hardware
  - cpu
  - disk
  - memory
categories:
  - Practice
  - DevOps
comments: true
date: 2012-04-08 08:00:00
---
This is a script to populate computer hardware configuration in Linux.

{% codeblock Script to populate CPU, Memory and Disk Info lang:bash %}
#!/bin/bash
# CPU
cat /proc/cpuinfo |  grep -e "model name" -e "cores" -m 2 && cat /proc/cpuinfo | grep -e "physical id"| sort  | uniq -c

# Memory
free -got

# Disk
df -lh -t ext4 --total
{% endcodeblock %}
