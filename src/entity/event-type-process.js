import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventTypeProcessSchema = mongoose.Schema({
    eventJobId: {
        type: String,
        required: [true, 'Event Job ID is required.']
    },
    method: {
        type: String,
        enum: ['PUT', 'POST', 'DELETE'],
        required: [true, 'Method is required.']
    },
    createdOn: { type: Date, default: Date.now }
});
EventTypeProcessSchema.plugin(mongoosePaginate);

const EventTypeProcessModel = mongoose.model('event-type-process', EventTypeProcessSchema);

export default EventTypeProcessModel;