import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToCompleted {
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'COMPLETED'
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event job status to completed'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}