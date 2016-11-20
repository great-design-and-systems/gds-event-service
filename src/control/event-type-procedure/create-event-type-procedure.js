import EventTypeProcedureModel from '../../entity/event-type-procedure';

export default class CreateEventTypeProcedure {
  constructor(eventJobId, rootEventJobId, nextData, previousEventJobId, interval, callback) {
    EventTypeProcedureModel.create({
        eventJobId: eventJobId,
        rootEventJobId: rootEventJobId,
        nextData: nextData,
        previousEventJobId: previousEventJobId,
        interval: interval
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