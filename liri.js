// ----------------------------------------------------------------------------------------------------------------------------------------------

// app will take in the following type of commands from the user (command line)
// my-tweets ... will show your last 20 tweets and when they were created in gitbash (cmd line interface)
// spotify-this-song ... node liri.js spotify-this-song '<song name here>' ... will show the following information about the song
	// artist, song name, preview link of the song from spotify, album that the song is from
	// if there is no song then program will default to "The Sign" by Ace of Base
// movie-this ... node liri.js movie-this '<movie name here>' ... will show the following information about the movie in the command line view
	// * Title of the movie.
	// * Year the movie came out.
	// * IMDB Rating of the movie.
	// * Rotten Tomatoes Rating of the movie.
	// * Country where the movie was produced.
	// * Language of the movie.
	// * Plot of the movie.
	// * Actors in the movie.
	// Default to Mr. Nobody if no movie information added by the user
// do-what-it-says ... node liri.js do-what-it-says ... read in random.txt file and do whatever commands are in the file

// ----------------------------------------------------------------------------------------------------------------------------------------------


// Gets the twitter key info from the keys.js file
var keyInfo = require("./keys.js");

// keys info loading from keys.js file
// console.log(keyInfo);

// keys dot notation working to assign the individual key information to the calls
// console.log(keyInfo.consumer_key);


// grab npm packages that will be needed to run this node.js app
var fs = require("fs");		// needed for file read / write
var Twitter = require("twitter");	// needed to use the twitter package to get last 20 tweets
// var Spotify = require('node-spotify-api');	// needed to use the spotify package to get the song information

// grab input from command line node app call
var userInput = process.argv;

// check to see if command line input coming in properly
// console.log(userInput);

// check to see which function requested by user from command line input
switch(userInput[2]) {
    case "my-tweets":
    	console.log("getting tweets");
        getTwitterStatus();
        break;

    case "spotify-this-song":
        console.log("getting song data");
        getSongInfo(userInput[3]);
        break;

    case "movie-this":
    	console.log("getting movie info");
    	break;

    default:
        console.log("what do you want to do? you didn't enter any commands I recognize to help you");
}



// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the twitter status information
// ----------------------------------------------------------------------------------------------------------------------------------------------

function getTwitterStatus() {

	// create new client session w/ Twitter and use keys.js info from test account
	var client = new Twitter({
		consumer_key: keyInfo.consumer_key,
		consumer_secret: keyInfo.consumer_secret,
		access_token_key: keyInfo.access_token_key,
		access_token_secret: keyInfo.access_token_secret,
	});

	// add twitter user account (screen name) information needed to access the client get function
	var params = {screen_name: 'nodejs'};	// using the default account information from the npm documentation
	// var params = {screen_name: 'BtTest1117'};  // using my test account information

	// use the Twitter client to get the latest tweets from the user account
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  // test if an error occurs
	  // error = true;
	  if (!error) {
		// console.log(tweets);  // shows full tweet array that comes back from the get function call
		// console.log(tweets[0].created_at);	// test array dot notation to grab tweets from get function call
		// console.log(tweets[0].text);	// test array dot notation to grab tweets from get function call

		console.log("----------------------------------------------------------------------------------");
		console.log("Latest Tweets for ***" + params.screen_name + "***");
		console.log("----------------------------------------------------------------------------------");
		
		// create a variable to limit the tweet output to 20
		var loopLimit;

		// check to see if there are twenty or more tweets in the account being used
		// might not need this ... looks like the get function only returns 20 tweets at a time anyway
		if (tweets.length >= 20) {
			loopLimit = 20;
		} else {
			loopLimit = tweets.length;
		}

		// check to see if the loop limit is correct
		// console.log("going to loop through " + loopLimit);
		// console.log("tweets amt = " + tweets.length);

	    // loop through 
	    for (var i = 0; i < loopLimit; i++) {
	    
	    	console.log("\"" + tweets[i].text + "\"");	// test array dot notation to grab tweets from get function call
			console.log("    Tweeted on: " + tweets[i].created_at);	// test array dot notation to grab tweets from get function call
			console.log("----------------------------------------------------------------------------------");
	    }

	  } else {
	  	console.log("Issue getting the latest tweets, please try back later.");
	  }
	});

}

// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the twitter status information
// ----------------------------------------------------------------------------------------------------------------------------------------------





// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the spotify query to work

// spotify-this-song ... node liri.js spotify-this-song '<song name here>' ... will show the following information about the song
	// artist, song name, preview link of the song from spotify, album that the song is from
	// if there is no song then program will default to "The Sign" by Ace of Base

// ----------------------------------------------------------------------------------------------------------------------------------------------

function getSongInfo(songName) {

	// adding spotify npm package functions to the node.js app for use
	var Spotify = require('node-spotify-api');

	// tried using the keys file for the spotify id / secret info too ... didn't work ... have to break this out into another file to use this way
	// var spotify = new Spotify({
	// 	id: keyInfo.id,
	// 	secret: keyInfo.secret,
	// });

	// using documentation from npm package to setup the new Spotify object
	var spotify = new Spotify({
		id: 'd4df910b75c3467e80e7e5628d46c06c',
		secret: 'e8994c65cc5f422ca980f5ce049ee573',
	});

	// console.log(songName);

	// if user does not add a song title to search for then app will add one for them in the search query request
    if (songName === undefined) {

		console.log("No song to look up so here is one for you ... ");
		songName = "The Sign";
	}

	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		// added this JSON.stringify function to be able to read all the objects / data being returned from the search query above
		// console.log(JSON.stringify(data, null, 2));

		// console.log(JSON.stringify(data.tracks.items[0].album, null, 2));

		console.log("there are " + data.tracks.items.length + " items in the response from spotify");
		var spotifySongChoices = [];

		for (var i = 0; i < data.tracks.items.length; i++) {
			// console.log("in the for loop ");
			// console.log("Item " + i + ": " + data.tracks.items[i].name);
			// console.log("Album Name: " + data.tracks.items[i].album.name);

			var songTitle = data.tracks.items[i].name;
			var songTitleCk  = songTitle.toUpperCase();
			var songNameCk = songName.toUpperCase();
			// console.log(songTitle);
			var isSong = songTitleCk.includes(songNameCk);

			// check to see if the current item in the response is the right song title
			if (isSong) {

				console.log("song titles match at this point");
				console.log("response: " + songTitle + " & user input: " + songName);

				var artist = data.tracks.items[i].album.artists[0].name;
				// var songTitle = data.tracks.items[0].name;
				var album = data.tracks.items[i].album.name;
				var previewLink = data.tracks.items[i].album.artists[0].external_urls.spotify;


				console.log("----------------------------------------------------------------------------------");
				console.log("Artist:    " + artist);
				console.log("Song Name: " + songTitle);
				console.log("Album:     " + album);
				console.log("Check it out at: " + previewLink);
				console.log("----------------------------------------------------------------------------------");

				return;
			} else {

				spotifySongChoices.push(data.tracks.items[i].name);
			}
			
		}

		console.log("isSong = " + isSong);
		console.log("Could it be one of these?");
		console.log(spotifySongChoices);
	});

}

// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the spotify query to work
// ----------------------------------------------------------------------------------------------------------------------------------------------




