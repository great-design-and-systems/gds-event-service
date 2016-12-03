import EventTypeProcedureModel from '../../entity/event-type-procedure';

export default class UpdateEventTypeProcedureByJobId {
  constructor(eventJobId, data, callback) {
    EventTypeProcedureModel.findOneAndUpdate({
      eventJobId: eventJobId
    }, data,
      (err, result) => {
        if (err) {
          callback({
            message: 'Failed update procedure event for job id' + eventJobId
          });
        } else {
          callback(undefined, result);
        }
      }
    )
  }
}