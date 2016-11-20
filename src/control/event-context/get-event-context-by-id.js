import EventContextModel from '../../entity/event-context';
export default class GetEventContextById {
  constructor(contextId, callback) {
    EventContextModel.findOne({
      _id: contextId
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Event context not found for id' + contextId
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}