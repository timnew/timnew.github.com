layout: post
title: Favicon is not as simple as you think
comments: true
categories:
  - Programming
  - Web
tags:
  - favicon
  - html
  - web
  - deployment
  - design
  - website
  - iOS
  - android
  - windows 8
  - tile
  - icon
  - logo
date: 2014-08-18 00:04:36
---

`Favicon` is the little icon that displayed on the title bar or tab bar when you browsing a web site. At very beginning, it is used to be the little icon displayed in favoriate bar when user add the website to favorites. Then later, it becomes the the standard way to specify custom icon for a website.

Most web site provides `favico`, developer add one line description in the `<head>`:

```html
<link rel="shortcut icon" href="/favico.ico" type="image/x-icon">
```

This simple piece of code works, but there are a lot of issues with this declaration. Actually specify the `favico` isn't as simple as you might expect!

For this piece of code, according to W3C document [how to favicon], there are 2 issues with it:

First, `shortcut` isn't a standard value for `rel`, it is only for `IE`.

Second, `ico` format is a Microsoft oriented file type, not all platform likes it. Linux, Mac, iOS, Android, do not really appreciate this format.

Beides the 2 issues described above, the size of the `favicon` also matters.

Someone says it should be `16x16`. Yes, `16x16` icon is used in tab or tree view. Some other says it should be `32x32`. Well, this is also true. `32x32` icon is displayed in toolbar.

`16x16` and `32x32` are the most used sizes for `favico`, but that's not all. The reality is a lot complicated, I'll explain this issue later. Let focus on this 2 size first.

To provide the image with 2 different sizes. For `ico` it is not an issue, since `ico` is a image container file format, which can encapsulate several images with different sizes and color in a single file. It is convenient for developer, but not for users. Because it means the users need to download a big file, most of the data in which is not used at all.

For the recommended `png`, it is no way to provide multiple images in a single file. So we have to provide 2 different separate files, and specify them with 2 different `<link>` tags with `sizes` attribute. This is a more efficient way, but unfortunately, you're living in the world has something called `Internet Explorer`. The `favico` in `png` is not supported by IE until `IE 11`. What a hell!

Actually, there is a lot of issue with IE in this case. There is an [great article](https://mathiasbynens.be/notes/rel-shortcut-icon) by Mathias Bynen that discussed this issue in detail, which provides a lot of interesting information related to `favico`.

### Microsoft Windows 8

Besides typical browser usage, `Favicon` is also used to create `Metro Tile` by `IE 10` and `IE 11` on Windows 8. It requires something quite different. Here is a MSDN document that described how to [create custom tiles for IE11 websites]. For these `tile icon`, Windows 8 also asks for a background color other than the icon itself.

### Android

In the age of mobile internet, `favicon` is not just used by the desktop browser, but also mobile devices. On mobile devices, there are some more specific requirements.

On android, the screen size and resolution varies between devices. So the visual elements on Android are measured in `dp`. According to the screen resolution, there are different conversion ratios between `dp` and `px`. And to have pixel perfect image on Android, developer should provide several images for different `dp-px-ratios`.

Google have a well written document that described how to create icon for the web app that [added to homescreen].

### iOS

For iOS, it is simliar to Android, but seems to be much more complicated. On iOS, it is also possible to create a shortcut for the web apps. Apple named such icon as `apple touch icon`, which is used by Safari and other browsers on iOS.

For the iOS devices, iPhone and iPad have different screen sizes, so they have different size requirements for `touch icon`.

Furthermore, there are device with `retina` display and with normal one. To have pixel perfect image on `retina display`, it requires the resolution of the image to be doubled.

And since iOS 7, iOS changed its UI style, the icon size used by iOS 7 is also slightly changed. So you should provide new icons for iOS 7 devices!

To make the icon fit iOS visual style best, Apple recommend web application to provide `precomposed icon`, which is a icon that added `rounded corner` and background by itself.

To have the pixel perfect icon on iOS, you might need to provide around 10 different images files as `apple touch icon`.

What a hell!!!! The `touch icon` on iOS is totally a mess!!!!

Here is a document from Apple that describes how [configure web application icon].

### Other

Besides all cases that describe above, `favicon` is also used in some special cases, such as [Google TV], [Opera Speed Dial], Chrome Web App. They all requires different size of `favico`.

### Conclusion

In a short description, `favico` isn't as simple as it looks. And it actually used wrongly by most websites.
To provide proper `favico` for all platforms and devices is not a simple work to do.
Here is the `favico` declaration that used this blog:

```html
<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
<link rel="icon" type="image/png" href="/favicon-196x196.png" sizes="196x196">
<link rel="icon" type="image/png" href="/favicon-160x160.png" sizes="160x160">
<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
<meta name="msapplication-TileColor" content="#00a300">
<meta name="msapplication-TileImage" content="/mstile-144x144.png">
```

And these files are served on this blog as `favico`:

```
favicon.ico

favicon-16x16.png
favicon-32x32.png
favicon-96x96.png
favicon-160x160.png
favicon-196x196.png

apple-touch-icon.png
apple-touch-icon-precomposed.png
apple-touch-icon-57x57.png
apple-touch-icon-60x60.png
apple-touch-icon-72x72.png
apple-touch-icon-76x76.png
apple-touch-icon-114x114.png
apple-touch-icon-120x120.png
apple-touch-icon-144x144.png
apple-touch-icon-152x152.png

browserconfig.xml
mstile-70x70.png
mstile-144x144.png
mstile-150x150.png
mstile-310x150.png
mstile-310x310.png
```
As you can see, to prepare all these configurations and files is not an easy job to do. It really consumes you a lot effort.

Fortunately, we have the awesome [Real Favicon Generator] brought by [Philippe Bernard], which will save your tons of time to have the proper fav icon configuration.

`Real Favicon Generator` also comes with a [favicon checker], which check the favorite configuration for your website, and generates  [beautiful report].

At last the [FAQ] of the site also provides a good explanation of the issue described above in details. Hope it helps.

[how to favicon]: http://www.w3.org/2005/10/howto-favicon
[create custom tiles for IE11 websites]: http://msdn.microsoft.com/en-us/library/ie/dn455106(v=vs.85).aspx
[added to homescreen]: https://developer.chrome.com/multidevice/android/installtohomescreen
[configure web application icon]: https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
[Google TV]: https://developers.google.com/tv/web/docs/design_for_tv#favicons
[Opera Speed Dial]: http://operacoast.com/developer#icon
[Philippe Bernard]: https://github.com/phbernard/
[Real Favicon Generator]: http://realfavicongenerator.net/
[favicon checker]: http://realfavicongenerator.net/favicon_checker
[beautiful report]: http://realfavicongenerator.net/favicon_checker?site=timnew.github.io
[FAQ]:http://realfavicongenerator.net/faq
