// alert("hello");

// var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';
var TASTE_DIVE_BASE_URL = 'https://private-8723d-tastedive.apiary-mock.com/api/similar';

var SPOTIFY_BASE_URL = "https://api.spotify.com/v1/search";

var state = {
    similarArtists: [],
    spotifyData: [],
    hasArtists: function () {
        return this.similarArtists.length > 0;
    },
    hasSpotifyData: function () {
        return this.spotifyData.length > 0;
    }
};

function getDataFromTasteDive(searchTerm, callback) {
    var query = {
        q: searchTerm,
        type: "music",
        info: 1,
        limit: 10,
        key: "268196-Similara-AYQO3GFI" //you see nothing
    }
    $.getJSON(TASTE_DIVE_BASE_URL, query, callback);
}

function getDataFromSpotify(band, callback) {
    var query = {
        q: band,
        type: "artist",
        limit: 1
    }
    $.getJSON(SPOTIFY_BASE_URL, query, callback);
}

function spotifyResults(data) {
    state.spotifyData.push(data);
    renderArtistImage();
}

function tasteDiveResults(data) {
    console.log(data);
    data.Similar.Results.forEach(function (item, index) {
        state.similarArtists.push(item);
    })
    renderSimilarArtist();
}

function sendResultsToSpotify(similarArtists) {
    similarArtists.forEach(function (item, index) {
        getDataFromSpotify(item.Name, spotifyResults);
    })
}

function renderSimilarArtist() {

    if (state.hasArtists()) {
        var artists = state.similarArtists.map(function (item, index) {
            return htmlTemplate(item, index)
        });
        $(".js-results").html(artists.join(""));
        sendResultsToSpotify(state.similarArtists);
    } else {
        getDataFromTasteDive(state.query, tasteDiveResults);
    }
}

function renderArtistImage() {
    state.spotifyData.forEach(function (item, index) {
        var html = htmlArtistImg(item, index);
        $(".img-container").eq(index).html(html);
    })
    console.log(state.spotifyData);
}

function watchSubmit() {
    $('.js-search-form').submit(function (e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        state.query = query;
        renderSimilarArtist();
    });
}

function htmlTemplate(state, index) {
    var html = '<div class="row main-container">' +
        '<div class="col-8">' +
        '<div class="artist-container">' +
        '<h3>' + state.Name + '</h3>' +
        '<p>' + state.wTeaser + '</p>' +
        // '<button class="js-play-artist play-artist">play album</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-4">' +
        '<div class="img-container">' +

        '</div>' +
        '</div>' +
        '</div>'

    return html;
}

function htmlArtistImg(state, index) {
    var html = '<img class="artist-img" src="' +
        state.artists.items[0].images[0].url + '" alt="placeholder">' +
        '<iframe src="https://open.spotify.com/embed?uri=spotify:' +
        'artist:' + state.artists.items[0].id + '"' +
        'width="300" height="80" frameborder="0"' +
        'allowtransparency="true">' +
        '</iframe >';
    return html;
}

$(function () { watchSubmit(); });