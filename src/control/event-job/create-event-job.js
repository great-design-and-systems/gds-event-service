import EventJobModel from '../../entity/event-job';
export default class CreateEventJob {
  constructor(eventName, triggeredBy, status, eventType, action, callback) {
    EventJobModel.create({
      eventName: eventName,
      triggeredBy: triggeredBy,
      status: status,
      eventType: eventType,
      action: action
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed creating event job for ' + eventName
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}