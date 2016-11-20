import EventTypeScheduledModel from '../../entity/event-type-scheduled';

export default class CreateEventTypeScheduled {
    constructor(eventJobId, nextEventJobId, cronInterval, callback) {
        EventTypeScheduledModel.create({
            eventJobId: eventJobId,
            nextEventJobId: nextEventJobId,
            cronInterval: cronInterval
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Failed creating event type scheduled for job id ' + eventJobId
                });
            } else {
                callback(undefined, result);
            }
        })
    }
}