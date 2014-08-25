layout: post
title: Asset path in Android Stuidio
comments: true
categories:
  - Programming
  - Android
tags:
  - android
  - assets
  - path
  - android studio
  - intellij
  - idea
  - gradle
  - build
  - resource
  - folder
date: 2013-12-13 08:00:00
---
According to [Android guideline document](https://developer.android.com/tools/projects/index.html#ApplicationProjects), the assets folder is created automatically and is positioned under the root of the project folder.  

So the assets folder should be located at `<project root>/assets`

But according to my experience, I found it is not true, or is partially true.

The path to assets folder varies according to the build system being used. So it could be very confusing and sometimes make things too complicated.

### ADT

For the very traditional ADT build system, then the assets folder is located at `<project root>/assets`

### Gradle

For new Gradle build system, it changed the project structure definition, which is slightly different to the ADT one.

Gradle build system requires the assets folder is part of the "source code" so the asset folder should located at `<project root>/src/main/assets/`.

For more detailed information, check out this [document](http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Project-Structure).

### Android Studio

In Android Studio (also apply to IntelliJ IDEA), things get a little bit more complicated. The assets path could be configured in project.

Android Studio store this path in project file (*.iml), which is an xml file. In the project file, under the XPath `/module/component@name="FacetManager"/facet@type="android"/configuration`, there could be a `<option>` node with name `ASSETS_FOLDER_RELATIVE_PATH` to descript the path.

{% codeblock lang:xml %}
	<option name="ASSETS_FOLDER_RELATIVE_PATH" value="/assets" />
{% endcodeblock %}

If the option element with specific name doesn't exist, please manully create it.

### Conclusion

* Using Eclipse + ADT, place the assets at `<project root>/assets`

* Using Android Studio (or IntelliJ) with Ant or Maven, place the assets at `<project root>/assets`. And set `ASSETS_FOLDER_RELATIVE_PATH` to `/assets`

* Using Android Studio with Gradle, place the assets at `<project root>/src/main/assets/`. And set `ASSETS_FOLDER_RELATIVE_PATH` to `/src/main/assets`. And invoke `mergeAssets` during build.
