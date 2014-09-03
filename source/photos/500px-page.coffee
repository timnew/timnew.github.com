_500px.init
  sdk_key: '5992835139899cd226bae4ac9b7fe4c08412afaa'

CategoryTexts =
  0 : "Uncategorized"
  10: "Abstract"
  11: "Animals"
  5 : "Black and White"
  1 : "Celebrities"
  9 : "City and Architecture"
  15: "Commercial"
  16: "Concert"
  20: "Family"
  14: "Fashion"
  2 : "Film"
  24: "Fine Art"
  23: "Food"
  3 : "Journalism"
  8 : "Landscapes"
  12: "Macro"
  18: "Nature"
  4 : "Nude"
  7 : "People"
  19: "Performing Arts"
  17: "Sport"
  6 : "Still Life"
  21: "Street"
  26: "Transportation"
  13: "Travel"
  22: "Underwater"
  27: "Urban Exploration"
  25: "Wedding"

class @Photo500px extends Widget
  constructor: (element) ->
    super

  bindDom: ->
    @exifPanel = @element.find('.exif')
    @exifButton = @element.find('.exif-button')
    @scorePanel = @element.find('.score')
    @image = @element.find('img')

  enhancePage: ->
    @exifButton.click(@toggleExif)
               .hover(@showExif, @restoreExif)

    @image.hover(@showScore, @hideScore)

  initialize: ->
    @takenAt = new Date(@taken_at).toLocaleDateString()
    @fullUrl = "http://500px.com" + @url
    @categoryText = CategoryTexts[@category]

  toggleExif: =>
    @exifButton.toggleClass('on')
    @restoreExif()

  showExif: =>
    @exifPanel.toggleClass('on', true)

  restoreExif: =>
    @exifPanel.toggleClass('on', @exifButton.is('.on'))

  showScore: =>
    @scorePanel.addClass('on')

  hideScore: =>
    @scorePanel.removeClass('on')

class @Gallery500px extends Widget
  constructor: (element) ->
    super
    @totalPages = ko.observable(0)
    @currentPage = ko.observable(0)
    @photos = ko.observableArray()

  bindDom: ->
    @applyBindings()
    $(window).on('hashchange', @hashChanged)

  parseHash: =>
    result = {}

    items = location.hash[1..-1].split('&')

    for item in items
      [k,v] = item.split('=')
      if k? and v?
        result[k.toLowerCase()] = v

    result

  hashChanged: =>
    hash = @parseHash()
    @reload(hash.username) if hash.username?

  initialize: ->
    @reload('timnew')

  reload: (username) ->
    _500px.api '/photos', { feature: 'user', username: username, image_size: [3], page: 1, rpp: 100 } , (response) =>
      return if response.error

      data = response.data
      console.log data

      @totalPages(data.total_pages)
      @currentPage(data.current_page)
      @photos(data.photos)
