const Datastore = require('nedb-promises');
const Ajv = require('ajv');
const todoItemSchema = require('../schemas/todoItem');

class TodoItemStore {
    constructor() {
        const ajv = new Ajv({
            allErrors: true,
            useDefaults: true
        });

        this.schemaValidator = ajv.compile(todoItemSchema);
        const dbPath = `${process.cwd()}/todolist.db`;
        this.db = Datastore.create({
            filename: dbPath,
            timestampData: true,
        });
    }

    validate(data) {
        return this.schemaValidator(data);
    }

    create(data) {
        const isValid = this.validate(data);
        if (isValid) {
            return this.db.insert(data);
        }
    }

    read(_id) {
        return this.db.findOne({_id}).exec()
    }

    readAll() {
        return this.db.find({}, (error, data) => {
            if (error) {
              response.end();
              console.log(error)
              return;
            }
        })
        .sort({ createdAt: -1 }, (data) => {
        });
    }

    readActive() {
        return this.db.find({isDone: false}).exec();
    }

    archive(_id) {
        return this.db.update({_id}, {$set: {isDone: true}})
    }
  
    delete(_id) {
      console.log("todoItem.js" + _id);
      return this.db.remove({_id}, {$set: {isDone: true}})    
    }
}

module.exports = new TodoItemStore();