import EventTypeDataModel from '../../entity/event-event-type-data';

export default class CreateEventTypeData {
    constructor(jobId, isArray, size, start, callback) {
        EventTypeDataModel.create(
            {
                eventJobId: jobId,
                isArray: isArray,
                size: size,
                start: start
            },
            (err, result) => {
                if (err) {
                    global.gdsLogger.logError(err);
                    callback({
                        message: 'Failed creating event type data for job id' + jobId
                    });
                } else {
                    callback(undefined, result);
                }
            }
        )
    }
}