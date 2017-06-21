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
    timeout: 1000,
    success: function(data) {
      createAddress(data)
    },
    error: function(request, status) {
      flashProblemConnecting()
      hideLoading()
    }
  })
}

function createAddress(data) {
  hideLoading()
  
  if (data.status === "OK") {
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
    }).done(clearFields).done(flashSuccess)
  } else if (data.status === "ZERO_RESULTS") {
    flashZero()
  } else if (data.status === "OVER_QUERY_LIMIT") {
    flashQueryLimit()
  } else if (data.status === "REQUEST_DENIED") {
    flashRequestDenied()
  } else {
    flashUnknown()
  }
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

// FLASH MESSAGES FOR ALL STATUSES

function flashSuccess() {
  $('#flash-message').html("Your request was successfully added to the database below.").delay(1000).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashZero() {
  $('#flash-message').html("Sorry! There were no results for the address you entered. Try providing a little more information.").delay(1000).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashQueryLimit() {
  $('#flash-message').html("The daily quota for geocoding has been reached. Please try again tomorrow.").delay(1000).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashProblemConnecting() {
  $('#flash-message').html("There was a problem connecting to Google. Please check your internet connection and try again.").delay(1000).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashRequestDenied() {
  $('#flash-message').html("Your request was denied.").delay(1000).fadeOut(1000, function() {
    $(this).empty().show()
  })
}

function flashUnknown() {
  $('#flash-message').html("There was an unknown error. Please try again later.").delay(1000).fadeOut(1000, function() {
    $(this).empty().show()
  })
}