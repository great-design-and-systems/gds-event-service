import EventTypeScheduledModel from '../../entity/event-type-scheduled';

export default class CreateEventTypeScheduled {
    constructor(eventJobId, nextEventJobId, dateTime, callback) {
        EventTypeScheduledModel.create({
            eventJobId: eventJobId,
            nextEventJobId: nextEventJobId,
            dateTime: dateTime
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