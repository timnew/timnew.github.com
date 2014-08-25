layout: post
title: Pitfall in Nokogiri XPath and Namespace
comments: true
categories:
  - Programming
  - Ruby
tags:
  - ruby
  - nokogiri
  - xpath
  - namespace
  - pitfall
date: 2012-10-25 08:00:00
---
`Nokogiri` is a really popular Xml and Html library for Ruby. People loves `Nokogiri` is not just because it is powerful and fast, the most important is its flexible and convenient.
`Nokogiri` works perfect in most aspects, but there is a big pitfall when handling the xml namespace!

I met a super weird issue when processing xml returned by Google Data API, and the API returns the following xml document:
{% codeblock API response lang:xml %}
  <?xml version="1.0" encoding="UTF-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xmlns:yt="http://gdata.youtube.com/schemas/2007">
    <entry>
      <media:group>(...)</media:group>
      <yt:position>1</yt:position>
    </entry>
    <entry>
      <media:group>(...)</media:group>
      <yt:position>2</yt:position>
    </entry>
    <entry>
      <media:group>(...)</media:group>
      <yt:position>3</yt:position>
    </entry>
    <entry>
      <media:group>(...)</media:group>
      <yt:position>4</yt:position>
    </entry>
  </feed>
{% endcodeblock %}

I instantiated a `Nokogiri::XML` DOM with the xml document, and then I try to query the DOM with XPath: `xml_dom.xpath '//entry'`:

{% codeblock Query DOM lang:ruby %}
  xml_dom = Nokogiri::XML Faraday.get api_url
  entries = xml_dom.xpath '//entry'
{% endcodeblock %}

I'm expecting `entries` is an array with 4 elements, but actually it is empty array. After a few tries, I found the query yields empty array when I introduce the element name in the query.

{% codeblock Try Xpath Queries lang:ruby %}
  xml_dom.xpath '.' # returns document
  xml_dom.xapth '//.' # returns all element nodes
  xml_dom.xpath '/feed' # returns empty array
  xml_dom.xpath '//entry' # returns empty array
  xml_dom.xpath '//media:group', 'media' => 'http://search.yahoo.com/mrss/' # returns 4 the media:group nodes
{% endcodeblock %}

It is super weird.

After half an hour fighting against the Nokogiri, I begin to realize that it must be related to the namespace.
And I found that there is an attribute applied to the root element of the document: `xmlns="http://www.w3.org/2005/Atom"`, which means all the elements without explicit namespace declaration in the xml dom are under the namespace `http://www.w3.org/2005/Atom` by default.


And for some reason, the XPath query is namespace sensitive! It requires the **full name** rather than the **local name**, which means we should query the DOM with the code: `xml_dom.xpath '//atom:entry', 'atom' => 'http://www.w3.org/2005/Atom'`.

{% codeblock Fixed XPath Queries lang:ruby %}
  xml_dom.xpath '.' # returns document
  xml_dom.xapth '//.' # returns all element nodes
  xml_dom.xpath '/atom:feed', 'atom' => 'http://www.w3.org/2005/Atom' # returns root node
  xml_dom.xpath '//atom:entry', 'atom' => 'http://www.w3.org/2005/Atom' # returns 4 entry nodes
  xml_dom.xpath '//media:group', 'media' => 'http://search.yahoo.com/mrss/' # returns 4 the media:group nodes
{% endcodeblock %}

So in a sentence: XPath in `Nokogiri` doesn't inherit the default namespace, so when query the DOM with default namespace, we need to explicitly specify the namespace in XPath query. It is really a hidden requirement and is very likely to be ignored by the developers!

So if there is no naming collision issue, it is recommeded to avoid this kind of "silly" issues by removing the namespaces in the DOM. `Nokogiri::XML::Document` class provides `Nokogiri::XML::Document#remove_namespaces!` method to achieve this goal.
