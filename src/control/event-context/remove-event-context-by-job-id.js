import EventContextModel from '../../entity/event-context';
export default class RemoveEventContextByJobId {
    constructor(eventJobId, callback) {
        EventContextModel.remove({
            eventJobId: eventJobId
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Failed to remove event-context for job id ' + eventJobId
                });
            } else {
                callback(undefined, result);
            }
        });
    }
}