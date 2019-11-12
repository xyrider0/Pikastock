var express = require('express');
const GhostContentAPI = require('@tryghost/content-api');

var app = express();

app.use(express.static(__dirname+'\\build'));

const api = new GhostContentAPI({
    url: 'https://pikastock.com',
    key: '17a2aaeb626c4e2da11094a326',
    version: "v3"
});

app.get('/', function (req, res){
    res.redirect('/dashboard');
});

app.get('/stocklist', function(req, res){
    
    // Get stock list for user from database
    dummy_stock1 = {
        ticker: 'MSFT',
        name: 'Microsoft',
        shares: 300,
        orig_price: 120
    }
    
    dummy_stock2 = {
        ticker: 'AAPL',
        name: 'Apple',
        shares: 100,
        orig_price: 180
    }

    var user_portfolio = [dummy_stock1, dummy_stock2];

    res.json(user_portfolio);
});

app.get('/posts', function(req, res){
    var data = api.posts.browse({include:"post, authors, tags", filter:"authors:eric"}).then(function(data){
        res.json(data);
    });
});

app.get('/article', function(req, res){
    api.posts.read({slug: req.query.slug}).then(function(data){
        res.json(data);
    });
});

// Robinhood API
// Straight url call

// Ally Trading/ Tradeking

// Alpha Vantage
// Has no option information

app.listen(8000);
console.log("Server running on port 8000")