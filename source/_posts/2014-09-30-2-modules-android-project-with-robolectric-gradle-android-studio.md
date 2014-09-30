layout: post
title: "2 Modules Android project with Robolectric, Gradle, Android Studio"
date: 2014-09-30 13:00:58
categories:
  - Programming
  - Android
tags:
  - Project
  - Boilerplate
  - Robolectric
  - Gradle
  - Android Studio
  - Unit Test
  - Structure
  - Android
---

Start a new Android project this week, so I started to setup the development environment. To be honest, it is not an easy experience to me.

## Features

Here are the features I got now:

* Unit test with Robolectric. (Very fundamental requirement)
* Unit tests are separated into an independent module. (Provide flexibility when project growing larger. And provide a more clear view of code organization)
* Running unit tests recognized by Android Studio/IntelliJ unit test plugin and debug UTs in IDE. (This is very important when diagnose failure UT)
* Running unit tests via CLI with `gradle wrapper`. (This is necessary requirement for CI servers)
* Using resources in Robolectric test. (Avoid `Resource Not Found` exception in unit tests)
* Test Android Annotation powered async implementation. (AA introduces new Async implementation, which is not supported by Robolectric by default)
* AssertJ core support. (Fest has been deprecated since no one is maintain it now.)

## Versions

The major difficulties that I met are version compatibility, I almost tried all available version combinations to make them all works. Here are the versions that I uses

* Gradle: 2.1
* Groovy: 2.3.6
* Ant: 1.9.3
* JVM: 1.6.0_65 (Apple Inc. 20.65-b04-462)
* OS: Mac OS X 10.9.5 x86_64
* Android Studio: 0.8.11 (build AI-135.1446794)
* IntelliJ: IDEA 14 CE EAP, build IC-138.2458.8
* Android gradle plugin: com.android.tools.build:gradle:0.13.0
* Android ADT gradle plugin: com.neenbedankt.gradle.plugins:android-apt:1.4+
* Compile SDK version: 20
* Build tool version: 20.0.0
* Robolectric: 2.3

# Known Issues

My current solution isn't perfect. But for now, I haven't working solution for them. Hope it could be fixed in the future

* `AAR` is not supported in Unit Test. (A tricky issue, I'll explain more in detail later)
* [AssertJ-Android] is not supported. (Cause by AAR support issue, alternative available.)

## Project Structure and configurations

Here are the project structure:
```
RootProject
|- settings.gradle
|- build.gradle
|- Launcher
   \- builde.gradle
\- UnitTest
   |- build.gradle
   \- UnitTest.iml
```

Here are the contents

```gradle \Settings.gradle
include ':Launcher', ':UnitTest'
```

```gradle \build.gradle
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:0.13.0'
    }
}

allprojects {
    repositories {
        mavenLocal()
        mavenCentral()
    }
}
```

```gradle \Launcher\build.gradle
buildscript {
    repositories {
        mavenCentral()
    }

    dependencies {
        classpath 'com.android.tools.build:gradle:0.13.0'
        classpath 'com.neenbedankt.gradle.plugins:android-apt:1.4+'
    }
}

repositories {
    mavenLocal()
    mavenCentral()
}

apply plugin: 'com.android.application'
apply plugin: 'android-apt'


android {
    compileSdkVersion 20
    buildToolsVersion '20.0.0'

    defaultConfig {
        minSdkVersion 9
        targetSdkVersion 19
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        debug {
            runProguard false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
        }
        release {
            runProguard false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.txt'
        }
    }
}

apt {
    arguments {
        androidManifestFile variant.processResources.manifestFile
        resourcePackageName 'me.timnew.game.launcher'
    }
}

def AAVersion = '3.1'
dependencies {
    apt "org.androidannotations:androidannotations:$AAVersion"         // Process AA annotations
    /*
    * Android Studio will remove this line if you try to edit project configuration with GUI.
    * It seems it is a bug of Android Studio since it does not understand DSL `apt`
    */
    compile "org.androidannotations:androidannotations-api:$AAVersion" // AA Runtime API. Becareful

    compile 'de.greenrobot:eventbus:2.2.1'
    compile 'org.easytesting:fest-reflect:1.4.1'
    compile 'com.google.guava:guava:18.0'
    compile 'com.koushikdutta.ion:ion:1.3.8'

    compile fileTree(dir: 'libs', include: ['*.jar', '*.aar']) // Well although I mentioned aar here, but it doesn't load correctly.

    compile 'com.android.support:support-v4:20.0.0'
    compile 'com.android.support:support-annotations:20.0.0'
    compile 'com.android.support:appcompat-v7:20.0.0'
}
```

```gradle \UnitTest\build.gradle
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:0.13.0'
    }
}

apply plugin: 'java'

repositories {
    mavenLocal()
    maven { url "$System.env.ANDROID_HOME/extras/android/m2repository" } // Fix 'com.android.support:*' package not found issue
    mavenCentral()
}

dependencies {
    def appModule = project(':Launcher')
    compile appModule

    testCompile appModule.android.applicationVariants.toList().first().javaCompile.classpath       // Include classes from main project
    testCompile appModule.android.applicationVariants.toList().first().javaCompile.outputs.files
    testCompile files(appModule.plugins.findPlugin("com.android.application").getBootClasspath())

    testCompile('junit:junit:4.+') {
        exclude module: 'hamcrest-core'                                                            // Exclude problematic 'hamcrest'
    }
    testCompile 'org.robolectric:robolectric:2.3'
    testCompile 'org.mockito:mockito-core:1.9.5'
    testCompile 'org.assertj:assertj-core:1.6.1'
}

tasks.withType(Test) {
    scanForTestClasses = false
    include "**/*Should.class"
    include "**/*Test.class"
    include "**/*Tests.class"
}
```

## Why uses `java` plug-in instead of `android unit test` plug-ins

Well, Gradle DSL provides a lot of flexibility to developer. But it also brought a lot complexity to IDE implementation. To figure out project configuration, IDE need to parse and understand the gradle scripts. Not only DSLs provided by gradle but all stuff come with plug-ins. From IDE, this is almost an impossible mission. So IDE need to figure out a way to simplify the process, such as support a subset of DSL.

For Android project, IntelliJ has difficulties to understand the all variations of `android unit test` plug-ins. So it is not easy to make unit test runnable from IDE. To solve the issue, you either try to teach IDE about the DSL by providing plug-in to IDE, or uses some languages that IDE understood.

I tried some plug-in available today, but none of them works for me. So I decide to use `java` DSL, which IntelliJ understood natively. As a trade off, since `java` gradle plugin doesn't understand `Android Library`, so it cannot import `.aar` libries.

Besides I tried all `android unit test` gradle plugins, I found all of them depends on `android` gradle plugin. And `android` plugin depends on `AndroidManifest.xml` and some other stuff. It is wield to provide an manifest for your unit test.

So as the final solution, I uses `java` plug-in, avoid using `aar` in the test.

## Why so complicate

Configurate an working Android project isn't as easy as it sounds. Differ from iOS community, Google isn't strong-minded as Apple. As a consequence that Android community is fragmented and lack of unified solution. There are tons of solutions available, but you might need to try them one by one to figure out which fits your requirement.

To make your tool chain, dependencies, IDE work together, compatibility is always your enemy. Even Google has to publish [Version Compatibility Table] to mitigate the pain.

What a mess!!!!!

## References posts, plugins or template projects

Here is a list of things that I tried but failed to fit my requirement. List here since it might be helpful to other people.

* [Android Gradle App with Robolectric JUnit tests]
* [tests-app-robolectric-junit] template project
* [deckard-gradle] template project
* [android-unit-test] gradle plug in
* [android-studio-unit-test-plugin] android studio/intellij plugin
* [robolectric-gradle-plugin]
* [robolectric-plugin]

[AssertJ-Android]: https://github.com/square/assertj-android
[Version Compatibility Table]: http://tools.android.com/tech-docs/new-build-system/version-compatibility
[Android Gradle App with Robolectric JUnit tests]: http://blog.blundell-apps.com/android-gradle-app-with-robolectric-junit-tests/
[tests-app-robolectric-junit]: https://github.com/blundell/tests-app-robolectric-junit
[deckard-gradle]: https://github.com/robolectric/deckard-gradle
[android-unit-test]: https://github.com/JCAndKSolutions/android-unit-test
[android-studio-unit-test-plugin]: https://github.com/evant/android-studio-unit-test-plugin
[robolectric-gradle-plugin]: https://github.com/robolectric/robolectric-gradle-plugin
[robolectric-plugin]: https://github.com/novoda/robolectric-plugin
