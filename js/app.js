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

function buildQueryStringForTasteDiveCall(query) {
    // var arr = query.split(" ");
    // query = query.map(function (element, index) {
    //     if (element === '') {
    //         query.splice(index, 0);
    //     }
    // })
    console.debug(query);
    return query.join();
}

function getDataFromTasteDive(searchTerm, apiKey) {
    // console.debug(buildQueryStringForTasteDiveCall(searchTerm));
    var query = {
        q: buildQueryStringForTasteDiveCall(searchTerm),
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

function addArtistBtn() {
    $('.js-add-artist').on('click touchstart', function (e) {
        $('.js-add-input').append(addInputField);
        $('.js-query').focus();
    })
}

function watchSubmit() {
    $('.js-search-form').on('click touchstart', function (e) {
        e.preventDefault();
        //clear state of old data
        state.similarArtists = [];
        state.query = "";
        state.apiKey = "";
        // var query = $(this).find('.js-query').val();
        var query = $('input[name^=artists').map(function (item, index) {
            // console.debug($(this).val() + " item");
            return $(this).val();
        })
        var apiKey = $(this).find('.js-api-key').val();
        // console.log(apiKey);
        // query.pop();
        console.debug(query.get());
        state.query = query.get();
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

function addInputField() {
    return '<input class="search-artist-text js-query" name="artists[]" type="text" placeholder="Enter an Artist" autofocus>'
}

$(function () {
    watchSubmit();
    addArtistBtn();
});