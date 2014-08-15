layout: post
title: "CSS trick: Place Scrollbar outside of the client area"
comments: true
categories: css
tags:
  - css
  - margin
  - padding
  - scroll
  - overflow
date: 2012-10-26 08:00:00
---
Today, I found a interesting difference between padding and margin when I'm working on Metrics 2.0 Introduction page. There are several `VideoThumbnail` widget on the page, which contains a video snapshot and a paragraph text description.
Here is the Html DOM of the widget, written in Haml:

{% codeblock VideoThumbnail Widget Html lang:haml %}
%li.span4
  %a.thumbnail.new(data-widget="IntroductionPage.VideoThumbnail")
    .snapshot-container
      %img.snapshot{ src: snapshot }
      %img.status( src="/assets/new.png" )
    .caption
      .title
        %h3 #{index}. #{title}
      %p.description #{description}
{% endcodeblock %}

Since the description could be very short or very long, so I make the div that contains the description scrollable, so I wrote the following stylesheet for caption div:

{% codeblock VideoThumbnail Widget Stylesheet lang:scss %}
.caption {
  padding: 9px;
  height: 150px;
  overflow-y: auto;
}
{% endcodeblock %}

The style looks fine, and here is how it looks:

{% asset_img widget.png "Wiget" %}

But very soon, I found the widget with scrollbar is taller than the one without it, it is because padding on 2 elements next to each other will not be merged: **Red rect in following snapshot**

{% asset_img padding.png "Padding" %}

It is caused because padding will not merged together as margin does, To solve the issue, I changed the padding to margin in the stylesheet:

{% codeblock VideoThumbnail Widget Stylesheet lang:scss %}
.caption {
  padding: 0;
  margin: 9px;
  height: 150px;
  overflow-y: auto;
}
{% endcodeblock %}

But bottom margin is corrected, but I found the scrollbar begin to occupy the space of content, which is not good! **The center widget uses padding(Blue) and the right one uses margin(Red)**

{% asset_img margin.png "Margin" %}

And I remember if I uses padding, the scrollbar takes the space of right padding; but if I use margin, it takes the space of the content. So I update the stylesheet in this way:

{% codeblock VideoThumbnail Widget Stylesheet lang:scss %}
.caption {
  padding: 0 9px 0 0;
  margin: 9px 0 9px 9px;
  height: 150px;
  overflow-y: auto;
}
{% endcodeblock %}

{% asset_img padding_margin_mixing.png "Padding Margin Mixing" %}

I use padding on the right but uses margin on other side, so vertical scrollbar will take the right padding when necessary. It is a very interesting CSS trick, and it works fine under webkit based browser.
