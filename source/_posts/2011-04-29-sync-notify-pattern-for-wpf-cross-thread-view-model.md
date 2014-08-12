layout: post
title: Sync Notify Pattern for WPF Cross Thread View Model
tags:
  - WPF
  - Data Binding
  - "C#"
  - MVVM
  - UI
  - Multithread
  - View Model
  - Thread
categories: WPF
comments: true
date: 2011-04-29 08:00:00
---
WPF has a powerful data binding mechanism, by which it is easy to implement MVVM and MVC pattern for UI application.
But thing gets not so beautiful once you introduced multi-thread into the app. Somehow, it means you have to manually call dispatcher method to synchronize the thread context, or else INotifyPropertyChanged contract causes cross thread violation, which is likely to drive UI component throw exception. But tons of calls to Dispatcher.Invoke or Dispatcher.BeginInvoke make you code ugly and hard to maintain. And it is boring to call dispatcher every time you try to write view model properties.

Is there any solution to this embarrassed situation?
The answer is Sync Notify pattern.

By analyzing the WPF data binding data flow, you can find the best point to behave the thread synchronization is at the boundary of your code and WPF implementation, which is the property changed  event raiser. To sync the thread context here makes your code clean and effective.

Typically, you might implement the `INotifyPropertyChanged` in following way:

{% codeblock INofityPropertyChanged Implementation lang:csharp %}
        #region INotifyPropertyChanged Members
 
        public event PropertyChangedEventHandler PropertyChanged;
        protected void Notify(string propertyName)
        {
            if (PropertyChanged != null)
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
        }
 
        #endregion
{% endcodeblock %}

And you might implement the property of view model as following:

{% codeblock Notify Property Decalration lang:csharp %}
        #region Notify Property ViewModelProperty
        private string viewModelPropertyBackField;
        public string ViewModelProperty
        {
            get { return viewModelPropertyBackField; }
            set
            {
                if (viewModelPropertyBackField == value)
                    return;
 
                viewModelPropertyBackField = value;
                Notify("ViewModelProperty");
            }
        }
        #endregion
{% endcodeblock %}

This implementation works perfect in single thread context , but fails in multi-thread context. So we introduce a new event raiser implementation, which synchronize the thread context before raising the event:

{% codeblock SyncNotify lang:csharp %}
        #region Sync INotifyPropertyChanged Members
 
        protected void SyncNotify(string propertyName, bool wait = false, Dispatcher dispatcher = null)
        {
            if (PropertyChanged == null)
                return;
 
            dispatcher = dispatcher ?? System.Windows.Threading.Dispatcher.CurrentDispatcher;
 
            if (dispatcher.Thread == Thread.CurrentThread)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
            else
            {
                if (wait)
                {
                    dispatcher.Invoke(PropertyChanged, this, new PropertyChangedEventArgs(propertyName));
                }
                else
                {
                    dispatcher.BeginInvoke(PropertyChanged, this, new PropertyChangedEventArgs(propertyName));
                }
            }
        }
 
        #endregion
{% endcodeblock %}

This method check the whether it is running on the same thread as dispatcher, it not it synchronize the thread.  It works perfect in most common cases.
But this implementation requires you to add some new code to the view model, and requires the event works as a delegate. This restriction sometime hurt, such as when you try to derive your view model from `ObservableCollection<T>`.
`ObservableCollection<T>` declared PropertyChanged event, but implemented it explicitly, which means you won't be able to raise the event by calling PropertyChanged directly. Instead, you need to call protected method OnPropertyChanged.

In such cases, you need the following implementation powered by extension method:

{% codeblock SyncNotifyExtension lang:csharp %}
    public static class SyncNotifyExtension
    {
        public static void SyncNotify(this INotifyPropertyChanged host, string propertyName, Action<PropertyChangedEventArgs> eventRaiser, bool wait = false, Dispatcher dispatcher = null)
        {
            Contract.Requires<ArgumentNullException>(host != null);
            Contract.Requires<ArgumentException>(string.IsNullOrWhiteSpace(propertyName));
            Contract.Requires<ArgumentNullException>(eventRaiser != null);
 
            dispatcher = dispatcher ?? System.Windows.Threading.Dispatcher.CurrentDispatcher;
 
            if (dispatcher.Thread == Thread.CurrentThread)
            {
                eventRaiser(new PropertyChangedEventArgs(propertyName));
            }
            else
            {
                if (wait)
                {
                    dispatcher.Invoke(eventRaiser, new PropertyChangedEventArgs(propertyName));
                }
                else
                {
                    dispatcher.BeginInvoke(eventRaiser, new PropertyChangedEventArgs(propertyName));
                }
            }
        }
 
        public static void SyncNotify(this INotifyPropertyChanged host, string propertyName, Action<string> eventRaiser, bool wait = false, Dispatcher dispatcher = null)
        {
            Contract.Requires<ArgumentNullException>(host != null);
            Contract.Requires<ArgumentException>(string.IsNullOrWhiteSpace(propertyName));
            Contract.Requires<ArgumentNullException>(eventRaiser != null);
 
            dispatcher = dispatcher ?? System.Windows.Threading.Dispatcher.CurrentDispatcher;
 
            if (dispatcher.Thread == Thread.CurrentThread)
            {
                eventRaiser(propertyName);
            }
            else
            {
                if (wait)
                {
                    dispatcher.Invoke(eventRaiser, propertyName);
                }
                else
                {
                    dispatcher.BeginInvoke(eventRaiser, propertyName);
                }
            }
        }
 
        public static void SyncNotify(this INotifyPropertyChanged host, string propertyName, Action<object, PropertyChangedEventArgs> eventRaiser, bool wait = false, Dispatcher dispatcher = null)
        {
            Contract.Requires<ArgumentNullException>(host != null);
            Contract.Requires<ArgumentException>(string.IsNullOrWhiteSpace(propertyName));
            Contract.Requires<ArgumentNullException>(eventRaiser != null);
 
            dispatcher = dispatcher ?? System.Windows.Threading.Dispatcher.CurrentDispatcher;
 
            if (dispatcher.Thread == Thread.CurrentThread)
            {
                eventRaiser(host, new PropertyChangedEventArgs(propertyName));
            }
            else
            {
                if (wait)
                {
                    dispatcher.Invoke(eventRaiser, host, new PropertyChangedEventArgs(propertyName));
                }
                else
                {
                    dispatcher.BeginInvoke(eventRaiser, host, new PropertyChangedEventArgs(propertyName));
                }
            }
        }
 
        public static void SyncNotify(this INotifyPropertyChanged host, string propertyName, Action<object, string> eventRaiser, bool wait = false, Dispatcher dispatcher = null)
        {
            Contract.Requires<ArgumentNullException>(host != null);
            Contract.Requires<ArgumentException>(string.IsNullOrWhiteSpace(propertyName));
            Contract.Requires<ArgumentNullException>(eventRaiser != null);
 
            dispatcher = dispatcher ?? System.Windows.Threading.Dispatcher.CurrentDispatcher;
 
            if (dispatcher.Thread == Thread.CurrentThread)
            {
                eventRaiser(host, propertyName);
            }
            else
            {
                if (wait)
                {
                    dispatcher.Invoke(eventRaiser, host, propertyName);
                }
                else
                {
                    dispatcher.BeginInvoke(eventRaiser, host, propertyName);
                }
            }
        }
    }
{% endcodeblock %}

These extension methods can be called inside the view model, and it ensures that the event is raised on the dispatcher thread.
Since these extension methods uses delegate to invoke the event raiser, so it is unnecessary to worry about the accessibility of the event raiser, event it is declared as protected or private. And 4 overloads can handle most common event raisers.
