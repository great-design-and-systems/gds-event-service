import CreateEventJob from './event-job/create-event-job';
import CreateEventTypeProcedure from './event-type-procedure/create-event-type-procedure';
import ProcessInput from '../control/process-input';
import RemoveEventJobById from './event-job/remove-event-job-by-id';
import RunProcessEvent from './run-process-event';
import batch from 'batchflow';
import lodash from 'lodash';

export default class RunProcedureEvent {
    constructor(eventName, context, nextEventJobId, callback) {
        try {
            contextValidation(context);
            const resultJob = {};
            const nextEvent = context.data.nextEvent;
            new CreateEventJob(eventName, context.session, 'NEW', 'PROCEDURE', 'N/A', (errorJob, processJob) => {
                if (errorJob) {
                    global.gdsLogger.logError(errorJob);
                    throw new Error('Failed creating event job for procedure event type');
                } else {
                    new CreateEventTypeProcedure(processJob._id, nextEventJobId, context.data.interval, (errProcedure) => {
                        if (errProcedure) {
                            global.gdsLogger.logError(errProcedure);
                            new RemoveEventJobById(processJob._id, () => {
                                throw new Error('Failed creating event context for job id ' + processJob._id);
                            });
                        } else {
                            resultJob.jobId = processJob._id;
                            resultJob.eventType = 'PROCEDURE';
                            resultJob.eventName = eventName;
                            resultJob.session = context.session;
                            resultJob.nextEvent = nextEventJob;
                            callback(undefined, resultJob);
                        }
                    });
                }
            });
        } catch (err) {
            global.gdsLogger.logError(err);
            callback(err);
        }
    }
}

function contextValidation(context) {
    if (!context.data.eventSequence) {
        throw new Error('data.eventSequence array is required.');
    }
}

function processEventSequence(context, callback) {

}