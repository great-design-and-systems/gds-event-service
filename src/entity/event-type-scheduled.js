import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventTypeScheduledSchema = mongoose.Schema({
    eventJobId: {
        type: String,
        required: [true, 'Event Job ID is required.']
    },
    nextEventJobId: {
        type: String,
        required: [true, 'Next event job id is required.']
    },
    cronInterval: {
        type: String,
        required: [true, 'Cron interval  value is required.']
    },
    createdOn: { type: Date, default: Date.now }
});
EventTypeScheduledSchema.plugin(mongoosePaginate);

const EventTypeScheduledModel = mongoose.model('event-type-scheduled', EventTypeScheduledSchema);

export default EventTypeScheduledModel;