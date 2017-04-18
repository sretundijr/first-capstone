// alert("hello");

var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';


function getDataFromApi(searchTerm, callback) {
  var query = {
    q: searchTerm,
    limit: 10,
    key: "267313-capstone-T3SYRQMZ"
  }
    // console.log($.getJSON(TASTE_DIVE_BASE_URL, query, callback));
    $.getJSON(TASTE_DIVE_BASE_URL, query, callback);
}

function displayApiResults(data) {

  console.log(data);
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('.js-query').val();
    getDataFromApi(query, displayApiResults);
  });
}

$(function(){watchSubmit();});