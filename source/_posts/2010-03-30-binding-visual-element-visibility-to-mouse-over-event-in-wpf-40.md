---
layout: post
title: "Binding Visual Element Visibility to Mouse Over Event in WPF 4.0"
description: ""
category: "WPF"
tags: ["WPF", "Event", "XAML", "UI", "Binding", "Data Binding"]
---

I'm working on an user interface demo application in WPF.
I have a group of expander on the ui, and I want the expander show some descriptive text besides its caption while the mouse over it.
I used a TextBlock element to display the descriptive text, which is a child element in the control's visual tree.

At first, I tried to use Style and Trigger to achieve this effect, but failed. Since Style Trigger apply its modification to the exactly same element that fires the trigger, which means if I would like to modify the property TextBlock, I can only fire the trigger by moving mouse over the TextBlock it self but the control that contains the TextBlock.

I tried some other ways, but all failed. Finally, I found I can achieve the effect by Data Binding!
Since TextBlock's Visibility Property is a Dependency Property, and the TextBlock is contained by the Expander Control!
So we can Bind TextBlock's Visibility Property to Expander Control's IsMouseOver Property!
To achieve this, we need Relative Binding Source to locate TextBlock's ancestor element, Expander Control.
Then we need BooleanToVisibilityConverter to convert the bool type value to Visibility value.

**Here is the Xaml Code:**

{% codeblock Data Template lang:xml %}
<BooleanToVisibilityConverter x:Key="BooleanToVisibilityConverter" />

<HierarchicalDataTemplate DataType="{x:Type m:CategoryItem}"
                          ItemsSource="{Binding Properties}">
    <Border>
        <Expander ToolTip="{Binding Tooltip}" IsExpanded="True">
            <Expander.Header>
                <StackPanel Orientation="Horizontal" >
                    <TextBlock Text="{Binding Name}"/>
                    <TextBlock Name="HeaderDescription"
                               Margin="10,0,0,0"
                               Text="{Binding Description}"
                               Foreground="Green" 
                               Visibility="{Binding RelativeSource={RelativeSource FindAncestor, AncestorType={x:Type Expander}}, Path=IsMouseOver, Converter={StaticResource BooleanToVisibilityConverter}}"/>
                </StackPanel>
            </Expander.Header>


            <ListBox 
                DataContext="{Binding Properties}" 
                ItemsSource="{Binding}"
                IsSynchronizedWithCurrentItem="True"/>
        </Expander>
    </Border>
</HierarchicalDataTemplate>
{% endcodeblock %}