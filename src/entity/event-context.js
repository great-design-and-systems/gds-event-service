import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const EventContextSchema = mongoose.Schema({
  eventJobId: {
    type: String,
    required: [true, 'Event Job ID is required.']
  },
  field: {
    type: String,
    required: [true, 'Field is required']
  },
  value: {
    type: String,
    required: [true, 'Value is required']
  },
  type: {
    type: String,
    enum: ['QUERY', 'PATH', 'HEADER', 'BODY'],
    required: [true, 'Context param type is required']
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});
EventContextSchema.plugin(mongoosePaginate);

const EventContextModel = mongoose.model('event-context', EventContextSchema);

export default EventContextModel;