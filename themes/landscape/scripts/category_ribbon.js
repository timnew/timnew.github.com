var hexoUtil = require('hexo-util')

var colorRegex = /^\s*(?:\#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]|\#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]|rgba?\(.*\)|hsla?\(.*\))\s*$/;

function categoryRibbonFilter(data) {
  if (data.categories == null || data.categories.length === 0) {
    return data;
  }

  if (data.ribbon == null) {
    data.ribbon = {};
  }
  if (typeof data.ribbon === 'string') {
    data.ribbon = {
      text: data.ribbon
    };
  }

  var ribbon = data.ribbon;
  if (ribbon.text == null) {
    var category = data.categories.first()
    ribbon.text = category.name;
    ribbon.link = category.permalink;
  }
  var categoryConfig = undefined
  if (hexo.config.category_ribbon != null) {
    categoryConfig = hexo.config.category_ribbon[ribbon.text]
  }
  if (categoryConfig != null) {
    if (typeof categoryConfig === 'string') {
      if (categoryConfig.match(colorRegex)) {
        ribbon.color = categoryConfig;
      } else {
        ribbon.style = categoryConfig;
      }
    } else {
      ribbon.style = categoryConfig.style;
      ribbon.color = categoryConfig.color;
    }
  } else {
    console.log("Unknown Category: " + ribbon.text);
  }
  return data;
};

hexo.extend.filter.register('before_post_render', categoryRibbonFilter);
