const config = require('./../config/config');
const Twit = require('twit');
const T = new Twit(config.twitter);

function twitterSearch(hashtag){

  T.get('search/tweets', { q: '#'+ hashtag +' since:2017-01-01', count: 5, lang: 'en' }, function(err, data, response) {
    if(err){
      // TODO: Make sure to throw a proper Error
      console.log("An error occured", err);
    }
    else {
      return data.statuses;
    }
  });
}

function instagramSearch(){

}
