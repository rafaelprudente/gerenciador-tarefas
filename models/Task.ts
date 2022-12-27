import mongoose, {Schema} from 'mongoose';

const TaskSchema = new Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    finishPrevisionDate: {type: String, required: true},
    finishDate: {type: String},
});

export const TaskModel = mongoose.models.tasks 
    || mongoose.model('tasks', TaskSchema);