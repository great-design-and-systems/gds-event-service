import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToLocked{
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'LOCKED'
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event job status to locked'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}