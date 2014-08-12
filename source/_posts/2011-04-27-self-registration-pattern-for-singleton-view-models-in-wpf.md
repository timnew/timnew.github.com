layout: post
title: Self Registration Pattern for Singleton View Models in WPF
tags:
  - WPF
  - View Model
  - Resource
  - XAML
  - Singleton
  - Pattern
categories: WPF
comments: true
date: 2011-04-27 08:00:00
---
Where to store the Singleton View Model in WPF application, there are 2 common options:

### Store in Resource Dictionary.  
UI Designers prefers to store the WPF View Model into the Resource Dictionary because the objects in Resource Dictionary can be easily referenced in XAML. 
But Developers must hate that way very much! 
To fetch the object in Resource Dictionary from code behind must call the "FindResource" method of DependencyObject.  And codes with tons of calls to "FindResource" method are ugly and very low efficient. The situation is worse since the accessibility to object in resource dictionary  is also constrained by the Resource Scope, which means it is almost impossible to fetch the object from business logic. 

### Store in the Static Class.  
I preferred to store the View Model in static class which is available globally. Developer can fetch the object by calling the static method, and designer also can fetch the object by using {x:Static} psudo-tag.
But it is still inconvenient somehow for designer, and it is somehow hard to provide design-time mockup data in this way.

For the previous 2 solutions, the pros and cons are obvious. But is it possible to combine these 2 approaches together to gains all the advantages but all the disadvantages. 
The answer is Self-Registration Pattern.

The basic idea for Self-Registration Pattern is simple. It is obvious that we prefers to store the view models in Resource Dictionary, but we also want to access that object from Code Behind by calling static method.

So I designed the ViewModel class as following:

{% codeblock Self-Register View-Model lang:csharp %}
    public class ViewModel
    {
        #region Self Registration
 
        public static ViewModel Default { get; private set; }


        public ViewModel()
        {
            Default = this;
        }
 
        #endregion
    }
{% endcodeblock %}

{% codeblock View-Model Declaration  lang:xml %}
	<vm:ViewModel x:Key="ViewModel"/>
{% endcodeblock %}

You can see, the ViewModel has a globally visible static property named Default, and the class set the Default property to itself in its constructor.
Which means once the View Model is initialized in Resource Dictionary, it also set the instance reference to Default,
So designer can reference the view model easily with StaticResource Tag

{% codeblock Reference View-Model from XAML lang:xml %}
    <Control Property="{StaticResource ViewModel}"/>
{% endcodeblock %}

And Developer also can access the view model by calling Static Property

{% codeblock Reference View-Model from C# lang:csharp %}
     ViewModel.Default
{% endcodeblock %}
