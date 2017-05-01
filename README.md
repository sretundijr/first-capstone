# first-capstone
This website allows a user to enter a movie, music, books, authors and games and returns a list of suggested music

Users are presented with this opening screen which describes how to use the app as well as a song of the day.  Song of the
day feature is currently hard coded and maybe implemented at a later date.

![App intro page](https://github.com/sretundijr/first-capstone/blob/master/wireframes/Screen%20Shot%202017-04-30%20at%203.10.28%20PM.png)

Due to Taste Dives API policy, each user is asked to supply their own api key, shown above.
Each user can add any number of artists, movies and tv shows. The supplied add and remove artist button make this an easy
task.

![App error message](https://github.com/sretundijr/first-capstone/blob/master/wireframes/Screen%20Shot%202017-04-30%20at%203.41.49%20PM.png)

This error message was added to notify the users of the API rate limit exceeded.
I added a mock API to return results in the event the API rate limit was exceeded, although the returned results were
not what the user expected, it allowed them to view the functionality of the app.

A view of mock api results returned
![Mock api results](https://github.com/sretundijr/first-capstone/blob/master/wireframes/Screen%20Shot%202017-04-30%20at%203.49.07%20PM.png)

This app returns 10 suggested artist, a spotify play button widget, a description/summary of the artists career and an image.
The spotify play button widget allows a user to either hear a sample (for non-spotify users) or a full album (if the user
is signed into spotify).

Thank you for visiting my app, feedback is always welcome.

Technologies used
HTML, CSS, JavaScript, jQuery, Taste Dives API, Spotify API, and Apiary (providing mock api results).


