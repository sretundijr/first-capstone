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
        type: "artist",
        info: 1,
        limit: 10,
        key: "267313-capstone-CI6ZV80O" //you see nothing
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
        var artists = state.similarArtists.map(function (item) {
            return "<li>" + item.Name + "</li>";
        });
        $(".artists").html(artists.join(""));
    } else {
        console.log('here');
        getDataFromTasteDive(state.query, tasteDiveResults);
    }

    if (state.hasSpotifyData()) {
        var images = state.spotifyData.map(function (item) {
            return "<img class='thumbnail' src='" + item.artists.items[0].images[0].url + "'/>";
        });
        $(".images").html(images.join(""));
    } else if (state.similarArtists) {
        sendResultsToSpotify(state.similarArtists);
    }

}
function watchSubmit() {
    $('.js-search-form').submit(function (e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        state.query = query;
        console.log(state.query);
        render();
    });
}

function htmlTemplate(state) {
    var html = '<div class="row main-container">' +
        '<div class="col-8">' +
        '<div class="artist-container">' +
        '<h3>' + state.similarArtists[0] + '</h3>' +
        '<p>description</p>' +
        '<button>play album</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-4">' +
        '<div class="img-container">' +
        '<img class="artist-img" src="http://placeimg.com/640/480/any" alt="placeholder">' +
        '</div>' +
        '</div>' +
        '</div>'

    return html;
}

$(function () { watchSubmit(); });