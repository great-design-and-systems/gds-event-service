import CreateEventJob from './event-job/create-event-job';
import CreateEventTypeProcedure from './event-type-procedure/create-event-type-procedure';
import { GDSDomainDTO } from 'gds-config';
import ProcessInput from '../control/process-input';
import RemoveEventJobById from './event-job/remove-event-job-by-id';
import RunProcessEvent from './run-process-event';
import batch from 'batchflow';
import lodash from 'lodash';

export default class RunProcedureEvent {
    constructor(eventName, context, callback) {
        try {
            contextValidation(context);
            const eventSequence = context.data.eventSequence;
            const resultJob = {};
            processEventSequence(context, (errSequence, resultSequence) => {
                if (errSequence) {
                    throw errSequence;
                } else {
                    const nextJobId = resultSequence.nextJobId;
                    const resultJobs = resultSequence.resultJobs;
                    new CreateEventJob(context.data.eventName, context.session, 'NEW', 'PROCEDURE', 'N/A', (errJob, processJob) => {
                        if (errJob) {
                            throw errJob;
                        } else {
                            new CreateEventTypeProcedure(processJob._id, nextJobId, (errProcedure) => {
                                if (errProcedure) {
                                    new RemoveEventJobById(processJob._id, () => {
                                        throw new Error('Failed creating event type procedure for job id ' + processJob._id);
                                    });
                                } else {
                                    resultJob.jobId = processJob._id;
                                    resultJob.eventType = 'PROCEDURE';
                                    resultJob.eventName = eventName;
                                    resultJob.session = context.session;
                                    resultJob.eventSequence = resultJobs;
                                    callback(undefined, resultJob);
                                }
                            });
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

function sequenceValidation(event) {
    if (!event.eventName) {
        throw new Error('eventName is required.');
    }
    if (!event.action) {
        throw new Error('action is required.');
    }
}

function processEventSequence(context, callback) {
    let previousJobId;
    const resultEvent = [];
    batch(lodash.reverse(context.data.eventSequence)).sequential()
        .each((i, value, next) => {
            try {
                sequenceValidation(value);
                const eventName = value.eventName;
                const action = value.action;
                const input = value.input;
                const resultJob = {};
                new CreateEventJob(eventName, context.session, 'ON_HOLD', 'PROCEDURE', action, (errJob, processJob) => {
                    if (errJob || !processJob) {
                        if (errJob) {
                            global.gdsLogger.logError(errJob);
                        }
                        throw new Error('Failed to create event Job for ' + eventName);
                    } else {
                        resultJob.jobId = processJob._id;
                        resultJob.eventType = processJob.eventType;
                        resultJob.eventName = processJob.eventName;
                        resultJob.action = processJob.action;
                        resultJob.nextJob = previousJobId;
                        if (input) {
                            new ProcessInput(processJob._id, input, (errProcessInput, resultInput) => {
                                if (errProcessInput) {
                                    new RemoveEventJobById(processJob._id, () => {
                                        throw new Error('Failed creating event context for job id ' + processJob._id);
                                    });
                                } else {
                                    createEventProcedure(processJob, previousJobId, () => {
                                        previousJobId = processJob._id;
                                        resultJob.context = resultInput;
                                        resultEvent.push(new GDSDomainDTO('JOB_SEQUENCE', resultJob));
                                        next();
                                    });
                                }
                            });
                        } else {
                            createEventProcedure(processJob, previousJobId, () => {
                                previousJobId = processJob._id;
                                resultEvent.push(new GDSDomainDTO('JOB_SEQUENCE', resultJob));
                                next();
                            });
                        }

                    }
                });
            } catch (err) {
                global.gdsLogger.logError(err);
                callback(err);
            }
        })
        .end(() => {
            callback(undefined, {
                nextJobId: previousJobId,
                resultJobs: lodash.reverse(resultEvent)
            });
        });
}

function createEventProcedure(processJob, nextEventJobId, callback) {
    new CreateEventTypeProcedure(processJob._id, nextEventJobId, (errProcedure) => {
        if (errProcedure) {
            new RemoveEventJobById(processJob._id, () => {
                throw new Error('Failed creating event type procedure for job id ' + processJob._id);
            });
        } else {
            callback();
        }
    });
}