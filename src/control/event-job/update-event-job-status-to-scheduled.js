import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToScheduled {
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'SCHEDULED'
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event job status to scheduled'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}