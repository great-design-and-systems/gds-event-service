import EventJobModel from '../../entity/event-job';

export default class GetEventJobs {
  constructor(callback) {
    const BATCH_COUNT = process.env.BATCH_COUNT || 25;
    EventJobModel.find({}).limit(BATCH_COUNT).exec((err, result) => {
      if (err) {
        global.gdsLogger.logError(err);
        callback({
          message: 'No batch event jobs found.'
        });
      } else {
        callback(undefined, result);
      }
    });
  }
}