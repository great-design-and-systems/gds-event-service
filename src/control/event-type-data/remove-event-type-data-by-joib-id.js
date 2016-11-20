import EventTypeDataModel from '../../entity/event-event-type-data';

export default class RemoveEventTypeDataByJobId {
    constructor(eventJobId, callback) {
        EventTypeDataModel.remove(
            {
                eventJobId: eventJobId
            },
            (err, result) => {
                if (err) {
                    global.gdsLogger.logError(err);
                    callback({
                        message: 'Failed removing event type data for job id' + jobId
                    });
                } else {
                    callback(undefined, result);
                }
            }
        )
    }
}