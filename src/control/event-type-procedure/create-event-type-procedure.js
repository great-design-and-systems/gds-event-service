import EventTypeProcedureModel from '../../entity/event-type-procedure';

export default class CreateEventTypeProcedure {
  constructor(eventJobId, nextEventJobId, callback) {
    EventTypeProcedureModel.create({
      eventJobId: eventJobId,
      nextEventJobId: nextEventJobId
    },
      (err, result) => {
        if (err) {
          callback({
            message: 'Failed creating procedure event for job id' + eventJobId
          });
        } else {
          callback(undefined, result);
        }
      }
    )
  }
}