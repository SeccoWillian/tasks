var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = 3000;
var task = require('./app/routes/task');
var config = require('config'); 
var path = require('path');

mongoose.connect(config.DBHost, { useMongoClient: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error... '));

//Test Logs:
if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined')); 
}

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

//Rotes GET/POST:
app.route("/task")
	.get(task.selectAllTasks)
	.post(task.addTask);

//Rotes: GET, DELETE & PUT
app.route("/task/:id")
	.get(task.selectTaskById)
	.delete(task.deleteTask)
	.put(task.updateTask);

app.listen(port);
console.log("Running, Port: " + port);

module.exports = app;


