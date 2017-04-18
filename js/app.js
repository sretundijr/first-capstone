// alert("hello");

var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';

var similarArtists = [];


function getDataFromTasteDive(searchTerm, callback) {
  var query = {
    q: searchTerm,
    type: "music",
    info: 1,
    limit: 10,
    key: "267313-capstone-T3SYRQMZ" //you see nothing
  }
    // console.log($.getJSON(TASTE_DIVE_BASE_URL, query, callback));
    $.getJSON(TASTE_DIVE_BASE_URL, query, callback);
}

function tasteDiveResults(data){
    data.Similar.Results.forEach(function(item, index){
        similarArtists.push(item);
    })
    showResults(similarArtists);
}

function showResults(similarArtists){
    console.log(similarArtists);
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('.js-query').val();
    getDataFromTasteDive(query, tasteDiveResults);
  });
}

$(function(){watchSubmit();});