import CreateEventJob from './event-job/create-event-job';
import ProcessInput from '../control/process-input';
import RemoveEventJobById from './event-job/remove-event-job-by-id';
import batch from 'batchflow';
import lodash from 'lodash';

export default class RunProcessEvent {
    constructor(eventName, context, callback) {
        try {
            const resultJob = {};
            const status = context.status ? context.status : 'NEW';
            contextValidation(context);
            new CreateEventJob(eventName, context.session, status, 'PROCESS', context.data.action, (errorJob, processJob) => {
                try {
                    if (errorJob) {
                        global.gdsLogger.logError(errorJob);
                        callback({
                            message: 'Failed creating event job for process event type'
                        });
                    } else {
                        resultJob.jobId = processJob._id;
                        resultJob.eventType = 'PROCESS';
                        resultJob.eventName = eventName;
                        resultJob.session = context.session;
                        if (context.input) {
                            new ProcessInput(processJob._id, context.input, (errProcessInput, resultInput) => {
                                if (errProcessInput) {
                                    global.gdsLogger.logError(errProcessInput);
                                    new RemoveEventJobById(processJob._id, () => {
                                        callback({
                                            message: 'Failed creating event context for job id ' + processJob._id
                                        });
                                    });
                                } else {
                                    resultJob.context = resultInput;
                                    callback(undefined, resultJob);
                                }
                            });
                        } else {
                            callback(undefined, resultJob);
                        }

                    }
                } catch (errorJob) {
                    global.gdsLogger.logError(errorJob);
                    callback({
                        message: 'Failed creating job for ' + eventName
                    });
                }
            });
        } catch (err) {
            if (err instanceof Error) {
                callback({
                    message: err.message
                });
            } else {
                callback({
                    message: err
                });
            }
        }
    }
}

function contextValidation(context) {
    if (!context.data.action) {
        throw new Error('data.action is required for this event type');
    }
}