const express = require('express');
const request = require('request');

const port = process.env.PORT || 3000;

const app = express();
const metObjects = `https://collectionapi.metmuseum.org/public/collection/v1/search`
const metObject = `https://collectionapi.metmuseum.org/public/collection/v1/objects/`
// id part
app.get('/students:id', function(req, res) {
    if(req.params.id === ':A00959385'){
      return res.status(200).json({
        'id': 'A00959385',
        'fullname': 'Emilio Fernando Alonso Villa',
        'nickname': 'Emilio',
        'age': '24'
      });
    } else {
      throw new Error('id no válido');
    }
});

// met part
app.get('/met', function(req, res) {
  const metSearch = `${metObjects}?q=${req.query.search}`
  request.get({url:metSearch, json:true}, (error, response, body) => {

    const artId = body.objectIDs[0];
    const artInfo = `${metObject}${artId}`

    request.get({url:artInfo, json:true}, (error, response, body) => {
      console.log(body);
      return res.status(200).json({
        'searchTerm': req.query.search,
        'artist': body.constituents[0].name,
        'title': body.title,
        'year': body.objectEndDate,
        'technique': body.medium,
        'metUrl': body.objectURL
      })
    })
  });
});

app.get('*', function(req, res) {
  res.send('La ruta especificada no es válida');
});

app.listen(port, function() {
  console.log('up and running');
});