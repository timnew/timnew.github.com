layout: post
title: Create shortcut for your project Mingle with Chrome OmniBox
comments: true
categories: chrome
tags:
  - mingle
  - chrome
  - omnibox
  - custom search
  - shortcut
date: 2014-05-09 08:00:00
---
Mingle is a common choice of story wall management system in ThoughtWorks internal projects.

Mingle uses rest style url to identify card or entities in the system, so the url contains the account id and project id in it.
Hosted Mingle is used in most project, to distinguish between accounts and projects, the url of the project mingle site is usually long, e.g., `https://minglehosting.thoughtworks.com/telstra_de/projects/telstra_24x7_apps/`. And other resources in the project, such as cards, whose url will be even longer.

When working in the team, open a specific card is a very common scenario, such as kicking off story, moving card, update story ACs, etc. To open a card, user usually need to open the project mingle home page, and use the search feature in the project. To open the home page, usually you need to save the url into your bookmark.

Today I found a better way to solve this issue, using the Chrome OmniBox! Chrome OmniBox is usually configured by [Open Search Description](http://www.opensearch.org/Home). But it also allow user to manually add search engine configuration.

After the registration, we can use Mingle search direct from OmniBox, and we can open a specific card by typing "#card number".

1. Keyword Mingle in OmniBox
{% asset_img omnibox_1.png "Keyword mingle in OmniBox" %}
2. Search in OmniBox
{% asset_img omnibox_2.png "Search in OmniBox" %}
3. Open the page
{% asset_img omnibox_3.png "Open the page" %}

To register Mingle to Chrome OmniBox, you can use following approach:

Find out the Mingle search page url first:

1. Open Mingle project home page, type `test` in the Search Box. Press enter, copy the url, and replace word `test` with `%s`. That's the search url.
{% asset_img setup_1.png "Find Search Url" %}
2. Open url `chrome://settings`, find `Manage search engines`.
{% asset_img setup_2.png "Find Manage search engines" %}
3. Register new search engine.
  ** The first box is the display name of item, `Mingle`, `project_name Mingle` is recommended
  ** The second box is the keyword triggers the search, `mingle` is recommended. In most cases, you will work with only 1 mingle instance, so it will not cause confusion. But if it does, add more specific keyword to it.
  ** The third box is the url search url, paste the url you just found
{% asset_img setup_3.png "Register mingle" %}
