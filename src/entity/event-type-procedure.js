import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventTypeProcedureSchema = mongoose.Schema({
    eventJobId: {
        type: String,
        required: [true, 'Event Job ID is required.']
    },
    nextEventJobId: {
        type: String
    },
    createdOn: { type: Date, default: Date.now }
});
EventTypeProcedureSchema.plugin(mongoosePaginate);

const EventTypeProcedureModel = mongoose.model('event-type-procedure', EventTypeProcedureSchema);

export default EventTypeProcedureModel;