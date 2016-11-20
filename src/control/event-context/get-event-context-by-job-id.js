import EventContextModel from '../../entity/event-context';
export default class GetEventContextByJobId {
    constructor(eventJobId, callback) {
        EventContextModel.find({
            eventJobId: eventJobId
        }, (err, result) => {
            if (err) {
                global.gdsLogger.logError(err);
                callback({
                    message: 'Event context not found for job id' + eventJobId
                });
            } else {
                callback(undefined, result);
            }
        });
    }
}