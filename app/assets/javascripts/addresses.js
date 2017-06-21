$(document).on('ready', function() {
  attachListeners()
})

function attachListeners() {
  $('#address-submit').on('click', function(e){
    submitAddress(e)
  })
}

function submitAddress(e) {
  e.preventDefault()
  showLoading()

  var rootUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="
  var serializedFormArr = $('#address-form').serialize().split('%5D=')
  var streetAddress = serializedFormArr[1].split('&')[0]
  var addressLocality = serializedFormArr[2].split('&')[0] || ''
  var addressRegion = serializedFormArr[3].split('&')[0] || ''
  var postalCode = serializedFormArr[4].split('&')[0] || ''

  var fullUrl = rootUrl + streetAddress + ",+" + addressLocality + ",+" + addressRegion + ",+" + postalCode + "&key=" + "AIzaSyAPxDo80fkkeup137csDYbswPzUCA636J0"

  $.ajax({
    url: fullUrl,
    type: "GET",
    success: function(data) {
      createAddress(data)
    }
  })
}

function createAddress(data) {

  var values = {
    "address[formatted_address]": data.results[0].formatted_address,
    "address[latitude]": data.results[0].geometry.location.lat,
    "address[longitude]": data.results[0].geometry.location.lng
  }
  
  $.ajax({
    url: '/addresses/',
    type: "POST",
    data: values,
    dataType: 'script',
    success: function() {
      hideLoading()
    }
  }).done(hideLoading).done(clearFields)
}

function flashSuccess() {

}

function showLoading() {
  $('#loading-bar').css({ "visibility": "visible"})
}

function hideLoading() {
  $('#loading-bar').css({ "visibility": "hidden"})
}

function clearFields() {
  document.getElementById("address-form").reset()
}
