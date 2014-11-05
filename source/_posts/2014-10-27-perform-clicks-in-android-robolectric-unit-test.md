layout: post
title: Perform Clicks in Android Robolectric Unit Test
date: 2014-10-27T16:17:13.000Z
categories:
  - Programming
  - Android
tags:
  - robolectric
  - android
  - unit test
  - list view
  - long click
  - item
  - click
  - ui action
---

Robolectric is an awesome library that makes UI unit test on Android a lot easier and faster. In UI test, one of the most basic thing is to simulate user interaction, such as clicking a button.

## Click on individual View

`Click` should be the most basic user interaction, besides invokeing the `View.performClick()` method, Robolectric provides a more smarter version `Robolectric.clickOn(View)`, which checks the view visibility and `enabled` status before actually "click" the view. If a view is either not visible or disabled, the click action will not be performed. This mechanism is useful to avoid some silly cases in automated tests.

## Long Click on individual View

`Long click` is a more advanced `click` action. To simulate a long click action, `View.performLongClick()` can be invoked. But since Robolectric doesn't provide any long click helper, make sure you do it by yourself, including checking whether view is `long-clickable`, which usually will be set manually or more often, when `View.setOnLongClickListener` is invoked; view is visible and enabled as what `click` does. Although `Long click` is avaible to use, but from my experience, long click on a individual view is rarely used in real UI design, instead `long click` is usually performed on an item of list view or grid view. This is the trickest case that I'll leave it to the last.

## Click on item of List/Grid

`Click` on List View or Grid View item. Well, idally, this shouldn't be so much different than click on a indiviual view. But in Android implementation, item click is handled by the list view with a much more complicated API. To perform an `item click`, `boolean performItemClick(View v, int position, long id) ` can be invoked. `performItemClick` requires 3 parameters, the first one is the view being clicked, the second one is the position of clicked view's corresponding data item in adapter and the last is the if of clicked view's corresponding data item. Complicated, isn't it?

In Android implementation, item view displayed in ListView/GridView is actually provided by its adapter. Adapter works like a presenter in MVP pattern that creates/update item view based on the item data it holds. It also provides the id for the item. So to perform a item click, besides the ListView/GridView, you also need its adapter.

Following implementation explains how it works:

```java
public static void clickItem(AbsListView listView, int position) {
    ListAdapter adapter = listView.getAdapter();
    View itemView = adapter.getView(position, null, listView);
    listView.performItemClick(itemView, position, adapter.getItemId(position));
}
```
In the code, `AbsListView` is the base class of `ListView` and `GridView`. To click the item, you need
1. Get the adapter of the `AbsListView`
2. Create an `item view` for specific `position` with adapter
3. Calculate the `item id` of corresponding `position`
4. Invoke `performItemClick` method with data we got before.

In the implementation, for simplicity reason, we ignored some cases, such as convertView reusing. From my experience, in most cases, it won't impact the functionality, so we don't need to worry about it, unless you clearly know that matters, then you need to cover them in your tests.

## Long click and item of List/Grid

Well, this action is also not a commonly used. It is only used in limited cases, such as selecting multiple item or displaying context menu for specific item.
To perform a long click on the item is the most trickest case. In previous 3 cases, we either directly or indrectly depends on `View.perform***Click` method. But not sure why, android doesn't provide similar public API method of `item long click`. By diving into Anrdoid source code, we can figure out that Item Long Click isn't really handled by ListView itself, instead it is handled by a `Runnable` named `CheckForKeyLongPress`. To invoke method on this object isn't that streight forward, and might involes unnecessary multithread issue.

I just want to click a item, why I have to deal with these unnecessary complicates? So I learnt from the `CheckForKeyLongPress` implementation, and implmented my own "API":

```java
public static void longClickItem(AbsListView listView, int position) {
    if (!listView.isLongClickable())
        return;

    OnItemLongClickListener listener = listView.getOnItemLongClickListener();
    if (listener == null)
        return;

    ListAdapter adapter = listView.getAdapter();
    View itemView = adapter.getView(position, null, listView);

    listener.onItemLongClick(listView, itemView, position, adapter.getItemId(position));
    listView.performHapticFeedback(LONG_PRESS);
}
```

My main purpose of perform a click is to trigger the corresponding listener, so I tried to invoke the listener directly with some necessary pre-checks. This aporach will not triggers these UI effects, but I assume it can meet most test cases.

## APPENDIX UIActions helper class
```java
package me.timnew.robolectric.utils;

import android.app.Activity;
import android.app.Fragment;
import android.view.View;
import android.widget.AbsListView;
import android.widget.ListAdapter;

import org.robolectric.Robolectric;

import static android.view.HapticFeedbackConstants.LONG_PRESS;
import static android.widget.AdapterView.OnItemLongClickListener;

public class UiActions {
    public static boolean clickOn(View view) {
        return Robolectric.clickOn(view);
    }

    public static boolean clickOn(Activity activity, int targetViewId) {
        return Robolectric.clickOn(activity.findViewById(targetViewId));
    }

    public static boolean clickOn(View parentView, int targetViewId) {
        return Robolectric.clickOn(parentView.findViewById(targetViewId));
    }

    public static boolean clickOn(Fragment fragment, int targetViewId) {
        //noinspection ConstantConditions
        return Robolectric.clickOn(fragment.getView().findViewById(targetViewId));
    }

    public static void pressBackButton(Activity currentActivity) {
        if (currentActivity.getFragmentManager().getBackStackEntryCount() > 0)
            currentActivity.getFragmentManager().popBackStackImmediate();
        else
            currentActivity.onBackPressed();
    }

    public static void clickItem(AbsListView listView, int position) {
        ListAdapter adapter = listView.getAdapter();
        View itemView = adapter.getView(position, null, listView);
        listView.performItemClick(itemView, position, adapter.getItemId(position));
    }

    public static void longClickItem(AbsListView listView, int position) {
        if (!listView.isLongClickable())
            return;

        OnItemLongClickListener listener = listView.getOnItemLongClickListener();
        if (listener == null)
            return;

        ListAdapter adapter = listView.getAdapter();
        View itemView = adapter.getView(position, null, listView);

        listener.onItemLongClick(listView, itemView, position, adapter.getItemId(position));
        listView.performHapticFeedback(LONG_PRESS);
    }
}
```
