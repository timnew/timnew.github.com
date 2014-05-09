---
layout: post
title: "Adjust files encoding in Finder context menu [GB1312 to UTF-8 with 1-click]"
description: ""
date: 2013-10-27 04:51
comments: true
categories: 
category: osx
tags: 
  - transcode
  - encoding
  - utf8
  - messy code
  - GB2312
  - GBK
  - subtitle
  - lyrics    sharing: true
footer: false
published: true
---

One of the most annoying thing of Mac is that encoding, espeically you're living in a non-Mac world.

Mac uses UTF-8 as the default encoding for text files. But Windows uses local encoding, so it changes according to your OS language.  For Chinese users, Windows uses GB2312 as the default encoding.

So usually the movie subtitle files, the song lyrics files, the plain text novel files, the code contains Chinese, which you downloaded form web sites or recieved from others usually cannot be read because of the wrong encoding. 

So I really wish to have an item in my finder's context menu that I can adjust the encoding of selected files with 1-click.

Luckily, with the help of Ruby, Automator workflow and Mac OSX service, it isn't that hard.

So basically, OSX loads all the workflow files saved in `~/Library/Services/`, which is displayed as Context Menu in finder.

![Services as Context Menu](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/context_menu.png)

To build the service, work through the following steps:

## 1. To create a new service, just pick `Service` in Automator's 'create new document' dialog.

![Create a service](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/create_service.png)

## 2. Set service input as "files and folders from any application".

![Recieves files and folders from any app](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/service_input.png)

## 3. Run Ruby Script to transcode the files

Add a "Run Shell Script" action to execute the following ruby code, which is used to transcode the files passed to service. ( For more detail about how to embed Ruby in workflow, check out [Using RVMed Ruby in Mac Automator Workflow](/blog/2013/10/27/using-rvmed-ruby-in-mac-automator-workflow/) )

Make sure the input is passed as arugments to the ruby script.

![Step-1](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/step_1.png)

{% codeblock Transcode the files lang:ruby %}

old_files = []

ARGV.each do |name|
  next until File.file? name
  backup_name = name + '.old'
  File.rename name, backup_name

  source = File.open backup_name, 'r:GB2312:UTF-8'
  dest = File.open name, 'w'

  while line = source.gets
      dest.puts line
  end

  puts name

  old_files << backup_name
end

ENV['Transcode_Backup_Files'] = old_files.join('|')

{% endcodeblock%}

## 4. Display a growl message when processing is done

![Step-2](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/step_2.png)

## 5. Prompt user whether to keep the backup files

I use a `Ask for confirmation` action to ask whether user want to keep the backup files.
The workflow will abort if user clicks "No", make sure you updated the text on the buttons, and texts are put on right button.

![Step-3](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/step_3.png)

## 6. Add script to remove backup files

Add another "Run Shell Script" aciton to execute another piece of ruby code.

![Step-4](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/step_4.png)

{% codeblock Remove backup files lang:ruby %}

if ENV['Transcode_Backup_Files']
    ENV['Transcode_Backup_Files'].split('|').each do |file|
        File.delete file
    end

    ENV.delete 'Transcode_Backup_Files'
end

{% endcodeblock %}

## 7. Display notification to tell user that backup files has been deleted

![Step-5](/blog/2013/10/27/adjust-files-encoding-in-finder-context-menu/step_5.png)

**TIP:** The transcode ruby script requires Ruby 1.9+, but Mac OS X default provides Ruby 1.8.3, which doesn't support encoding. To interprets workflow embedded code with ruby 1.9+, please refers to [Using RVMed Ruby in Mac Automator Workflow](/blog/2013/10/27/using-rvmed-ruby-in-mac-automator-workflow/)