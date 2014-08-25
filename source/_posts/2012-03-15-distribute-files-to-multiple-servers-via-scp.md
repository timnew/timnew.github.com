layout: post
title: Distribute files to multiple servers via scp
tags:
  - bash
  - scp
  - ssh
  - server management
categories:
  - Programming
  - Shell
comments: true
date: 2012-03-15 08:00:00
---
The most common task when operating the servers is to distribute a file to multiple servers.
So I wrote a piece of shell script to solve this problem:

{% codeblock mscp lang:bash %}
#!/bin/bash  
echo "mscp <source file> <target dir>"  
SourceFile=$1  
TargetDir=$2  
echo "Copy $SourceFile to $TargetDir as $RemoteUser"  
echo "Enter the servers:"  
if [ -f $SourceFile ]  
then  
  printf "File found, preparing to transfer\n"  
  while read server  
  do  
  scp -p $SourceFile ${server}:$TargetDir  
  done  
else  
  printf "File \"$SourceFile\" not found\n"  
  exit 1  
fi  
exit 0
{% endcodeblock %}

call the script `mscp <source file> <target dir>`, then the script will ask you the list of target servers. So you can type them one by one. If the remote user is different than you current user, you can also explicitly identify it by typeing user@server

Beside the previous scenario, there is a more common sceanrio, that you have got a server list stored in afile already. Then instead of type the servers line by line, you can pipe the file content to the script.
e.g:

{% codeblock Read server list from file lang:bash %}
cat server_list.txt > mscp src_files dest_path
{% endcodeblock %}
