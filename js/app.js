// alert("hello");

var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';

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
    // console.log($.getJSON(TASTE_DIVE_BASE_URL, query, callback));
    $.getJSON(TASTE_DIVE_BASE_URL, query, callback);
}

function getDataFromSpotify(band, callback) {
    var query = {
        q: band,
        type: "artist",
        limit: 1
    }
    // console.log("here");
    // console.log($.getJSON(SPOTIFY_BASE_URL, query, callback));
    $.getJSON(SPOTIFY_BASE_URL, query, callback);
}

function spotifyResults(data) {
    state.spotifyData.push(data);
    // console.log(data.artists.items[0].name);
    //console.log(state.spotifyData);
    render();
}

function tasteDiveResults(data) {
    console.log(data);
    data.Similar.Results.forEach(function (item, index) {
        state.similarArtists.push(item);
        // console.log(similarArtists[index].Name)
        // getDataFromSpotify(similarArtists[index].Name, spotifyResults);
    })
    // console.log(state.similarArtists[0]);
    render();
}

function sendResultsToSpotify(similarArtists) {
    // console.log(similarArtists);
    similarArtists.forEach(function (item, index) {
        getDataFromSpotify(item.Name, spotifyResults);
    })
    // render();
}
// (getTasteDiveResults, sendResultsToSpotify).value => {similarArtists[]: spotify}
// getTasteDiveResults.then(sendResultsToSpotify).resolve()
function render() {
    if (state.hasArtists()) {
        var artists = state.similarArtists.map(function (item, index) {
            // return "<li>" + item.Name + "</li>";
            return htmlTemplate(item, index)
        });
        $(".js-results").html(artists.join(""));
    } else {
        // console.log('here');
        getDataFromTasteDive(state.query, tasteDiveResults);
    }

    if (state.hasSpotifyData()) {
        var images = state.spotifyData.map(function (item, index) {
            // return "<img class='thumbnail' src='" + item.artists.items[0].images[0].url + "'/>";
            // return htmlTemplate(item, index);
            return htmlArtistImg(item, index);
        });
        $(".img-container").html(images.join(""));
    } else if (state.similarArtists) {
        sendResultsToSpotify(state.similarArtists);
    }

}
function watchSubmit() {
    $('.js-search-form').submit(function (e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        state.query = query;
        // console.log(state.query);
        render();
    });
}

function htmlTemplate(state, index) {
    // console.log(state);
    var html = '<div class="row main-container">' +
        '<div class="col-8">' +
        '<div class="artist-container">' +
        '<h3>' + state.Name + '</h3>' +
        '<p>' + state.wTeaser + '</p>' +
        '<button class="js-play-artist play-artist">play album</button>' +
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
    console.log(state);
    var html = '<img class="artist-img" src="' + state.artists.items[0].images[0].url + '" alt="placeholder">';
    return html;
}

$(function () { watchSubmit(); });