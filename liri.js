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
	// var params = {screen_name: 'nodejs'};	// using the default account information from the npm documentation
	var params = {screen_name: 'BtTest1117'};  // using my test account information

	// use the Twitter client to get the latest tweets from the user account
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);
	  }
	});

}

// ----------------------------------------------------------------------------------------------------------------------------------------------
// need this code for the twitter status information
// ----------------------------------------------------------------------------------------------------------------------------------------------





