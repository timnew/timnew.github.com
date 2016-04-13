(function() {
  var $, global, normalizeScope,
    __slice = [].slice;

  if (this.Widget != null) {
    return;
  }

  if (this.console == null) {
    this.console = {
      warn: function() {},
      error: function() {}
    };
  }

  if (typeof global === "undefined" || global === null) {
    global = this;
  }

  $ = this.jQuery;

  if ($ == null) {
    console.error('jQuery is not loaded');
    return;
  }

  this.Widget = (function() {
    function Widget(element) {
      this.element = element;
      this.element.data('widget', this);
    }

    Widget.prototype.bindDom = function() {};

    Widget.prototype.enhancePage = function() {};

    Widget.prototype.initialize = function() {};

    Widget.prototype.findWidgets = function(finder, selector) {
      var item, _i, _len, _ref, _results;
      _ref = this.element[finder].call(this.element, selector);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push($(item).data('widget'));
      }
      return _results;
    };

    Widget.prototype.findWidget = function(finder, selector) {
      return this.element[finder].call(this.element, selector).data('widget');
    };

    Widget.prototype.findSubWidget = function(selector) {
      if (selector == null) {
        selector = '[data-widget]:first';
      }
      return this.findWidget('find', selector);
    };

    Widget.prototype.findSubWidgets = function(selector) {
      if (selector == null) {
        selector = '[data-widget]';
      }
      return this.findWidgets('find', selector);
    };

    Widget.prototype.findParentWidget = function(selector) {
      if (selector == null) {
        selector = '[data-widget]:first';
      }
      return this.findWidget('parents', selector);
    };

    Widget.prototype.findParentWidgets = function(selector) {
      if (selector == null) {
        selector = '[data-widget]';
      }
      return this.findWidgets('parents', selector);
    };

    Widget.prototype.findSubWidgetByType = function(widgetType) {
      return this.findWidget('find', "[data-widget='" + widgetType + "']:first");
    };

    Widget.prototype.findSubWidgetsByType = function(widgetType) {
      return this.findWidgets('find', "[data-widget='" + widgetType + "']");
    };

    Widget.prototype.findParentWidgetByType = function(widgetType) {
      return this.findWidget('parents', "[data-widget='" + widgetType + "']:first");
    };

    Widget.prototype.findParentWidgetsByType = function(widgetType) {
      return this.findWidgets('parents', "[data-widget='" + widgetType + "']");
    };

    Widget.prototype.bindWidgetParts = function(context, filter, attrName) {
      var $part, name, part, _i, _len, _ref;
      if (context == null) {
        context = this;
      }
      if (filter == null) {
        filter = '[data-widget-part]';
      }
      if (attrName == null) {
        attrName = 'data-widget-part';
      }
      _ref = this.element.find(filter);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        $part = $(part);
        if ($part.parents('[data-widget]:first')[0] === this.element[0]) {
          name = $part.attr(attrName);
          if ($part.is('[data-widget]')) {
            context[name] = $part.data('widget');
          } else {
            context[name] = $part;
          }
        }
      }
    };

    Widget.prototype.bindActionHandlers = function(selector, context) {
      var $actionHost, actionHost, handlerName, _i, _len, _ref;
      if (selector == null) {
        selector = "[data-action-handler]";
      }
      if (context == null) {
        context = this;
      }
      _ref = this.element.find(selector);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        actionHost = _ref[_i];
        $actionHost = $(actionHost);
        if ($actionHost.parents('[data-widget]:first')[0] === this.element[0]) {
          handlerName = $actionHost.data('actionHandler');
          if (context[handlerName] != null) {
            $actionHost.on('click', (function(_this) {
              return function(e) {
                handlerName = $(e.currentTarget).data('actionHandler');
                e.stopPropagation();
                return context[handlerName].call(context, e);
              };
            })(this));
          } else {
            console.warn("Action handler \"" + handlerName + "\" doesn't exist in widget \"" + this.constructor.name + "\"");
          }
        }
      }
    };

    return Widget;

  })();

  $.extend(Widget, {
    extend: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.unshift(this);
      return $.extend.apply($, args);
    },
    include: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.unshift(this.prototype);
      return $.extend.apply($, args);
    }
  });

  Widget.extend({
    register: function(widget, widgetType) {
      var _ref;
      if (widgetType == null) {
        widgetType = null;
      }
      if (!widgetType) {
        widgetType = (_ref = widget.prototype.widgetType) != null ? _ref : widget.name;
      }
      this.namespace[widgetType] = widget;
      return this;
    },
    find: function(widgetType, includeGlobal) {
      var currentName, widget, widgetTypeNames, _ref;
      if (includeGlobal == null) {
        includeGlobal = true;
      }
      if (typeof widgetType === 'string') {
        widgetTypeNames = widgetType.split('.');
      } else if ($.isArray(widgetType)) {
        widgetTypeNames = widgetType;
      } else {
        console.error("Invalid Widget Type:", widgetType);
        return null;
      }
      currentName = widgetTypeNames.shift();
      if (includeGlobal) {
        widget = (_ref = this.namespace[currentName]) != null ? _ref : global[currentName];
      } else {
        widget = this.namespace[currentName];
      }
      if (widgetTypeNames.length === 0) {
        return widget;
      }
      if (widget == null) {
        return null;
      }
      return widget.find(widgetTypeNames, false);
    },
    createNamespace: function(name) {
      this.namespace = [];
      this.namespace.name = name;
      return this;
    },
    findInNamespaces: function(name, $dom) {
      var containerWidget, isRelative, lastNamespace, parentDom, result, _i, _len, _ref;
      if (name[0] === '@') {
        isRelative = true;
        name = name.slice(1);
      } else {
        isRelative = false;
      }
      result = Widget.find(name);
      if (result != null) {
        return result;
      }
      if (!isRelative) {
        return null;
      }
      lastNamespace = Widget.namespace.name;
      _ref = $dom.parents('[data-widget]');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        parentDom = _ref[_i];
        containerWidget = $(parentDom).data('widget').constructor;
        if (lastNamespace === containerWidget.namespace.name) {
          continue;
        } else {
          result = containerWidget.find(name, false);
          if (result != null) {
            return result;
          }
        }
      }
    }
  });

  normalizeScope = function(scope) {
    if (scope == null) {
      scope = $('body');
    } else if (scope instanceof String) {
      scope = $(scope);
    }
    if (!(scope instanceof jQuery)) {
      console.error("ERROR: Unknown Scope", scope);
    }
    return scope;
  };

  Widget.extend({
    onDomReady: function() {
      if (Widget.activateOnReady()) {
        return Widget.activateWidgets();
      }
    },
    activateOnReady: function(value) {
      if (value != null) {
        return Widget._activateOnReady = !!value;
      } else {
        return Widget._activateOnReady;
      }
    },
    onActivating: function(scope, callback) {
      if (scope == null) {
        scope = null;
      }
      if (scope instanceof Function) {
        callback = scope;
        scope = null;
      }
      scope = normalizeScope(scope);
      return scope.on('widget.activating', callback);
    },
    onActivated: function(scope, callback) {
      if (scope == null) {
        scope = null;
      }
      if (scope instanceof Function) {
        callback = scope;
        scope = null;
      }
      scope = normalizeScope(scope);
      return scope.on('widget.activated', callback);
    },
    activateWidgets: function(scope) {
      var widget, widgets, _i, _j, _k, _len, _len1, _len2;
      if (scope == null) {
        scope = null;
      }
      scope = normalizeScope(scope);
      scope.trigger('widget.activating');
      widgets = [];
      scope.find('[data-widget]').each(function() {
        var $this, widgetConstructor, widgetType;
        $this = $(this);
        widgetType = $this.data('widget');
        if (widgetType == null) {
          console.error("ERROR: Widget name is empty", $this);
          return;
        }
        if (typeof widgetType !== 'string') {
          console.warn('WARNING: Widget is initialized', $this);
          return;
        }
        widgetConstructor = Widget.findInNamespaces(widgetType, $this);
        if (widgetConstructor) {
          return widgets.push(new widgetConstructor($this));
        } else {
          return console.error("ERROR: Unknown widget " + widgetType, $this);
        }
      });
      for (_i = 0, _len = widgets.length; _i < _len; _i++) {
        widget = widgets[_i];
        widget.bindDom();
      }
      for (_j = 0, _len1 = widgets.length; _j < _len1; _j++) {
        widget = widgets[_j];
        widget.enhancePage();
      }
      for (_k = 0, _len2 = widgets.length; _k < _len2; _k++) {
        widget = widgets[_k];
        widget.initialize();
      }
      return scope.trigger('widget.activated', widgets);
    },
    activateWidget: function(widgetDom) {
      var $this, widget, widgetConstructor, widgetType;
      $this = $(widgetDom);
      widgetType = $this.data('widget');
      if (widgetType == null) {
        console.error("ERROR: Widget name is empty", $this);
        return;
      }
      if (typeof widgetType !== 'string') {
        console.warn('WARNING: Widget is initialized', $this);
        return;
      }
      widgetConstructor = Widget.findInNamespaces(widgetType, $this);
      if (widgetConstructor) {
        widget = new widgetConstructor($this);
      } else {
        console.error("ERROR: Unknown widget " + widgetType, $this);
      }
      widget.bindDom();
      widget.enhancePage();
      widget.initialize();
      $this.trigger('widget.activated', [widget]);
      return widget;
    }
  });

  Widget.extend({
    findWidget: function(selector) {
      if (selector == null) {
        selector = '[data-widget]';
      }
      return $(selector).data('widget');
    },
    findWidgets: function(selector) {
      var item, _i, _len, _ref, _results;
      if (selector == null) {
        selector = '[data-widget]';
      }
      _ref = $(selector);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push($(item).data('widget'));
      }
      return _results;
    },
    findWidgetByType: function(widgetType) {
      return $("[data-widget='" + widgetType + "']").data('widget');
    },
    findWidgetsByType: function(widgetType) {
      var item, _i, _len, _ref, _results;
      _ref = $("[data-widget='" + widgetType + "']");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _results.push($(item).data('widget'));
      }
      return _results;
    }
  });

  $(Widget.onDomReady);

  Widget.createNamespace('').activateOnReady(true);

}).call(this);
