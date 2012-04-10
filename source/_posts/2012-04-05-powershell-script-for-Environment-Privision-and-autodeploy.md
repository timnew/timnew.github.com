---
layout: post
title: "Powershell Script for Environment Privision and Autodeploy"
description:
category: Powershell 
tags: ["Powershell", "Continues Integration", "Continues Delivery", "CI", "Deploy", "Deployment", "Automation", "Script", "Remote"]
---

I've been working on MetaPaas project for a while. And composing deploy script is one of the my major tasks.
Here are some script snippets I found or I compose, which could be very useful in my daily work.

### Download File from Web

This piece of script is useful when the script need to download package from CI server or configuration from configuration server etc.
Especially when wget or curl available. 

**NOTICE: ** This piece of script enable you to download the file from web in Powershell without any 3rd party dependences. But its performance is not as good as wget. Wget is still recommended if there are quite a lot of files to be downloaded. 

[Original Source](http://huddledmasses.org/wget-2-for-powershell/)

{% codeblock Get-WebFile lang:powershell %}

## Get-WebFile (aka wget for PowerShell)
##############################################################################################################
## Downloads a file or page from the web
## History:
## v3.6 - Add -Passthru switch to output TEXT files 
## v3.5 - Add -Quiet switch to turn off the progress reports ...
## v3.4 - Add progress report for files which don't report size
## v3.3 - Add progress report for files which report their size
## v3.2 - Use the pure Stream object because StreamWriter is based on TextWriter:
##        it was messing up binary files, and making mistakes with extended characters in text
## v3.1 - Unwrap the filename when it has quotes around it
## v3   - rewritten completely using HttpWebRequest + HttpWebResponse to figure out the file name, if possible
## v2   - adds a ton of parsing to make the output pretty
##        added measuring the scripts involved in the command, (uses Tokenizer)
##############################################################################################################
function Get-WebFile {
   param( 
      $url = (Read-Host "The URL to download"),
      $fileName = $null,
      [switch]$Passthru,
      [switch]$quiet
   )
   
   $req = [System.Net.HttpWebRequest]::Create($url);
   $res = $req.GetResponse();
 
   if($fileName -and !(Split-Path $fileName)) {
      $fileName = Join-Path (Get-Location -PSProvider "FileSystem") $fileName
   } 
   elseif((!$Passthru -and ($fileName -eq $null)) -or (($fileName -ne $null) -and (Test-Path -PathType "Container" $fileName)))
   {
      [string]$fileName = ([regex]'(?i)filename=(.*)$').Match( $res.Headers["Content-Disposition"] ).Groups[1].Value
      $fileName = $fileName.trim("\/""'")
      if(!$fileName) {
         $fileName = $res.ResponseUri.Segments[-1]
         $fileName = $fileName.trim("\/")
         if(!$fileName) { 
            $fileName = Read-Host "Please provide a file name"
         }
         $fileName = $fileName.trim("\/")
         if(!([IO.FileInfo]$fileName).Extension) {
            $fileName = $fileName + "." + $res.ContentType.Split(";")[0].Split("/")[1]
         }
      }
      $fileName = Join-Path (Get-Location -PSProvider "FileSystem") $fileName
   }
   if($Passthru) {
      $encoding = [System.Text.Encoding]::GetEncoding( $res.CharacterSet )
      [string]$output = ""
   }
 
   if($res.StatusCode -eq 200) {
      [int]$goal = $res.ContentLength
      $reader = $res.GetResponseStream()
      if($fileName) {
         $writer = new-object System.IO.FileStream $fileName, "Create"
      }
      [byte[]]$buffer = new-object byte[] 4096
      [int]$total = [int]$count = 0
      do
      {
         $count = $reader.Read($buffer, 0, $buffer.Length);
         if($fileName) {
            $writer.Write($buffer, 0, $count);
         } 
         if($Passthru){
            $output += $encoding.GetString($buffer,0,$count)
         } elseif(!$quiet) {
            $total += $count
            if($goal -gt 0) {
               Write-Progress "Downloading $url" "Saving $total of $goal" -id 0 -percentComplete (($total/$goal)*100)
            } else {
               Write-Progress "Downloading $url" "Saving $total bytes..." -id 0
            }
         }
      } while ($count -gt 0)
      
      $reader.Close()
      if($fileName) {
         $writer.Flush()
         $writer.Close()
      }
      if($Passthru){
         $output
      }
   }
   $res.Close();
   if($fileName) {
      ls $fileName
   }
}

{% endcodeblock %}

### Extract File with Windows Explorer

This piece of code enable you to extract zip package without any 3rd party dependencies. It is useful environment provision script, which is usually executed on a Windows without anything being installed.

{% codeblock Extract-Zip lang:powershell %}

Function Extract-Zip ([string] $zipPath, [string]$destination) {
	$progressbar = 4
	$shellApplication = New-Object -com shell.application
	$zipPackage = $shellApplication.NameSpace($zipPath)
	$destinationFolderName = Join-Path $destination "tiger"
	if ( Test-Path $destinationFolderName ) {
		Remove-Item $destinationFolderName -Recurse -Force
	} 
	New-Item $destinationFolderName -type directory
	$destinationFolder = $shellApplication.NameSpace($destinationFolderName)
	$destinationFolder.CopyHere($zipPackage.Items(), $progressbar)
}

{% endcodeblock %}

### Interpolate value into configuration

This piece of script enable you to replace the place-holders in configuration text with actual values.

{% codeblock Apply-Config lang:powershell %}

Function Apply-Config([hashtable]$config) {
	foreach($line in $input) {
		foreach($key in $config.Keys) {
			$line = $line -replace $key, $config[$key]
		}
		$line
	}
}

{% endcodeblock %}

This piece of script can be used in different scenarios:

#### Prepare Configuration
{% comment %}
{% codeblock Config lang:powershell %}
$configuration = @{
	"initialCatalog" = "lion"
	"logInitialCatalog" = "lion_log"

	"webServers" = @("192.168.122.46")
	"dbServer" = "192.168.122.65"
	"SQLServerDataDir" = "C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA"
	"SQLServerDataFileSize" = "10MB"
	"dataset" = "prod"
	
	"appPoolUser" = "$($env:COMPUTERNAME)\Lion"
	"appPoolPassword" = "1zhlmcl..oostp"
	"createAppPoolUser" = $true
}
{% endcodeblock %}
{% endcomment %}
#### Apply config to in-memory configuration template

{% codeblock Apply config to string in memory lang:powershell %}

$configurationText = $configurationTemplate | Apply-Config($configuration)

{% endcodeblock %}

#### Create configuration file according to template

{% codeblock Apply config to file lang:powershell %}

cat $configurationTemplateFile | Apply-Config($configuration) > $configurationFile

{% endcodeblock %}

#### Download and apply configuration from configuration server

{% codeblock Download and apply config lang:powershell %}

Get-WebFile -url $configTemplateUrl -Passthru | Apply-Config($configuration) > $configurationFile

{% endcodeblock %}

