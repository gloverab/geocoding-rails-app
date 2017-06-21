$(document).on('turbolinks:load', function() {
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
  hideLoading()
  debugger
  if (data.status == "ZERO_RESULTS") {
    flashZero()
  } else if (data.status == "OVER_QUERY_LIMIT") {
    clearFields()
    flashQueryLimit()
  } else if (data.status == "REQUEST_DENIED") {
    flashRequestDenied()
  } else if (data.status == "INVALID_REQUEST") {
    flashInvalid()
  }
  
  else {
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
}

function flashZero() {
  $('#flash-message').html("Sorry! There were no results for the address you entered. Try providing a little more information.").delay(500).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashQueryLimit() {
  $('#flash-message').html("The daily quota for geocoding has been reached. Please try again tomorrow.").delay(500).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashRequestDenied() {
  $('#flash-message').html("Your request was denied.").delay(500).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashInvalid() {
  $('#flash-message').html("We need a bit more information to make that request. Try filling out more of the fields up top.").delay(500).fadeOut(1000, function() {
    $(this).empty().show()
  })
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
