import EventTypeScheduledModel from '../../entity/event-type-scheduled';

export default class GetEventTypeScheduledByJobId {
  constructor(eventJobId, callback) {
    EventTypeScheduledModel.findOne({
      eventJobId: eventJobId
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed getting event type scheduled for job id ' + eventJobId
        });
      } else {
        if (result) {
          callback(undefined, result);
        } else {
          callback({
            message: 'Failed getting event type scheduled for job id ' + eventJobId
          });
        }
      }
    })
  }
}