import EventContextModel from '../../entity/event-context';
export default class UpdateEeventContext {
  constructor(contextId, context, callback) {
    EventContextModel.findByIdAndUpdate(contextId, context, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event context'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}