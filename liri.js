// ----------------------------------------------------------------------------------------------------------------------------------------------

// app will take in the following type of commands from the user (command line)

// my-tweets 			node liri.js my-tweets
// spotify-this-song	node liri.js spotify-this-song '<song name here>'
// movie-this			node liri.js movie-this '<movie name here>'
// do-what-it-says		node liri.js do-what-it-says

// ----------------------------------------------------------------------------------------------------------------------------------------------


// Gets the twitter key info from the keys.js file
var keyInfo = require("./keys.js");

// grab input from command line node app call
var userInput = process.argv;

// call function to check / execute the right commands passed in by the user
executeLIRICommand(userInput[2], userInput[3]);



// ----------------------------------------------------------------------------------------------------------------------------------------------
// check the command and the information that the user and execute the right function
// ----------------------------------------------------------------------------------------------------------------------------------------------
function executeLIRICommand(cmdType, titleInfo) {

	// check to see which function requested by user from command line input
	switch(cmdType) {
	    case "my-tweets":
	    	console.log("getting tweets");
	        getTwitterStatus();
	        break;

	    case "spotify-this-song":
	        console.log("getting song data");
	        getSongInfo(titleInfo);
	        break;

	    case "movie-this":
	    	console.log("getting movie info");
	    	getMovieInfo(titleInfo);
	    	break;

	    case "do-what-it-says":
	    	console.log("getting file data");
	    	getFileInfo();
	    	break;

	    default:
	        console.log("what do you want to do? you didn't enter any commands I recognize to help you");
	}

}


// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the twitter status information

// my-tweets ... will show your last 20 tweets and when they were created in gitbash (cmd line interface)

// ----------------------------------------------------------------------------------------------------------------------------------------------

function getTwitterStatus() {

	var Twitter = require("twitter");	// needed to use the twitter package to get last 20 tweets

	// create new client session w/ Twitter and use keys.js info from test account
	var client = new Twitter({
		consumer_key: keyInfo.consumer_key,
		consumer_secret: keyInfo.consumer_secret,
		access_token_key: keyInfo.access_token_key,
		access_token_secret: keyInfo.access_token_secret,
	});

	// add twitter user account (screen name) information needed to access the client get function
	// var params = {screen_name: 'nodejs'};	// using the default account information from the npm documentation
	var params = {screen_name: 'BtTest1117'};  // using my test account information

	// use the Twitter client to get the latest tweets from the user account
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	
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

		// loop through tweets information and process to screen
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
// need this code for the spotify query to work

// spotify-this-song ... node liri.js spotify-this-song '<song name here>' ... will show the following information about the song
	// artist, song name, preview link of the song from spotify, album that the song is from
	// if there is no song then program will default to "The Sign" by Ace of Base

// ----------------------------------------------------------------------------------------------------------------------------------------------

function getSongInfo(songName) {

	// adding spotify npm package functions to the node.js app for use
	var Spotify = require('node-spotify-api');

	// using documentation from npm package to setup the new Spotify object
	var spotify = new Spotify({
		id: 'd4df910b75c3467e80e7e5628d46c06c',
		secret: 'e8994c65cc5f422ca980f5ce049ee573',
	});

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
		var isSong = false;
		var itemIndex;

		// loop through to check for an exact match first
		for (var i = 0; i < data.tracks.items.length; i++) {
			
			var songTitle1 = data.tracks.items[i].name;
			var songTitleCk1  = songTitle1.toUpperCase();
			var songNameCk1 = songName.toUpperCase();
			
			// check for exact match from spotify response
			if (songNameCk1 === songTitleCk1) {

				isSong = true;
				itemIndex = i;
				break;	// added break to get out of loop when 1st exact match found
			}
			
		}

		// if no exact match found
		if (!isSong) {

			// loop through to check for a close match
			for (var j = 0; j < data.tracks.items.length; j++) {
			
				var songTitle2 = data.tracks.items[j].name;
				var songTitleCk2  = songTitle2.toUpperCase();
				var songNameCk2 = songName.toUpperCase();
			
				// check to see if the song name from the user input is part of the title from the spotify response
				isSong = songTitleCk2.includes(songNameCk2);

				// check to see if the current item in the response is the right song title
				if (isSong) {

					itemIndex = j;
					break;	// added break to get out of loop when 1st partial match found

				} else {

					spotifySongChoices.push(data.tracks.items[j].name);
				}
			
			}

		}

		// check to see if a song was found in the 2 checks being done
		if (isSong) {

			var artist = data.tracks.items[itemIndex].album.artists[0].name;
			var songTitle = data.tracks.items[itemIndex].name;
			var album = data.tracks.items[itemIndex].album.name;
			var previewLink = data.tracks.items[itemIndex].preview_url;

			// check to see if preview link is null
			if (previewLink === null) {

				previewLink = "Sorry no link available at this time."
			
			}

			console.log("----------------------------------------------------------------------------------");
			console.log("Artist:    " + artist);
			console.log("Song Name: " + songTitle);
			console.log("Album:     " + album);
			console.log("Check it out at: " + previewLink);
			console.log("----------------------------------------------------------------------------------");

		} else {

			console.log("isSong = " + isSong);
			console.log("Could it be one of these?");
			console.log(spotifySongChoices);
		}

	});

}




// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the omdb query to work

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

// ----------------------------------------------------------------------------------------------------------------------------------------------

function getMovieInfo(movieName) {

	// adding request npm package functions to the node.js app for omdb api call usage
	var request = require('request');
	
	// check if the user added a movie to search for in the command line
	if (movieName === undefined) {

		movieName = "Mr. Nobody";
	}
	
	// setup url to query omdb api
	var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
		
	request(url, function (error, response, body) {
		
		if (!error && response.statusCode === 200) {

			// console.log('body:', body); // Print the response back from the api request.
			
			var rottenRating;
			// Loop through ratings array and check for the rotten tomatoes 
			for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
				// console.log(JSON.parse(body).Ratings[i]);
				if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {

					rottenRating = JSON.parse(body).Ratings[i].Value
					break;
				}
			}

			// check to see if the body has a rotten tomatoes rating for it
			if (rottenRating === undefined) {
				rottenRating = "N/A";
			}

			console.log("----------------------------------------------------------------------------------");
			// Parse the body of the api request and recover the info needed to output
			console.log("Title:           " + JSON.parse(body).Title);
			console.log("Release Year:    " + JSON.parse(body).Year);
			console.log("IMDB Rating:     " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes: " + rottenRating);
			console.log("Country:         " + JSON.parse(body).Country);
			console.log("Language:        " + JSON.parse(body).Language + "\n");
			console.log("Plot:   " + JSON.parse(body).Plot + "\n");
			console.log("Actors: " + JSON.parse(body).Actors);
			console.log("----------------------------------------------------------------------------------");
			
		} else {

			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

		}

	});

}



// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the file read to work

// do-what-it-says ... node liri.js do-what-it-says ... read in random.txt file and do whatever commands are in the file

// ----------------------------------------------------------------------------------------------------------------------------------------------

function getFileInfo() {

	// grab npm packages that will be needed to run this node.js app
	var fs = require("fs");		// needed for file read / write

	// read the random.txt file and execute the right process based on file input
	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			return console.log("Error when reading random.txt file: " + err);
		}

		var dataArr = data.split(",");

		// take out double quotes since the data.split function puts it into the array as a string already
		var noQuotesVersion = dataArr[1].replace(/"/g,"");

		executeLIRICommand(dataArr[0], noQuotesVersion);
	});

}

