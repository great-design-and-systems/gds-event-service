import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required.'],
    unique: true
  },
  eventType: {
    type: String,
    enum: ['DATA', 'PROCESS', 'PROCEDURE', 'SCHEDULED'],
    required: [true, 'Event type is required']
  },
  action: {
    type: String,
    required: [true, 'Action is required']
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});
EventSchema.plugin(mongoosePaginate);

const EventModel = mongoose.model('event', EventSchema);

export default EventModel;