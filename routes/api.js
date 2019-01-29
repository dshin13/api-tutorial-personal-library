/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');

var db = mongoose.connect(process.env.DB, err =>{
  if(err) console.log('Database error: '+ err)
  else console.log('Database connection established')
})

var bookSchema = new mongoose.Schema({
  title: {type:String, required:true},
  comments: {type: [String], default: []}
}, {versionKey: false, retainKeyOrder: true})

var Book = mongoose.model('Book',bookSchema);

module.exports = function (app) {
  

  app.route('/api/books')
    .get(function (req, res){
      var query = req.body;
      Book.find(query, (err, docs) =>{
        if(err) console.log(err)
        else res.json(docs.map(ele => {return {_id: ele._id,
                                               title: ele.title,
                                               commentcount: ele.comments.length}
                                      }))
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      
      var title = req.body.title;
      var book = new Book({title});
      book.save({title}, (err, doc)=>{
        if(err) res.status(400).send('Invalid title')
        else res.json(doc)
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err) =>{
        if(err) res.status(400).send('complete delete failed')
        else res.send('complete delete successful')
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findById(bookid, (err, doc)=>{
        if(err) res.status(400).send('Invalid id')
        else res.json(doc)
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findById(bookid, (err, doc)=>{
        if(err) res.status(400).send('Error: '+ err)
        else {
          doc.comments.push(comment);
          doc.save((err, updatedDoc)=>{
            if(err) res.status(400).send('Error: '+ err)
            else res.send(updatedDoc)
          })
        }
      }) 
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.deleteOne({_id: bookid}, (err) => {
        if(err) res.status(400).send('delete failed')
        else res.send('delete successful')
      })
      //if successful response will be 'delete successful'
    });
  
};
