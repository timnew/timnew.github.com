escape = hexo.util.escape

colorRegex = ///^\s*(?:
     \#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]
   | \#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]
   | rgba?\(.*\)
   | hsla?\(.*\)
   )\s*$///

categoryRibbonFilter = (data, callback) ->
  return callback() unless data.categories?

  data.ribbon = {} unless data.ribbon?

  data.ribbon = text: data.ribbon if typeof data.ribbon is 'string'

  ribbon = data.ribbon

  unless ribbon.text?
    ribbon.text = data.categories[0]
    ribbon.link = "/categories/#{escape.filename(ribbon.text, hexo.config.filename_case)}/"

  categoryConfig = hexo.config.category_ribbon?[ribbon.text]

  if categoryConfig?
    if typeof categoryConfig is 'string'
      if categoryConfig.match(colorRegex)
        ribbon.color = categoryConfig
      else
        ribbon.style = categoryConfig
    else
      ribbon.style = categoryConfig.style
      ribbon.color = categoryConfig.color
  else
    console.log "Unknown Category: #{ribbon.text}"

  callback(null, data)

hexo.extend.filter.register 'before_post_render', categoryRibbonFilter
