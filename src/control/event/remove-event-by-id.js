import EventModel from '../../entity/event';

export default class RemoveEventById {
    constructor(id, callback) {
        EventModel.remove({
            _id: id
        }, (err) => {
            if (err) {
                global.gdsLogger.error(err);
                callback({
                    message: 'Failed saving event'
                });
            } else {
                callback();
            }
        });
    }
}