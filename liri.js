// ----------------------------------------------------------------------------------------------------------------------------------------------

// app will take in the following type of commands from the user (command line)

// my-tweets 			node liri.js my-tweets '<twitter screen name (optional)>'
// spotify-this-song	node liri.js spotify-this-song '<song name here>'
// movie-this			node liri.js movie-this '<movie name here>'
// do-what-it-says		node liri.js do-what-it-says

// ----------------------------------------------------------------------------------------------------------------------------------------------

// grab npm package that will be needed to run this node.js app
var cmdlog = require("fs");		// needed for file write to log

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

	var twitterInfo = "";

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

	if (userInput[3] != undefined) {
		params.screen_name = userInput[3];
	}

	// use the Twitter client to get the latest tweets from the user account
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	
		twitterInfo += "----------------------------------------------------------------------------------\n";
		twitterInfo += "Latest Tweets for ***" + params.screen_name + "***\n";
		twitterInfo += "----------------------------------------------------------------------------------\n";
		
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
	    
	    	twitterInfo += "\"" + tweets[i].text + "\"\n";	// test array dot notation to grab tweets from get function call
			twitterInfo += "    Tweeted on: " + tweets[i].created_at + "\n";	// test array dot notation to grab tweets from get function call
			twitterInfo += "----------------------------------------------------------------------------------\n";

		}

	  } else {

	  	twitterInfo += "Issue getting the latest tweets, please try back later.\n";

	  }

	  	// have to have it within the .get function so it has all the information before it processes the statement
	  	console.log(twitterInfo);

	  	// log twitter output to log file created
	  	cmdlog.appendFile('liri-log.txt', userInput[2] + " " + userInput[3] + "\n" + twitterInfo, 'utf8', function (err) {
	  		if (err) {
	  			console.log("Error logging request to file");
	  		}
	  	});

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

	var spotifyInfo = "";

	// using documentation from npm package to setup the new Spotify object
	var spotify = new Spotify({
		id: 'd4df910b75c3467e80e7e5628d46c06c',
		secret: 'e8994c65cc5f422ca980f5ce049ee573',
	});

	// if user does not add a song title to search for then app will add one for them in the search query request
    if (songName === undefined) {

		spotifyInfo += "No song to look up so here is one for you ... \n";
		console.log(spotifyInfo);
		songName = "The Sign";
	}

	spotify.search({ type: 'track', query: songName }, function(err, data) {
		if (err) {
			
			spotifyInfo += 'Error occurred: ' + err + "\n";
			cmdlog.appendFile('liri-log.txt', userInput[2] + " " + userInput[3] + "\n" + spotifyInfo, 'utf8', function (err) {
				if (err) {
					console.log("Error logging request to file");
				}
			});

			return console.log(spotifyInfo);

		} else if (data.tracks.items.length === 0) {

			spotifyInfo += "No songs available with the title \"" + songName + "\"\n";

			cmdlog.appendFile('liri-log.txt', userInput[2] + " " + userInput[3] + "\n" + spotifyInfo, 'utf8', function (err) {
				if (err) {
					console.log("Error logging request to file");
				}
			});

			return console.log(spotifyInfo);
		}

		// added this JSON.stringify function to be able to read all the objects / data being returned from the search query above
		// console.log(JSON.stringify(data, null, 2));
		// console.log(JSON.stringify(data.tracks.items[0].album, null, 2));

		// console.log("there are " + data.tracks.items.length + " items in the response from spotify");
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

			spotifyInfo += "----------------------------------------------------------------------------------\n";
			spotifyInfo += "Artist:    " + artist + "\n";
			spotifyInfo += "Song Name: " + songTitle + "\n";
			spotifyInfo += "Album:     " + album + "\n";
			spotifyInfo += "Check it out at: " + previewLink + "\n";
			spotifyInfo += "----------------------------------------------------------------------------------\n";

		} else {

			// console.log("isSong = " + isSong);
			spotifyInfo += "No songs titles have a good match to " + songName + "\n";
			spotifyInfo += "Could it be one of these?\n";
			spotifyInfo += spotifySongChoices + "\n";
		}

		// have to have it within the .search function so it has all the information before it processes the statement
	  	console.log(spotifyInfo);

	  	// log spotify output to log file created
	  	cmdlog.appendFile('liri-log.txt', userInput[2] + " " + userInput[3] + "\n" + spotifyInfo, 'utf8', function (err) {
	  		if (err) {
	  			console.log("Error logging request to file");
	  		}
	  	});

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

	var movieInfo = "";
	
	// check if the user added a movie to search for in the command line
	if (movieName === undefined) {

		movieName = "Mr. Nobody";
	}
	
	// setup url to query omdb api
	var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
		
	request(url, function (error, response, body) {

		// console.log("error: " + error);
		// console.log("response: " + JSON.stringify(response, null, 2));
		// console.log('body:', body); // Print the response back from the api request.

		// console.log(response.statusCode);

		var err = JSON.parse(body).Response;
		var errMsg = JSON.parse(body).Error;
		var isError = false;

		// console.log(err);
		// console.log(errMsg);

		if (err === "False" || errMsg === "Movie not found!") {
			isError = true;
		}
		
		if (!isError) {

			var rottenRating;

			// if (JSON.parse(body).Ratings)
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

			movieInfo += "----------------------------------------------------------------------------------\n";
			// Parse the body of the api request and recover the info needed to output
			movieInfo += "Title:           " + JSON.parse(body).Title +"\n";
			movieInfo += "Release Year:    " + JSON.parse(body).Year + "\n";
			movieInfo += "IMDB Rating:     " + JSON.parse(body).imdbRating + "\n";
			movieInfo += "Rotten Tomatoes: " + rottenRating + "\n";
			movieInfo += "Country:         " + JSON.parse(body).Country + "\n";
			movieInfo += "Language:        " + JSON.parse(body).Language + "\n\n";
			movieInfo += "Plot:   " + JSON.parse(body).Plot + "\n\n";
			movieInfo += "Actors: " + JSON.parse(body).Actors + "\n";
			movieInfo += "----------------------------------------------------------------------------------\n";
			
		} else {

			movieInfo += 'error:', JSON.parse(body).Error + "\n"; // Print the error if one occurred
		}

		console.log(movieInfo);

		// log movie output to log file created
	  	cmdlog.appendFile('liri-log.txt', userInput[2] + " " + userInput[3] + "\n" + movieInfo, 'utf8', function (err) {
	  		if (err) {
	  			console.log("Error logging request to file");
	  		}
	  	});

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

