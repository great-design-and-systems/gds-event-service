import EventContextModel from '../../entity/event-context';
export default class RemoveEventContextById {
    constructor(eventContextId, callback) {
        EventContextModel.remove({
            _id: eventContextId
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Failed to remove event-context.'
                });
            } else {
                callback(undefined, result);
            }
        });
    }
}