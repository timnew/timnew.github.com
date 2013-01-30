---
layout: post
title: "Pitfall in node crypto and base64 encoding"
description: ""
date: 2013-01-30 23:15
comments: true
categories: 
category: node.js
tags: 
  - node.js
  - pitfall
  - base64
  - crypto
  - decipher
  - buffer
  - encoding
sharing: true
footer: false
---

Today, we found there is a huge pitfall in node.js crypto module! Decipher has potential problem when processing Base64 encoding.

We're building RESTful web service based on Node.js, which talks to some other services implemented with Ruby.

### Ruby

In ruby, we use the default `Base64` class to handle Base64 encoding.

`Base64#encode64` has a very interesting feature:  
It add `line break (\n)` to output every 60 characters. This format make the output look pretty and be friendly for human reading:

{% codeblock Ruby Base64 Block %}
MSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgs
MTksMjAsMjEsMjIsMjMsMjQsMjUsMjYsMjcsMjgsMjksMzAsMzEsMzIsMzMs
MzQsMzUsMzYsMzcsMzgsMzksNDAsNDEsNDIsNDMsNDQsNDUsNDYsNDcsNDgs
NDksNTAsNTEsNTIsNTMsNTQsNTUsNTYsNTcsNTgsNTksNjAsNjEsNjIsNjMs
NjQsNjUsNjYsNjcsNjgsNjksNzAsNzEsNzIsNzMsNzQsNzUsNzYsNzcsNzgs
NzksODAsODEsODIsODMsODQsODUsODYsODcsODgsODksOTAsOTEsOTIsOTMs
OTQsOTUsOTYsOTcsOTgsOTksMTAw
{% endcodeblock %}

The `Base64#decode64` class ignores the `line break (\n)` when parsing the base64 encoded data, so the `line break` won't pollute the data. 

### Node.js

Node.js take `Base64` as one of the 5 standard encodings (`ascii`, `utf8`, `base64`, `binary`, `hex`). Ideally the data or string can be transcoded between these 4 encodings without data loss. 

The `Buffer` class is the simplest way to transcode the data:

{% codeblock Base64 Encoder in Node.js lang:coffeescript %}

Base64 = 
  encode64: (text) ->
    new Buffer(text, 'utf8').toString('base64')

  decode64: (base64) ->
    new Buffer(base64. 'base64').toString('utf8')

{% endcodeblock %}

Although `encode64` function in node.js won't add `line break` to the output, but the `decode64` function does ignore the `line break` when parsing the data. It keeps the consistent behavior with ruby `Base64` class, so we can use this `decode64` function to decode the data from ruby.

Since `base64` is one of the standard encodings, and some of the node.js API does allow set encoding for input and output. So ideally, we can complete the base64 encoding and decoding during processing the data.  
It seems Node.js is more convenient comparing to Ruby when dealing with `Base64`.

e.g. We can combine reading file and base64 encoding the content into one operation by setting the encoding to readFileSync API.

{% codeblock Write and Read string as Base64 lang:coffeescript %}

fs = require('fs')

fileName = './binary.dat' # this file contains binary data
base64 = fs.readFileSync(fileName, 'base64') # file content has been base64 encoded

{% endcodeblock %}

It looks like we can always use this trick to avoid manually base64 encoding and decoding when the API has encoding parameter! But actually it is not true! There is a BIG pitfall here!

In our real case, we uses `crypto` module to decrypt the the JSON document that encrypted and base64 encoded by Ruby:

{% codeblock Base64 Deocde and Decrypt lang:coffeescript %}

crypto = require('crypto')

parse = (data, algorithm, key, iv) ->
  decipher = crypto.createDecipheriv(algorithm, key, iv)
  
  decrypted = decipher.update(data, 'base64', 'utf8') # Set input encoding to 'base64' to ask API to base64 decode the input before decryption
  decrypted += dechiper.final('utf8')
  
  JSON.parse(decrypted)
  
{% endcodeblock %}

{% codeblock Manually Base64 Decoding lang:coffeescript%}

crypto = require('crypto')

parse = (data, algorithm, key, iv) ->
  decipher = crypto.createDecipheriv(algorithm, key, iv)
  
  binary = new Buffer(data,'base64') # Manually Base64 Decode
  
  decrypted = decipher.update(binary, 'binary', 'utf8') # Set input encoding to 'binary'
  decrypted += dechiper.final('utf8')
  
  JSON.parse(decrypted)

{% endcodeblock %}

The previous 2 implementations are very similar except the second one base64 decoded the data manually by using `Buffer`. Ideally they should be equivalent in behavior. But in fact, they are **NOT** equivalent!

The previous implementation throws "TypeError: DecipherFinal fail".  
And the reason is that the shortcut way doesn't ignore the `line break`, but `Buffer` does!!! So in the previous implementation, the data is polluted by the `line break`!

### Conclusion

Be careful, when you try to ask the API to base64 decode the data by setting the encoding argument to 'base64'. It has inconsistent behavior comparing to `Buffer` class.

I'm not sure whether it is a node.js bug, or it is as is by design. But it is indeed a pitfall that hides so deep. And usually is extremely hard to figure out. Since encrypted binary is hard to human to read, and debugging between 2 languages are also kind of hard!
