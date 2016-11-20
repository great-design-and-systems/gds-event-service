import EventTypeProcedureModel from '../../entity/event-type-procedure';

export default class RemoveEventTypeProcedureByJobId {
    constructor(eventJobId, interval, callback) {
        EventTypeProcedureModel.remove(
            {
                rootEventJobId: eventJobId
            },
            (err, result) => {
                if (err) {
                    callback({
                        message: 'Failed removing procedure event for job id' + eventJobId
                    });
                } else {
                    callback(undefined, result);
                }
            }
        )
    }
}