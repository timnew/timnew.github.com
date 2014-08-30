_500px.init
  sdk_key: '5992835139899cd226bae4ac9b7fe4c08412afaa'

class @Photo500px extends Widget
  constructor: (element) ->
    super

  bindDom: ->
    @exifPanel = @element.find('.exif')
    @exifButton = @element.find('.exif-button')

  enhancePage: ->
    @exifButton.click(@toggleExif)
               .hover(@showExif, @restoreExif)

  initialize: ->
    @takenAt = new Date(@taken_at).toLocaleDateString()
    @element.find('.fluidbox').fluidbox()

  toggleExif: =>
    @exifButton.toggleClass('on')
    @restoreExif()

  showExif: =>
    @exifPanel.toggleClass('on', true)

  restoreExif: =>
    @exifPanel.toggleClass('on', @exifButton.is('.on'))

class @Gallery500px extends Widget
  constructor: (element) ->
    super
    @totalPages = ko.observable(0)
    @currentPage = ko.observable(0)
    @photos = ko.observableArray()

  bindDom: ->
    @applyBindings()

  initialize: ->
    @reload()

  reload: ->
    _500px.api '/photos', { feature: 'user', username:'timnew', image_size:[3, 4], page: 1 }, (response) =>
      return if response.error

      data = response.data
      console.log data

      @totalPages(data.total_pages)
      @currentPage(data.current_page)
      @photos(data.photos)
