import EventContextModel from '../../entity/event-context';
export default class CreateEventContext {
    constructor(eventJobId, field, value, type, callback) {
        EventContextModel.create({
            eventJobId: eventJobId,
            field: field,
            value: value,
            type: type
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Failed to create event-context.'
                });
            } else {
                callback(undefined, result);
            }
        });
    }
}