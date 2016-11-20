import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToInProgress {
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'IN_PROGRESS'
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event job status to in progress'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}