import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToNew {
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'NEW'
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event job status to new'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}