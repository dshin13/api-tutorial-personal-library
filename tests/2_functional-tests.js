/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var testKey;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'New Book'})
          .end((err, res)=>{
            testKey = res.body._id; //for use in later tests
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'New Book');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res)=>{
            assert.equal(res.status, 400);
            assert.equal(res.text, 'Invalid title');
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/' + '1234')
          .end((err, res)=>{
            assert.equal(res.status, 400);
            assert.equal(res.text, 'Invalid id');
            done();
          })
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testKey)
          .end((err, res)=>{
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'title');
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testKey)
          .send({comment: 'New Comment'})
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments[res.body.comments.length-1],'New Comment');
            done();
          })
        
      });
      
    });
    
    suite('DELETE /api/books/[id] => delete a single entry with id', function(){
      
      test('Test DELETE /api/books/[id]', function(done){
        chai.request(server)
          .delete('/api/books/' + '5c50b6746a670019f4261fed')
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          })
      });
    });

    suite('DELETE /api/books => delete all entries', function(){
      
      test('Test DELETE /api/books', function(done){
        chai.request(server)
          .delete('/api/books')
          .end((err, res) =>{
            assert.equal(res.status, 200);
            assert.equal(res.text, 'complete delete successful');
            done();
          })
      });
    });
    
  });

});
