// alert("hello");

var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';
var TASTE_DIVE_MOCK_URL = 'https://private-8723d-tastedive.apiary-mock.com/api/similar';

var SPOTIFY_BASE_URL = "https://api.spotify.com/v1/search";

var state = {
    similarArtists: [],
    hasArtists: function () {
        return this.similarArtists.length > 0;
    }
};

//taste dives api rquires a comma seperated list, I figured id add this here
//to make one so the user doesn't have to but then I realized that this would not
//work if the artist name is seperated by a space, 
//should i even bother with this
// function buildQueryStringForTasteDiveCall(query) {
//     var arr = query.split(" ");
//     return arr.join();
// }

function getDataFromTasteDive(searchTerm, apiKey) {
    console.debug(buildQueryStringForTasteDiveCall(searchTerm));
    var query = {
        q: searchTerm,
        type: "music",
        info: 1,
        limit: 10,
        key: apiKey
    }
    if (apiKey === "") {
        return Promise.resolve($.getJSON(TASTE_DIVE_MOCK_URL, query));
    } else {
        return Promise.resolve($.getJSON(TASTE_DIVE_BASE_URL, query));
    }
}

function getDataFromSpotify(band) {
    var query = {
        q: band,
        type: "artist",
        limit: 1
    }
    return Promise.resolve($.getJSON(SPOTIFY_BASE_URL, query));
}

function spotifyResults(data) {
    state.similarArtists.forEach(function (art, index) {
        art.Thumbnail = data[index].artists.items[0].images;
        art.ArtistId = data[index].artists.items[0].id;
    })
    renderSimilarArtists();
}

function tasteDiveResults(data) {
    console.debug(data);

    if (data.error) {
        alert("Excedded Taste Dives API rate limit, sorry try again later " +
            "or leave the API key blank and recieve results from our mock API");
    } else {
        data.Similar.Results.forEach(function (item, index) {
            state.similarArtists.push(item);
        })
        renderSimilarArtists();
        sendResultsToSpotify(state.similarArtists)
    }
}

function sendResultsToSpotify(data) {
    var promises = data.map(function (item, index) {
        return getDataFromSpotify(item.Name);
    })
    Promise.all(promises).then(spotifyResults);
}

function renderSimilarArtists() {

    if (state.hasArtists()) {
        var artists = state.similarArtists.map(function (item, index) {
            return htmlTemplate(item, index)
        });
        $(".js-results").html(artists.join(""));
    } else {
        getDataFromTasteDive(state.query, state.ApiKey).then(tasteDiveResults);
    }
}

function watchSubmit() {
    $('.js-search-form').submit(function (e) {
        e.preventDefault();
        //clear state of old data
        state.similarArtists = [];
        state.query = "";
        state.apiKey = "";
        var query = $(this).find('.js-query').val();
        var apiKey = $(this).find('.js-api-key').val();
        console.log(apiKey);
        console.debug(query);
        state.query = query;
        state.ApiKey = apiKey;
        renderSimilarArtists();
    });
}

function htmlTemplate(artist, index) {
    var img = "";
    if (artist.Thumbnail) {
        img = htmlArtistImg(artist, index);
    }
    var html = '<div class="row main-container">' +
        '<div class="col-8">' +
        '<div class="artist-container">' +
        '<h3>' + artist.Name + '</h3>' +
        '<p>' + artist.wTeaser + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-4">' + img +
        '</div>' +
        '</div>'

    return html;
}

function htmlArtistImg(state, index) {
    var html = '<div class="img-container">' +
        '<img class="artist-img" src="' +
        state.Thumbnail[0].url + '" alt="placeholder">' +
        '<iframe class="spotify-iframe" src="https://open.spotify.com/embed?uri=spotify:' +
        'artist:' + state.ArtistId + '"' +
        'width="300" height="80" frameborder="0"' +
        'allowtransparency="true">' +
        '</iframe >' +
        '</div>';
    return html;
}

$(function () { watchSubmit(); });