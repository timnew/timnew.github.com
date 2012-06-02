---
layout: post
title: "Install specific version of tool with Home Brew"
description: ""
date: 2012-06-02 20:15
comments: true
categories: 
category: homebrew
tags: ["homebrew","brew","version","repository","package","postgres", "postgresql"]
sharing: true
footer: false
---

HomeBrew is a convenient package manager for Mac user. For some reason I prefer Home Brew to Mac Ports. 
Brew has a younger package repository since it has shorter history comparing to MacPorts. Younger repository means less options. And sometime it is hard for you to install the old-fashioned tool with brew.

Brew uses git to manage its formula repository, so you can list with git.
Typically, the repo is located at `/usr/local`. But since this path can be changed, so it is safer to reference this path via brew.
Brew call the repo path as prefix, so you can reference the path with `brew --prefix`
You can use the following shell command to enter the brew repo.

{% codeblock lang:bash %}
cd $(brew --prefix)
{% endcodeblock %}

Since brew load formula from local, so before we install the app with brew, we need to ensure the repo is updated. We can use the following command to update the brew repo:

{% codeblock lang:bash %}
# Update brew
brew update

# update with git
cd $(brew --prefix) && git pull --rebase
{% endcodeblock %}

To install specific version of the app, we need to checkout the specific version of the formula, we can get the versions and related git revision by `brew versions` command, and checkout specific version, then install the app:

{% codeblock lang:bash %}
brew versions postgresql

# Output:
# 9.1.3    git checkout e088818 /usr/local/Library/Formula/postgresql.rb
# 9.1.2    git checkout dfcc838 /usr/local/Library/Formula/postgresql.rb
# 9.1.1    git checkout 4ef8fb0 /usr/local/Library/Formula/postgresql.rb
# 9.0.4    git checkout 2accac4 /usr/local/Library/Formula/postgresql.rb
# 9.0.3    git checkout b782d9d /usr/local/Library/Formula/postgresql.rb
# 9.0.2    git checkout 2c3b88a /usr/local/Library/Formula/postgresql.rb
# 9.0.1    git checkout b7fab6c /usr/local/Library/Formula/postgresql.rb
# 9.0.0    git checkout 1168d8f /usr/local/Library/Formula/postgresql.rb
# 8.4.4    git checkout c32bea0 /usr/local/Library/Formula/postgresql.rb
# 8.4.3    git checkout 9b2ef7c /usr/local/Library/Formula/postgresql.rb
# 8.4.1    git checkout 0495cf5 /usr/local/Library/Formula/postgresql.rb
# 8.4.0    git checkout a82e823 /usr/local/Library/Formula/postgresql.rb

git checkout a82e823 /usr/local/Library/Formula/postgresql.rb
brew install postgresql
{% endcodeblock %}

If we cannot find the specific version that we want (Such as Postgres 8.3.11). don't be disappointed, we can try to search the version repository.
Some of the old-fashioned tool which is not included in brew's master repo might be provided in version repository.

Begin from Brew 0.9 provide the multiple repository support, user can use `brew tap` command to register alternative repositories besides the master repo. There are quite a some interesting alternative repos, such as versions and games.
These official alternative repos can be found on [github](https://github.com/homebrew) 

The formulas in alternative repositories cannot be used directly, but luckily the official ones are included in the search result.

{% codeblock lang:bash %}

brew search postgresql
# Output:
# postgresql
# homebrew/versions/postgresql8    homebrew/versions/postgresql9
{% endcodeblock %}

In the search result, we can see there are 2 formulas are displayed with a path rather than just the formula name, which means these formulas are in a alternative repo.
The path to the formula follows the convention: `<github username>/<repository name without "homebrew-">/<formula name>`.
So `homebrew/versions/postgresql8` means the file is located at [https://raw.github.com/Homebrew/homebrew-versions/master/postgresql8.rb](https://raw.github.com/Homebrew/homebrew-versions/master/postgresql8.rb)

To install it, we can install it directly or tap the repo first:

{% codeblock lang:bash %}

# Install directly
brew install homebrew/versions/postgresql8

# Tap
brew tap homebrew/versions
brew install postgres8

{% endcodeblock %}