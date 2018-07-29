
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Task Schema:
var TaskSchema = new Schema(
    {
        title: { type: String, required: true },
        content:  { type: String, required: true },
        done: { type: Boolean, required: false },
        posted: { type: Date, default: Date.now },
    },
    {
        versionKey: false
    }
);

//Set creation Date:
TaskSchema.pre('save', next => {
    var currentDate = new Date();
    if(!this.posted) {
        this.posted = currentDate;
    }
    next();
});

//Export Schema:
module.exports = mongoose.model('task', TaskSchema);