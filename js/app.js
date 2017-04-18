// alert("hello");

var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';

var SPOTIFY_BASE_URL = "https://api.spotify.com/v1/search";

var similarArtists = [];

var spotifyData = [];

function getDataFromTasteDive(searchTerm, callback) {
  var query = {
    q: searchTerm,
    type: "artist",
    info: 1,
    limit: 10,
    key: "267313-capstone-T3SYRQMZ" //you see nothing
  }
    // console.log($.getJSON(TASTE_DIVE_BASE_URL, query, callback));
    $.getJSON(TASTE_DIVE_BASE_URL, query, callback);
}

function getDataFromSpotify(band, callback){
    var query = {
        q: band,
        type: "artist",
        limit: 1
    }
    // console.log("here");
    // console.log($.getJSON(SPOTIFY_BASE_URL, query, callback));
    $.getJSON(SPOTIFY_BASE_URL, query, callback);
}

function spotifyResults(data){
    // data.
    // alert("here");
    // console.log(data)
    spotifyData.push(data);
    // console.log(data.artists.items[0].name);
    console.log(spotifyData);
}

function tasteDiveResults(data){
    data.Similar.Results.forEach(function(item, index){
        similarArtists.push(item);
        // console.log(similarArtists[index].Name)
        // getDataFromSpotify(similarArtists[index].Name, spotifyResults);
    })
    sendResultsToSpotify(similarArtists);
}

function sendResultsToSpotify(similarArtists){
    // console.log(similarArtists);
    similarArtists.forEach(function(item, index){
        getDataFromSpotify(item.Name, spotifyResults);
    })
}

function watchSubmit() {
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('.js-query').val();
    getDataFromTasteDive(query, tasteDiveResults);
  });
}

$(function(){watchSubmit();});