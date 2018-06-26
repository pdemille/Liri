//variables aka dependencies
require("dotenv").config();

var keys = require('./keys.js');
var twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require('fs');


//npm told me to do this
var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
  });


//gets the user input, and tells user what to type
console.log("Type my-tweets , spotify-this-song , movie-this , or do-what-it-says to get started!");
//2 is the action, 3 searches for spotify or movie.
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//sifts through multiple words & alerts if any is typed more than the above console log & first parameter.
	for(i=4; i<process.argv.length; i++){
	    secondCommand += '+' + process.argv[i];
	}

function theMainFunctionCase(){
	//case statement to declare tweet/spotify/movie/do
	switch(userCommand){

		case 'my-tweets':
		getTheTweets();
		break;

		case 'spotify-this-song':
		getTheSpotify();
		break;

		case 'movie-this':
		getTheMovie();
		break;

		case 'do-what-it-says':
		getTheText();
		break;
		
	}
};
//functions/options
function getTheTweets(){
	console.log("Tweet tweet!");
    //new variable for instance of twitter, load keys from imported keys.js
    console.log("keys: ", keys);
	var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	//Twitter function parameters.
	var parameters = {
		screen_name: 'parisdarmani',
		count: 20
	};

	//call the get method
	client.get('statuses/user_timeline', parameters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};

function getTheSpotify(){
	console.log("A little bump n grind!");

    //variable for the search term
    
	var searchTrack;
	if(secondCommand === undefined){
		searchTrack = "What's My Age Again?";
	}else{
		searchTrack = secondCommand;
	}
	// spotify now searches
	spotify.search({type:'track', query:searchTrack}, function(err,data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	        
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
};

function getTheMovie(){
	console.log("What movie you down for girl?");

	//this tests if search term entered like we did before
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Mr. Nobody";
	}else{
		searchMovie = secondCommand;
	};

	
    var url = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=trilogy";
    request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
	    }
    });
};

function getTheText(){
	console.log("Should this be random.txt now or log.txt?");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data with a comma and then declares what variables to use
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //this just adds words together if there's multiple words like Murph taught us
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        //run main function aka the cases
		theMainFunctionCase();
		
    	};//end else

    });//end readfile

};//end getTheText

theMainFunctionCase();
