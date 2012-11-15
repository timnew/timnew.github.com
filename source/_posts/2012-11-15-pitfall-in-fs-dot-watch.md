---
layout: post
title: "Pitfall in fs.watch: fs.watch fails when switch from TextMate to RubyMine"
description: ""
date: 2012-11-15 15:19
comments: true
categories: 
category: "node.js" 
tags: ["node.js","fs.watch", "change", "FSWatcher", "watch", "javascript", "ruby mine", "editor"]
sharing: true
footer: false
---
I'm writing a cake script that helps me to build the growlStyle bundle.  
And I wish to my script can watch the change of the source file, and rebuild when file changed.  
So I wrote the code as following:

{% codeblock Watching code change lang:coffeescript %}
files = fs.readdirSync getLocalPath('source')
for file in files
  fs.watch file, ->
    console.log "File changed, rebuilding..."
    build()
{% endcodeblock %}

The code works when I edits the code with TextMate, but fails when I uses RubyMine!

Super weird!

After half an hour debugging, I found the following interesting phenomena:

* Given I'm using TextMate  
When I changed the file 1st time  
Then a 'change' event is captured  
When I changed the file 2nd time  
Then a 'change' event is captured  
When I changed the file 3rd time  
Then a 'change' event is captured

* Given I'm using RubyMine  
When I change the file 1st time  
Then a 'rename' event is captured  
When I changed the file 2nd time  
Then no event is captured  
When I changed the file 3rd time  
Then no event is captured

From the result, we can easily find out that the script fails is because "change" event is not triggered as expected when using RubyMine.  
And the reason of RubyMine's "wried" behavior might be that RubyMine what to keep the file integrity so they "write" the file in an atomic way as following:

1. RubyMine write the file content to a temp file
2. RubyMine remove the original file
3. RubyMine rename the temp file to original file

This workflow ensures that the content is fully written or not written. So in a word, RubyMine does not actually write the file, it actually replace the original file with another one, and the original one is removed or stored to some special location.

And on the other hand, according to Node.js document of `fs.watch`, node uses `kqueue` on Mac to implement this behavior.  
And according to `kqueue` document, it uses `file descriptor` as identifier, and `file descriptor` is bound to the file itself rather than its path. So when the file is renamed, we will keep to track the file with new name. That's why we lost the status of the file after the first 'rename' event.  
And in our case, we actually wish to identify the file by file path rather than by 'file descriptor'. 

To solve this issue, we have 2 potential solutions:

1. Also apply `fs.watch` to the directory that holds the source file besides of the source file itself.  
When the file is directly updated as TextMate does, the watcher on the file will raise the "change" event.  
When the file is atomically updated as RubyMine does, the watcher on the directory will raise 2 "rename" events.  
So theoretically, we could track the change of the file no matter how it is updated.

2. Use the old fashioned `fs.watchFile` function, which tracks the change the with `fs.stat`.  
Comparing to `fs.watch`, `fs.watchFile` is less efficient because its polling mechanism, but it does track the file with file name rather than `file descriptor`. So it won't be charmed by the fancy atomic writing.

Obviously, the 1st solution looks better than the 2nd one, because its uses the `event` rather than old-fashioned `polling`. Even document of `fs.watchFile` also says that try to use `fs.watch` instead of `fs.watchFile` when possible.

But actually it is kind of painful to write such code, since 'rename' event on the directory is not only triggered by the file update, it also can be triggered by adding file and removing file.

And the 'rename' event will be triggered twice when updating the file. Obviously we cannot rebuild the code when the first 'rename' event fired, or the build might fail because of the absence of the file. And we will trigger the build twice in a really short period of time.

So in fact, to solve our problem, the polling `fs.watchFile` is more useful, its old-fashion protected itself being charmed by the 'fancy' atomic file writing.

So finally, we got the following code:
{% codeblock fs.watchFile lang:coffeescript %}
runInWatch = (options, task) ->
  action(options) unless options.watch
  console.info "INFO: Watching..."
  files = fs.readdirSync getLocalPath('source')
  console.log '"Tracking files:'
  for file in files
    console.log "  #{file}"
    fs.watchFile getLocalPath('source', file), (current, previous) ->
      unless current.mtime == previous.mtime
        console.log "#{file} Changed..."
        task(options)
{% endcodeblock %}

**HINT:** Be careful about the differens of fs.watch and fs.watchFile:

* The meaning of `filename` parameter
** The `filename` parameter of `fs.watch` is path sensitive, which accept 'source.jade' or '/path/to/source.jade'
** The `filename` parameter of `fs.watchFile` isn't path sensitive, which only accept '/path/to/source.jade'
* Callback is invocation condition
** `fs.watch` invokes callback when the file is renamed or changed
** `fs.watchFile` invokes callback when the file is accessed, including write and read.
So you need to compare the mtime of the `fstat`, file is changed when mtime changed.
* Response time
** `fs.watch` uses `event`, which captures the "change" almost in realtime.
** `fs.watchFile` uses 'polling', which might differed for a period of time. By default, the maximum could be 5s.

 




