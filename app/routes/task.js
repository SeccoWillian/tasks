var mongoose = require('mongoose');
var Task = require('../models/task');

    function selectAllTasks(req, res) {
        var query = Task.find({});
        query.exec(function(error, tasks) {
            if(error)
                res.send(error);
            res.json(tasks);
        });       
    }

    function addTask(req, res) {
        console.log(req.body);
        var newTask = new Task(req.body);
        newTask.save(function(error, task) {
            if(error) {
                res.send(error);
            } else {
                res.json({ message: "New Task was successfully add!", task });
            }
        });
    }

    function selectTaskById(req, res) {
        Task.findById(req.params.id, function(error, task) {
            if(error)
                res.send(error);
                res.json(task);
        });
    }

    function deleteTask(req, res) {
        Task.remove({ _id: req.params.id }, function(error, result) {
            res.json({ message: "Task was successfully deleted!", result });
        });
    }

    function updateTask(req, res) {
        Task.findById({ _id: req.params.id }, function(error, task) {
            if(error)
                res.send(error);
        
            Object.assign(task, req.body).save(function(error, task_result) {
                if(error)
                    res.send(error);
                res.json({ message: "Task was successfully updated!", task_result });
            });
        });
    }

//Export all Functions:
module.exports = { selectAllTasks, addTask, selectTaskById, deleteTask, updateTask };