---
layout: post
title: "The missing add_folder command in Sublime Text"
description: ""
date: 2013-10-27 18:26
comments: true
categories: 
category: Sublime Text
tags: 
  - Project
  - Folder
  - Sublime Text
  - Plug In
  - Python
  - API
  - Command
  - Missing
  - prompt_add_folder
  - remove_folder
sharing: true
footer: false
published: false
---

I'm using [Stino](https://github.com/Robot-Will/Stino), a feature-rich plug-in turns Sublime Text into an Arduino IDE.

Stino is perfect on may ways, but there is one thing I found not that convinient is that it open the sketches as independent files rather than open it as a project. As a result, each time when you try to add new file to your sketch, you have to type the full path to your sketch folder or the file will be created in home folder.

I have had no experience on developing Sublime Text plug-in, and I'm not a big fan of Python. Unfortunately, Sublime plug-in is fully done in Python, so the process to add this little feature isn't an easy journey for me.

But it still not the biggest blocker. The top blocker to me is that I cannot find a sublime command to add a folder into current window. I turned on the command log by invoking `sublime.log_commands(True)` in the python console.
And I found this:

{% codeblock Sublime Python Console %}

sublime.log_commands(True)
command: prompt_add_folder
command: remove_folder {"dirs": ["/Users/timnew/Workspace/timnew.github.com/source/blog"]}

{% endcodeblock %}

From the log, we can find out that there is interactive command to open a folder in project, `prompt_add_folder`, and there is non-interactive  command `remove_folder` to remove a folder from a project.
So I infered that there might be a command called `add_folder` that acts like `prompt_add_folder` but without interrupt user with dialog.

After browsed tons of unclear document and hacked the default several packages come along with Sublime Text 3, I found it seems there is no such a command called `add_folder` as I expected. So I decided to create my own version of it:

{% codeblock Add folder into project lang:python %}

def addFolderToProject(window, folder):
    if os.path.isdir(folder):   
        project_data = window.project_data()
        
        if(project_data == None):
            project_data = {'folders': []}
        
        project_data['folders'].append({'follow_symlinks': True, 'path': folder})

        window.set_project_data(project_data)


{% endcodeblock %}

Each window in Sublime Text holds a hash called `project_data`, which contains the folder assocaited with the project. So to add a folder into a project, basically it is add the folder as an entry in the hash besides some configurations.

The only thing need to be careful is that the project data hash is not initialized by default if the window havn't ever associated with a project. Then the hash might be `None`, so we need to initialize it first.

So with this piece of code, developer can easily add the specific folder to a speicific window programatically. Or it could be wrapped into a command to enable the user to invoke it in a menu item or command plate.

PS: I just send the pull request to Stino, hopefully in the near future, everybody can open a sketch folder as project in Stino.

