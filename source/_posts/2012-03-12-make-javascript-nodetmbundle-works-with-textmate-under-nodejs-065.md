---
layout: post
title: "Make javascript node.tmbundle works with TextMate under node.js 0.6.5"
description: ""
category: textmate
tags: ["node.js", "bundle", "textmate", "javascript", 'tmbundle']
languages:
---

I downloaded the [TextMate bundle for node.js](https://github.com/drnic/javascript-node.tmbundle).  
But this bundle doesn't work properly.  
When i clicked cmd+R to run javascript, it reports that it cannot get variable "TM_FILE" from undefined.  
And the console output contains a warning that module "sys" is renmaed as "util".

To fix this two issues:  
Some fix these 2 issues, some modification to command script is needed:  

1. Open Command Editor in TextMate, and edit the command script of "Run File or Spec" under "JavaScript Node" category:
2. Change `var sys = require("sys");` to `var sys = require("util");` to fix the warning.
3. Replace all instances of "process.ENV." with "process.env."

After modification, close the Bundle Editor. Then ask TextMate to reload all the bundles.  
Then the command will work perfectly now.

- - -

There is another Trick, since there had been a bundle called javascript in TextMate. So this node js bundle doesn't activated when you editing .js file.  
You need to press ctrl + alt + n to activate the bundle manually.

This problem can be fixed by changing scope selector of all the snippets and commands. You can change it from "source.js.node" to "source.js"
