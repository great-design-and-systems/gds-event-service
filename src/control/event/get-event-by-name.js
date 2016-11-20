import EventModel from '../../entity/event';
export default class GetEventByName {
  constructor(eventName, callback) {
    EventModel.findOne({
      name: eventName
    }, (err, event) => {
      if (err || !event) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed getting an event'
        });
      } else {
        callback(undefined, event);
      }
    });
  }
}