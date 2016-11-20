import EventTypeProcessModel from '../../entity/event-type-process';

export default class GetEventTypeProcessByJobId {
  constructor(eventJobId, callback) {
    EventTypeProcessModel.find({
      eventJobId: eventJobId
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed to get event type process for job id ' + eventJobId
        });
      } else {
        if (result) {
          callback(undefined, result);
        } else {
          callback({
            message: 'Failed to get event type process for job id ' + eventJobId
          });
        }
      }
    });
  }
}