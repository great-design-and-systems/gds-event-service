import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventHistorySchema = mongoose.Schema({
    eventName: {
        type: String,
        required: [true, 'Event name is required.']
    },
    eventType: {
        type: String,
        required: [true, 'EventHistory type is required']
    },
    triggeredBy: {
        type: String,
        required: [true, 'Triggered by is required']
    },
    finishedOn: { type, Date },
    createdOn: { type: Date, default: Date.now }
});
EventHistorySchema.plugin(mongoosePaginate);

const EventHistoryModel = mongoose.model('event-history', EventHistorySchema);

export default EventHistoryModel;