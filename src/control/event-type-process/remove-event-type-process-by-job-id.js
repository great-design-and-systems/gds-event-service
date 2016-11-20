import EventTypeProcessModel from '../../entity/event-type-process';

export default class RemoveEventTypeProcessByJobId {
  constructor(eventJobId, callback) {
    EventTypeProcessModel.remove({
      eventJobId: eventJobId
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed to remove event type process for job id ' + eventJobId
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}