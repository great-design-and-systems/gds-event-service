import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventTypeProcedureSchema = mongoose.Schema({
    eventJobId: {
        type: String,
        required: [true, 'Event Job ID is required.']
    },
    rootEventJobId: {
        type: String,
        required: [true, 'Root event job ID is required.']
    },
    previousEventJobId: {
        type: String
    },
    nextData: {
        type: String,
        required: [true, 'Next data is required.']
    },
    interval: {
        type: Number
    },
    createdOn: { type: Date, default: Date.now }
});
EventTypeProcedureSchema.plugin(mongoosePaginate);

const EventTypeProcedureModel = mongoose.model('event-type-procedure', EventTypeProcedureSchema);

export default EventTypeProcedureModel;