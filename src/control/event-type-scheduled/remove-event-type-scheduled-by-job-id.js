import EventTypeScheduledModel from '../../entity/event-type-scheduled';

export default class RemoveEventTypeScheduledByJobId {
    constructor(eventJobId, callback) {
        EventTypeScheduledModel.remove({
            eventJobId: eventJobId
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Failed removing event type scheduled for job id ' + eventJobId
                });
            } else {
                callback(undefined, result);
            }
        })
    }
}