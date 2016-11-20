import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventTypeDataSchema = mongoose.Schema({
    eventJobId: {
        type: String,
        required: [true, 'Event Job ID is required.']
    },
    isArray: Boolean,
    size: {
        type: Number
    },
    start: { type, Number },
    createdOn: { type: Date, default: Date.now }
});
EventTypeDataSchema.plugin(mongoosePaginate);

const EventTypeDataModel = mongoose.model('event-type-data', EventTypeDataSchema);

export default EventTypeDataModel;