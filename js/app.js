

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
    alert(`No results for: ${state.query}`);
    //clear query state for no results
    state.query = [];
    resetInputField();
}

function renderQueryList(state) {
    // $('.js-show-state').html(showCurrentStateTemplate());
    var artist = state.query.map(function (item) {
        return showCurrentStateTemplate(item);
    });
    $('.js-show-state').html(artist.join(""));
}

function resetInputField() {
    $('.js-search-form')[0].reset();
    $('.js-query').focus();
}

function addArtistBtn() {
    $('.js-search-form').submit(function (e) {
        state.query.push($('.js-query').val());
        resetInputField();
        renderQueryList(state);
    })
}

function watchSubmit() {
    $('.js-search-artist-btn').on('click', function (e) {
        e.preventDefault();
        //clear state of old data
        state.similarArtists = [];
        //check if the current state contains input and push to state
        if (state.query[state.query.length - 1] !== $('.js-query').val()) {
            state.query.push($('.js-query').val());
        }
        getDataFromTasteDive(state.query).then(tasteDiveResults);
    });
}

function stateListBtn() {
    $('.js-show-state').on('click', function (e) {
        console.debug($(this).text());
    })
}

function showCurrentStateTemplate(artist) {
    var html = `<button type="button" class="js-remove">` +
        `${artist}  X` +
        `</button>`;
    return html;
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

$(function () {
    watchSubmit();
    addArtistBtn();
    stateListBtn();
});