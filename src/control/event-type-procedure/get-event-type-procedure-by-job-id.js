import EventTypeProcedureModel from '../../entity/event-type-procedure';

export default class GetEventTypeProcedureByJobId {
  constructor(eventJobId, interval, callback) {
    EventTypeProcedureModel.find({
        rootEventJobId: eventJobId
      },
      (err, result) => {
        if (err) {
          callback({
            message: 'Failed getting procedure event for job id' + eventJobId
          });
        } else {
          if (result) {
            callback(undefined, result);
          } else {
            callback({
              message: 'Failed getting procedure event for job id' + eventJobId
            });
          }
        }
      }
    )
  }
}