var _ = require('lodash'),
  moment = require('moment');

function list_archives(options){
  options = _.extend({
    type: 'monthly',
    order: -1,
    show_count: true,
    style: 'list',
    separator: ', ',
    class: 'archive'
  }, options);

  if (!options.format){
    if (options.type === 'monthly'){
      options.format = 'MMMM YYYY';
    } else {
      options.format = 'YYYY';
    }
  }

  var style = options.style,
    showCount = options.show_count,
    className = options.class,
    type = options.type,
    format = options.format,
    archiveDir = this.config.archive_dir,
    result = '',
    arr = [],
    self = this;

  if (style === 'list'){
    result = '<ul class="' + className + '-list">';
  } else {
    result = '';
  }

  var posts = this.site.posts.sort('date', -1);

  if (!posts.length) return '';

  var item = function(href, name, length){
    if (style === 'list'){
      arr.push('<li class="' + className + '-list-item">' +
        '<a class="' + className + '-list-link" href="' + self.url_for(archiveDir + '/' + href) + '">' + name + '</a>' +
        (showCount ? '<span class="' + className + '-list-count">' + length + '</span>' : '') +
        '</li>');
    } else {
      arr.push('<a class="' + className + '-link" href="' + self.url_for(archiveDir + '/' + href) + '">' +
        name +
        (showCount ? '<span class="' + className + '-count">' + length + '</span>' : '') +
        '</a>');
    }
  };

  var newest = posts.first().date,
    oldest = posts.last().date;

  for (var i = oldest.year(); i <= newest.year(); i++){
    var yearly = posts.find({date: {$year: i}});

    if (!yearly.length) continue;

    if (type === 'yearly'){
      item(i, moment({y: i}).format(format), yearly.length);

      continue;
    }

    for (var j = 1; j <= 12; j++){
      var monthly = yearly.find({date: {$year: i, $month: j}});

      if (!monthly.length) continue;

      item(i + '/' + (j < 10 ? '0' + j : j) + '/', moment({year: i, month: j - 1}).format(format), monthly.length);
    }
  }

  if (options.order == -1 || options.order === 'desc') arr.reverse();

  if (style === 'list'){
    result += arr.join('') + '</ul>';
  } else {
    result += arr.join(options.separator);
  }

  return result;
}

hexo.extend.helper.register('list_archives', list_archives);
