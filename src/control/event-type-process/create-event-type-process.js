import EventTypeProcessModel from '../../entity/event-type-process';

export default class CreateEventTypeProcess {
  constructor(eventJobId, method, callback) {
    EventTypeProcessModel.create({
      eventJobId: eventJobId,
      method: method
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed to create event type process for job id ' + eventJobId
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}