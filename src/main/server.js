var express = require('express');
const GhostContentAPI = require('@tryghost/content-api');

var app = express();

app.use(express.static(__dirname));

const api = new GhostContentAPI({
    url: 'https://pikastock.com',
    key: '17a2aaeb626c4e2da11094a326',
    version: "v3"
});

app.get('/posts', function(req, res){
    var data = api.posts.browse({include:"post, authors, tags", filter:"authors:eric"});
    res.json(data);
});

app.get('/article:slug', function(req, res){
    res.json(api.posts.get('posts/slug/' + req.param.slug).posts[0]);
});


app.listen(3000);
console.log("Server running on port 3000")