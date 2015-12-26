var request = require('request');
var cheerio = require('cheerio');
var google = require('googleapis');
var MongoClient = require('mongodb').MongoClient;
var drive = google.drive('v2');
var OAuth2Client = google.auth.OAuth2;

var CLIENT_ID = '763037887498-4mhki0cqg22djmr31l15uc2kc2jv0svr.apps.googleusercontent.com';
var CLIENT_SECRET = 'hoCK7o4Mja6bx83vbTlpwl8V';
var REDIRECT_URL = 'http://localhost/git/f_homepage/hello.html';
var REFRESH_TOKEN = '1/mQJkqUrrQxRSI3Nz9gZlMQ5uQOez89EgUjQW6EklNv4';
var access_token = '';

var url = 'http://fuckinghomepage.com/';
var db = MongoClient.db("scrap");

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var date = new Date();

function fuckingHomepageBitches () {

    request.post({
        uri:"https://www.googleapis.com/oauth2/v3/token?client_secret="+CLIENT_SECRET+"&grant_type=refresh_token&refresh_token="+REFRESH_TOKEN+"&client_id="+CLIENT_ID,
        headers:{'content-type': 'application/json'},
    },function(err,res,body){
            var jsonObject = JSON.parse(body);
            //console.log(jsonObject.access_token)
            access_token = jsonObject.access_token;
            tryMe(access_token);
    });

    function tryMe (access_token) {
        request(url, function(error, response, html){
            if(!error){
                var $ = cheerio.load(html);
                var imgurl;
                $('.PostBody p:nth-child(17) a').filter(function(){
                    var data = $(this);
                    imgurl = data.attr('href');
                    console.log(imgurl);

                    oauth2Client.setCredentials({
                      access_token: access_token
                    });

                    drive.files.insert({
                      resource: {
                        title: new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getYear() + ".jpg" ,
                        mimeType: 'image/jpg',
                        parents: [{
                            kind: "drive#fileLink",
                            id: "0ByLJVxbcr_stfnJuOUp0M2ZrZ1pKUGdtS2JZVVNya2dVYjEzN2FOMzlvb3dQN2YwM1FvbjA"
                          }]
                      },
                      media: {
                        mimeType: 'image/jpg',
                        body: request(imgurl)
                      },
                      auth: oauth2Client
                    }, function(err, response) {
                        MongoClient.connect("mongodb://admin:TYLDG4a3vAZs@$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT", function(err, db) {
                                console.log("connected!");
                        });
                      console.log('error:', err, 'inserted:', response.id);
                    });

                })
            }
        })
    }
    setTimeout(fuckingHomepageBitches, 86400000);
}

fuckingHomepageBitches ();