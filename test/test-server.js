//Requiring the two chai modules
var chai = require('chai');
var chaiHttp = require('chai-http');

//Requiring the server file
var server = require('../server.js');

//Calling the chai.should function
var should = chai.should();

//Making 2 aliases for the app and storage objects
var app = server.app;
var storage = server.storage;


//Using chai.use function to tell Chain to use the Chai HTTP plugin
chai.use(chaiHttp);


describe('Shopping List', function() {
    
    it('should list items on get', function(done){
      chai.request(app)
        .get('/items')
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('id');
          res.body[0].should.have.property('name');
          res.body[0].id.should.be.a('number');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
          done();
        })
    });
    
    
    it('should add an item on POST', function(done){
      chai.request(app)
        .post('/items')
        .send({'name': 'Kale'})
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('id');
          res.body.name.should.be.a('string');
          res.body.id.should.be.a('number');
          res.body.name.should.equal('Kale');
          storage.items.should.be.a('array');
          storage.items.should.have.length(4);
          storage.items[3].should.be.a('object');
          storage.items[3].should.have.property('id');
          storage.items[3].should.have.property('name');
          storage.items[3].id.should.be.a('number');
          // storage.items[3].name.should.be.a('string');
          // storage.items[3].name.should.equal('Kale');
          done();        
        })
    });
    
    // it('should POST to an ID that exists', function(done){
    //   chai.request(app)
    //     .post('/items/' + '1')
    //     .send({'name': 'posted to ID that exists'})
    //     .end(function(err, res){
    //       res.should.have.status(200);
    //       storage[1].name.should.equal('posted to ID that exists');
    //       done();
    //     })
    // });
    
    
    
    it('should POST without body data', function(done){
      chai.request(app)
        .post('/items')
        .send({})
        .end(function(err, res){
          should.equal(err, null);
          res.body.id.should.exist;
          res.body.should.not.have.property('name')
          storage.items.should.have.length(5);
          done();
        })
    });
    
        
    it('should POST with something other than valid JSON', function(done){
      chai.request(app)
        .post('/items')
        .send('non-JSON data')
        .end(function(err, res){
          should.equal(err, null);
          res.body.should.exist;
          storage.items.should.have.length(6);
          done();
        })
    }); 
    
    it('should edit an item on PUT', function(done){
      chai.request(app)
        .get('/items')
        .end(function(err, res){
          // console.log(res.body);          
          chai.request(app)
            .put('/items/' + res.body[0].id)
            .send({name: 'Cheetos', id: res.body[0].id})
            .end(function(error, response){
              response.should.have.status(200);
              response.should.be.json;
              response.body.should.be.a('object');
              response.body.should.have.property('id');
              response.body.id.should.equal(res.body[0].id);
              response.body.name.should.equal('Cheetos');
              done();
            });
        });
    });
    

 
    // it('should PUT without an ID in the endpoint', function(done){
    //   chai.request(app)
    //     .put('/items')
    //     .send({name: 'chips'})
    //     .end(function(err, res){
    //       console.log(res.body)
    //     })
    // });
    

    // it('should PUT with different ID in the endpoint than the body', function(done){
    //   chai.request(app)
    //     .get('/items')
    // });
    

    it('should PUT to an ID that doesn\'t exist', function(done){
      chai.request(app)
        .put('/items/' + '9999')
        .send({'name': 'putting to id that doesnt exist'})
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(200)
          res.body.name.should.equal('putting to id that doesnt exist');
          storage.items.length.should.equal(7);
          storage.items[6].name.should.equal('putting to id that doesnt exist');
          done();
        })
    
    });

      
    it('should PUT without body data', function(done){
      chai.request(app)
        .put('/items/' + '1')
        .send()
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(200);
          storage.items[1].name.should.equal('Tomatoes');
          done();
        })
    });
    
    it('should PUT with something other than valid JSON', function(done){
      chai.request(app)
        .put('/items/' + '1')
        .send('something other than valid JSON')
        .end(function(err, res){
          console.log('179', res.body)
          done();
        })
    });
    

    it('should delete an item on DELETE', function(done){
      chai.request(app)
        .delete('/items/' + '5')
        .end(function(err, res){
          should.equal(err, null);
          res.should.have.status(201);
          storage.items.length.should.equal(6);
          done();
        })
    });
    
    // it('should DELETE an ID that doesn\'t exist', function(done){
      
    // });
    // it('should DELETE without an ID in the endpoint');
});

