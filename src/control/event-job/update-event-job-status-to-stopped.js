import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToStopped {
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'STOPPED'
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