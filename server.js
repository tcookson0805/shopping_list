var express = require('express');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};


/// New Delete Method ///
Storage.prototype.delete = function(num) {
  for(var i = 0; i < this.items.length; i++){
    if(this.items[i]['id'] == num){
      return this.items.splice(i, 1)
    }
  }
}

/// New Edit Method ///
Storage.prototype.edit = function(obj){
  for(var i = 0; i < this.items.length; i++){
    if(this.items[i]['id'] == obj.id){
      this.items[i] = obj;
      return this.items[i];
    }
  }
  
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});


app.delete('/items/:id', jsonParser, function(req, res){

  if(!req.params){
    return res.sendStatus(400);
  }

  var item = storage.delete(req.params.id)
  res.status(201).json(item)
  
});

app.put('/items/:id', jsonParser, function(req, res){
  
  var idExists = false;
  var reqID = req.body.id
  
  storage.items.forEach(function(item){
    if(item.id == req.body.id){
      idExists = true;
    }
  })
  
  if(!idExists){
    res.send(storage.add(req.body.id))
  }else{
    res.send(storage.edit(req.body))
  }    
})


app.post('/items', jsonParser, function(req, res){
  if(!req.body){
    return res.sendStatus(400);
  }
  var item = storage.add(req.body.name);
  console.log(req);
  res.status(201).json(item);
})

app.listen(process.env.PORT || 8080);