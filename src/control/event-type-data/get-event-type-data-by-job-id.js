import EventTypeDataModel from '../../entity/event-event-type-data';

export default class GetEventTypeDataByJobId {
  constructor(eventJobId, callback) {
    EventTypeDataModel.find({
        eventJobId: eventJobId
      },
      (err, result) => {
        if (err) {
          global.gdsLogger.logError(err);
          callback({
            message: 'Failed getting event type data for job id' + jobId
          });
        } else {
          if (result) {
            callback(undefined, result);
          } else {
            callback({
              message: 'Failed getting event type data for job id' + jobId
            });
          }
        }
      }
    )
  }
}