import EventJobModel from '../../entity/event-job';
export default class UpdateEventJobStatusToOnHold{
  constructor(eventJobId, callback) {
    EventJobModel.findByIdAndUpdate(eventJobId, {
      status: 'ON_HOLD'
    }, (err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'Failed updating event job status to on hold'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}