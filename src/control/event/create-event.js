import EventModel from '../../entity/event';

export default class CreateEvent {
    constructor(name, eventType, action, callback) {
        EventModel.create({
            name: name,
            eventType: eventType,
            action: action
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Failed saving event'
                });
            } else {
                callback(undefined, result);
            }
        });
    }
}