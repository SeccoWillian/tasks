process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var Task = require('../app/models/task');

//Dependencies to Test!
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

//Run all tests:
describe('Task', function() {
    beforeEach(function(done) {
        //clean DB:
        Task.remove({}, function(error) {
            done();
        });
    });

    // Test GET Rotes 
    describe('/GET task', function() {
        it('should return tasks', function(done) {
            chai.request(server)
            .get('/task')
            .end(function(error, res) {
                //If ok status: 200 - OK
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
        });
    });
    
    // Test POST Rotes
    describe('/POST task', function() {
        it("shouldn't return a POST, content was no set", function(done) {
        
            //create a task without content:
            var task = {
                title: "Task without content"
            }
            chai.request(server)
            .post('/task')
            .send(task)
            .end(function(error, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('content');
                res.body.errors.content.should.have.property('kind').eql('required');
                done();
            });
        });
        
        it('should create a Task', function(done) {
            var task = {
                title: "My Test Task",
                content: "This is just a Test Task!",
                done: false
            } 
            chai.request(server)
            .post('/task')
            .send(task)
            .end(function(error, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('New Task was successfully add!');
                res.body.task.should.have.property('title');
                res.body.task.should.have.property('content');
                res.body.task.should.have.property('done');
            done();
            }); 
        });
    });
    
    describe('/GET/:id task', function() {
        it('should be returned a task by ID', function(done) {
            var task = new Task( {
                title: "My Test Task",
                content: "This is just a Test Task (by ID)!",
                done: false
            });
            task.save(function(error, task_res) {
                chai.request(server)
                .get('/task/' + task_res.id)
                .send(task_res)
                .end(function(error, res) {
                   res.should.be.a('object');
                   res.body.should.have.property('title'); 
                   res.body.should.have.property('content');
                   res.body.should.have.property('done');
                   res.body.should.have.property('_id').eql(task_res.id);              
                   done();
                });
            });
        });
    });
    
    describe('/PUT/:id task', function(){
    	  it('should be update a task by ID', function(done){
    	  	var task = new Task({
                title: "Updated Task", 
                content: "This task was updated!",
                done: true
            })
    	  	task.save(function(error, task_res){
    			chai.request(server)
    			.put('/task/' + task_res.id)
    			.send({
                    title: "Updated Task", 
                    content: "This task was updated!",
                    done: true
                })
    			.end(function(error, res){
    				res.should.have.status(200);
    				res.body.should.be.a('object');
    				res.body.should.have.property('message').eql('Task was successfully updated!');
    	            done();
                });
            });
        });
    });
    
    describe('/DELETE/:id task', function(){
    	it('should be deleted a task by ID', function(done){
    	  	var task = new Task({
                title: "Delete Task", 
                content: "This task will by Deleted!",
                done: false
            })
    	  	task.save(function(error, task_res){
    			chai.request(server)
    			.delete('/task/' + task_res.id)
    			.end(function(error, res){
    			  	res.should.have.status(200);
    			  	res.body.should.be.a('object');
    			  	res.body.should.have.property('message').eql('Task was successfully deleted!');
    			    done();
    			});
    		});
    	});
    });
});