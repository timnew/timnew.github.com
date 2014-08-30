(function() {
  var mutate, mutator;

  mutator = {
    mutate: function(instance, klass, args) {
      if (args == null) {
        args = [];
      }
      if (typeof instance !== 'object') {
        throw 'Instance must be an object';
      }
      if (typeof klass !== 'function') {
        throw 'Klass must be a class';
      }
      instance.__proto__ = klass.prototype;
      klass.apply(instance, args);
      return instance;
    },
    fixForIE: function(instance, klass, args) {
      var k, v, _ref;
      if (args == null) {
        args = [];
      }
      if (typeof instance !== 'object') {
        throw 'Instance must be an object';
      }
      if (typeof klass !== 'function') {
        throw 'Klass must be a class';
      }
      _ref = klass.prototype;
      for (k in _ref) {
        v = _ref[k];
        if (instance[k] === void 0) {
          instance[k] = v;
        }
      }
      klass.apply(instance, args);
      return instance;
    }
  };

  mutate = {}.__proto__ === void 0 ? (window.console != null ? console.warn('__proto__ is not supported by current browser, fallback to hard-copy approach') : void 0, mutator.fixForIE) : mutator.mutate;

  ko.bindingHandlers.widget = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element, widgetKlass, widgetName;
      widgetKlass = valueAccessor();
      widgetName = widgetKlass.name;
      $element = $(element);
      $element.attr('data-widget', widgetName);
      $element.data('widget', viewModel);
      mutate(viewModel, widgetKlass, [$element]);
      viewModel.bindDom();
      viewModel.enhancePage();
      return viewModel.initialize();
    }
  };

  Widget.prototype.applyBindings = function(viewModel, context) {
    if (viewModel == null) {
      viewModel = this;
    }
    if (context == null) {
      context = this.element[0];
    }
    return ko.applyBindings(viewModel, context);
  };

}).call(this);
