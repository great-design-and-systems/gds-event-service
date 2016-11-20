import EventModel from '../../entity/event';

export default class GetEventById {
  constructor(eventId, callback) {
    EventModel.findOne({
      _id: eventId
    }, (err, event) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed getting event for id ' + eventId
        });
      } else {
        if (event) {
          callback(undefined, event);
        } else {
          callback({
            message: 'Failed getting event for id ' + eventId
          });
        }
      }
    });
  }
}