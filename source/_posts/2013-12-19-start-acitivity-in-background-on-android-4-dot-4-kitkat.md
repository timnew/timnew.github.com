layout: post
title: Start Acitivity in background on Android 4.4 KitKat
comments: true
categories: android
tags:
  - android
  - activity
  - background
  - kitkat
  - moveTaskToBack
date: 2013-12-19 08:00:00
---
For some reason, Android 4.4 KitKat has changed the implementation while starting activity.

In Android 4.3, `Activity` started from inactive `Activity` is also inactive.
But in Android 4.4, `Activity` started form inactive `Activity` will be brought to front.
Here, `Inactive Activity` means the activity paused by user pressing `Home` button or switch to another app.

This change won't be felt in most sceanrios. But for activities that started from AsyncTask, it does have some significant impact on user experience.

I'm working on a app, that shows a Splash Screen when user logged in. And the Splash screen is implemented with activity.

It takes some time for app to communicate with backend server during the loggin in, and user might press "Home" button to temporarily leave the app during the time.

I don't want the my splash screen to interrupt the user if the user returned to the home screen. So I wish to start the splash screen activity in the background if current acitivity has been brought to background.

It isn't an issue on Android 4.3, but on Android 4.4 KitKat, it causes problem.
I googled this issue and tried the `FLAG_ACTIVITY_MULTIPLE_TASK`, and comfirmed that it is not helping to this issue.

So I have to come up some kind of "hacking" solution as described below:

I add a `isPaused` property to `BaseAcitity`, which is the base class of all activities in my app.

{% codeblock Add isPaused to BaseActivity lang:java %}

public class BaseActivity extends FragmentActivity {

    public static final String START_FROM_PAUSED_ACTIVITY_FLAG = "START_FROM_PAUSED_ACTIVITY_FLAG";

    protected boolean paused = false;

    @Override
    protected void onPause() {
        super.onPause();
        paused = true;
    }

    @Override
    protected void onResume() {
        super.onResume();
        paused = false;
    }

    public boolean isPaused() {
        return paused;
    }
}

{% endcodeblock %}

Then when I start the start the `SplashActivity`, I'll put the `isPaused` value into the intent.

{% codeblock Add flag when start activity lang:java %}
    
Intent intent = new Intent(activity, SplashActivity.class);

boolean isStartingFromBackgroundActivity = activity.isPaused();
intent.putExtra(BaseActivity.START_FROM_PAUSED_ACTIVITY_FLAG, isStartingFromBackgroundActivity);

startActivity(intent);

{% endcodeblock %}

And check isPaused value in `onCreate` callback in `SplashAcitivity`, and push the `SplashAcitivty` to background if the value is true.

{% codeblock Check flag when activity is created lang:java %}
    
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (isStartedFromBackgroundActivity())
        moveTaskToBack(true);
    
}

private boolean isStartedFromBackgroundActivity() {
    return getIntent().getBooleanExtra(START_FROM_PAUSED_ACTIVITY_FLAG, false);
}

{% endcodeblock %}