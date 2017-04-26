// alert("hello");

// var TASTE_DIVE_BASE_URL = 'https://tastedive.com/api/similar?callback=?';
var TASTE_DIVE_BASE_URL = 'https://private-8723d-tastedive.apiary-mock.com/api/similar';

var SPOTIFY_BASE_URL = "https://api.spotify.com/v1/search";

var state = {
    similarArtists: [],
    // spotifyData: [],
    hasArtists: function () {
        return this.similarArtists.length > 0;
    },
    hasSpotifyData: function () {
        return this.spotifyData.length > 0;
    }
};

function getDataFromTasteDive(searchTerm) {
    var query = {
        q: searchTerm,
        type: "artist",
        info: 1,
        limit: 10,
        key: "268196-Similara-AYQO3GFI" //you see nothing
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
        //TODO: Point to album and thumbinal
        art.Thumbnail = data[index].artists.items[0].images;
        art.ArtistId = data[index].artists.items[0].id;
        // console.debug(data[index].artists.items[0].images);

    })
    //state.spotifyData.push(data);
    // renderArtistImages();
    renderSimilarArtists();
}

function tasteDiveResults(data) {
    // console.log(data);
    data.Similar.Results.forEach(function (item, index) {
        state.similarArtists.push(item);
    })
    renderSimilarArtists();
    sendResultsToSpotify(state.similarArtists)
}

function sendResultsToSpotify(data) {
    // console.debug(data);
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
        // console.debug(artists.join(""));
        $(".js-results").html(artists.join(""));

    } else {
        getDataFromTasteDive(state.query).then(tasteDiveResults);
    }
}

// function renderArtistImages() {
//     state.spotifyData.forEach(function (item, index) {
//         var html = htmlArtistImg(item, index);
//         $(".img-container").eq(index).html(html);
//     })
//     // console.log(state.spotifyData);
// }

function watchSubmit() {
    $('.js-search-form').submit(function (e) {
        e.preventDefault();
        var query = $(this).find('.js-query').val();
        state.query = query;
        renderSimilarArtists();
    });
}

function htmlTemplate(artist, index) {
    var img = "";
    if (artist.Thumbnail) {
        img = htmlArtistImg(artist, index);
        console.debug('here');
    }
    var html = '<div class="row main-container">' +
        '<div class="col-8">' +
        '<div class="artist-container">' +
        '<h3>' + artist.Name + '</h3>' +
        '<p>' + artist.wTeaser + '</p>' +
        // '<button class="js-play-artist play-artist">play album</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-4">' + img +
        '</div>' +
        '</div>'

    return html;
}

function htmlArtistImg(state, index) {
    //TODO: Use Thumbnail and ArtistId
    console.debug(state);
    var html = '<div class="img-container">' +
        '<img class="artist-img" src="' +
        state.Thumbnail[0].url + '" alt="placeholder">' +
        '<iframe src="https://open.spotify.com/embed?uri=spotify:' +
        'artist:' + state.ArtistId + '"' +
        'width="300" height="80" frameborder="0"' +
        'allowtransparency="true">' +
        '</iframe >' +
        '</div>';
    return html;
}

$(function () { watchSubmit(); });