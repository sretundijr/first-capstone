

var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';
var TASTE_DIVE_MOCK_URL = 'https://private-8723d-tastedive.apiary-mock.com/api/similar';

var SPOTIFY_BASE_URL = "https://api.spotify.com/v1/search";

var state = {
    query: [],
    similarArtists: [],
    hasArtists: function () {
        return this.similarArtists.length > 0;
    }
};

function buildQueryStringForTasteDiveCall(query) {
    return query.join();
}

function getDataFromTasteDive(searchTerm) {
    var query = {
        q: buildQueryStringForTasteDiveCall(searchTerm),
        type: "music",
        info: 1,
        limit: 10,
        k: '268196-Similara-ACPD5CC5'
    }
    return Promise.resolve($.getJSON(TASTE_DIVE_BASE_URL, query));

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
    if (data.Similar.Results.length === 0) {
        renderNoResultsFromTasteDive();
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
    var artists = state.similarArtists.map(function (item, index) {
        return htmlTemplate(item, index)
    });
    $(".js-results").html(artists.join(""));
}

function renderNoResultsFromTasteDive() {
    $('.js-results').append('<p>No Results for the search please try again</p>');
}

function resetInputField() {
    $('.js-search-form')[0].reset();
    $('.js-query').focus();
}

function addArtistBtn() {
    $('.js-search-form').submit(function (e) {
        state.query.push($('.js-query').val());
        console.debug(state.query);
        resetInputField();
    })
}

function removeTextField() {
    $('.js-remove-text-btn').on('click', function (e) {
        $('.js-query').remove();
    })
}

function watchSubmit() {
    $('.js-search-artist-btn').on('click', function (e) {
        e.preventDefault();
        //clear state of old data
        state.similarArtists = [];
        //the get method here removes the jquery element object that gets added to the last index
        state.query.push($('.js-query').val());
        getDataFromTasteDive(state.query).then(tasteDiveResults);
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
        '<div>' +
        '<img class="artist-img" src="' +
        state.Thumbnail[0].url + '" alt="placeholder">' +
        '</div>' +
        '<div>' +
        '<iframe class="spotify-iframe" src="https://open.spotify.com/embed?uri=spotify:' +
        'artist:' + state.ArtistId + '"' +
        'width="300" height="80" frameborder="0"' +
        'allowtransparency="true">' +
        '</iframe >' +
        '</div>' +
        '</div>';
    return html;
}

function addInputField() {
    return '<input class="search-artist-text js-query" name="artists[]" type="text" placeholder="Enter an Artist" autofocus>'
}

$(function () {
    watchSubmit();
    addArtistBtn();
    removeTextField();
});