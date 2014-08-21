layout: post
title: Use Hexo Asset Folder to manage resource used by post
comments: true
categories:
  - Package
  - Hexo
tags:
  - hexo
  - blog
  - plugin
  - image
  - resource
  - management
  - clean
  - asset
  - folder
date: 2014-08-19 15:57:18
---

[Hexo] `asset folder` is a folder that with the same name as you post file, the content in which will be copied to the folder where the rendered post html file located. It is a great way to keep the relationship between the post and its referenced resources. Personally, I prefers to put all the images or other downloadable files that referenced by the post into its `asset folder`.

Although `asset folder` is a great idea, but in practice, there are some common pitfall might disappoint you badly.

## Relative Path Pitfall

The idea of `asset folder` is actually based on an assumption, that the asset resources will be placed under the same folder with the html. The html can reference these files with relative path.

Suppose we have following files as post file:

```
  /2014-08-19-awesome-post.md
  /2014-08-19-awesome-post/
    screenshot.png
    document.pdf
```
The compiled file structure will be like this:
```
  /2014/08/19/awesome-post/
    index.html
    screenshot.png
    document.pdf
```
The asset files are located in the same folder as the html file. So in the post file, you can reference the resource files as

```markdown
![ScreenShot](screenshot.png)

[Document](document.pdf)
```
Then this will be compiled as following Html:
```html
<p>
  <img src="screenshot.png">
</p>
<p>
  <a href="document.pdf">Document</a>
</p>
```
So far it looks great. But if you open your `home page` of you site, you find the image isn't displayed, and the link to `document.pdf` is also broken.

The problem here is that the the relative path assumption only works in `/2014/08/19/awesome-post/index.html`. But the content compiled from `2014-08-19-awesome-post.md` might also be used by HomePage(`/index.html`), Archive Page(`/archive/index.html`), and `tag pages` and `category pages`. For these html pages, the relative path relationship doesn't exist. So the relative link causes `404` error.

To solve the issue, someone use absolute url in the post. So they write markdown in this way:
```markdown
![ScreenShot](/2014/08/19/awesome-post/screenshot.png)

[Document](/2014/08/19/awesome-post/document.pdf)
```
This approach fix the link issue, but makes you lost the benefits of using relative path.

So you need [hexo-tag-asset-res], which allow you to reference asset resources with relative path. It will convert them into absolute path during compilation. Easy and efficient.

## Empty asset folders

For convenience, I turned on the `post_asset_folder` to `true` in my `_config.yml`. So the `asset folder` will be created along with post when I execute `hexo new`. It is great because create asset folder manually is boring and error-proning. If you introduced a typo carelessly, the link will be broken immediately.

But by ask `Hexo` to create asset folder automatically causes another problem. I don't really have asset resources for each post, then there must be a number of empty asset folders. So I wish these folders can be removed if it is empty.

For this purpose, you might need [hexo-console-clean-asset-folder]. This plugin helps you to remove all the empty asset folders automatically.

## Rename the post

Well, renaming a post already published is that common. But it is very likely to rename a draft. When renaming the post file, you have to remember also rename the asset folder too, or the link will broken.

To help you on this issue, you might need [hexo-console-rename]. The plugin helps you to rename the asset folder along with post. And it also helps you on migration once you updated your `new_post_name` pattern.

So this is the common pitfalls in using `asset folder` in `Hexo`, and the plug-ins that help you to mitigate the pain.

[Hexo]: http://hexo.io
[hexo-tag-asset-res]: https://github.com/timnew/hexo-tag-asset-res
[hexo-console-clean-asset-folder]: https://github.com/timnew/hexo-console-clean-asset-folder
[hexo-console-rename]: https://github.com/timnew/hexo-console-rename
