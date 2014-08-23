var _ = require('lodash');

function tagClouds(tags, options) {
  if (!options){
    options = tags;
    tags = this.site.tags;
  }

  if (!tags.length) return '';

  options = _.extend({
    min_font: 10,
    max_font: 20,
    unit: 'px',
    amount: 40, // 0 = unlimited
    orderby: 'name', // name, length, random
    order: 1
  }, options);

  var min = options.min_font,
    max = options.max_font,
    orderby = options.orderby,
    order = options.order,
    unit = options.unit,
    self = this;

  if (options.amount) tags = tags.sort('length', -1).limit(options.amount);

  if (orderby === 'random' || orderby === 'rand'){
    tags = tags.random();
  } else {
    tags = tags.sort(orderby, order);
  }

  var sizes = [];

  tags.sort('length').each(function(tag){
    var length = tag.length;

    if (sizes.indexOf(length) > -1) return;

    sizes.push(length);
  });

  var length = sizes.length,
    result = '';

  tags.each(function(tag){
    var index = sizes.indexOf(tag.length),
      size = min + (max - min) / (length - 1) * index;

    result += '<a href="' + self.url_for(tag.path) + '" style="font-size: ' + size.toFixed(2) + unit + ';">' + tag.name.replace(/\s/g, '&nbsp;') + '</a>';
  });

  return result;
};

hexo.extend.helper.register('tagcloud', tagClouds);
