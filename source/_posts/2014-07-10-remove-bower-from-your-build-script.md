---
layout: post
title: "Remove Bower from your build script"
description: ""
date: 2014-07-10 13:22
comments: true
categories: 
category: javascript 
tags: 
  - bower
  - build
  - pipeline
  - continues integration
  - environment
  - deployment
  - automation
sharing: true
footer: false
published: true
---

### The mysterious broken build

This morning, our QA told us that `knockout`, a javascript library that we used in our web app is missing on staging environment. Then we checked the package she got from CI server, and the javascript library was indeed not included. But when we tried to generate the package on our local dev box, we found that `knockout` is included. 

It is a big surprise to us, because we share the exact same build scripts and environment between dev-boxes and CI agents and because we manage the front-end dependencies with `bower`. In our `gulp` script, we ask `bower` to install the dependencies every time to make sure they are up to date.


### The root cause of the broken build

After spending hours on diagnosing the CI agents, we finally figure out the reason, a tricky story:

When the Knockout maintainer released the v3.1 bower package, they made a mistake in `bower.json` config file, which packaged the `spec` folder instead of the `dist` folder. So this package is actually broken, because the main javascript file `dist/knockout.js` , described in `bower.json` doesn't exist. 

Later, the engineers realized they made a mistake, and they fixed the issue by releasing a new package. Maybe they think they haven't changed any script logic, so **they release the new package under the same version number**, which is the criminal who broke our builds.

We're so unlucky that the broken package is downloaded on our CI server when our build script was executed there for the first time. And the broken package is stored in `bower` cache at that time.

Because of Bower's cache mechanism, the broken package is used unless the version is bumped or cache is expired. This is the reason why our build is broken on the CI server.

But on our dev box, for some reason, we had run `bower cache clean`, which invalidated the cache. So we have a good build on our local dev box. This is the reason why we can generate good package on our dev box.

It is a very tricky issue when using bower to manage dependencies. Although it is not completely our fault, but it is kind of the worst case then we can face. The build broke silently, there were no error logs or messages that helped to figure out the reason. (Well, we haven't got a chance to setup the smoke test for our app yet, so it could be kind of our fault.)

We thought we had been careful enough to clean the `bower_components` folder every time, but that prevented us from figuring out the real cause.

After fixing this issue, discussed with my pair Rafa and we came up some practices that could be helpful to avoid this kind of issue:

### Best practices

* Avoid `bower install` or any equivalent step (such as `gulp-bower`, `grunt-bower`, etc.) in the build script
* Check `bower_components` into the code repository or download the dependencies from our self managed repository for large projects.
* When dependencies are changed, manually install them and make sure they're good.

After doing this, our build script runs even faster, because we don't need to check all dependencies are up-to-date every time. This is a bonus from removing `bower install` from our build script.

### Some thoughts on the package system

Bower components are maintained by the community, and there is no strict quality control to ensure the package is bug-free or being released in an appropriate way. So it could be safer if we can check them manually, and lock them down across environments.

This could be common issue for all kind of community managed package system. Not just Bower, it could be Maven, Ruby Gem, Node.js package, Python pip package, nuget package or even Docker containers!
