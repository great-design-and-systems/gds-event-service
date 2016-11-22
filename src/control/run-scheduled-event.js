import CreateEventJob from './event-job/create-event-job';
import CreateEventTypeScheduled from './event-type-scheduled/create-event-type-scheduled';
import ProcessInput from '../control/process-input';
import RemoveEventJobById from './event-job/remove-event-job-by-id';
import RunProcessEvent from './run-process-event';
import batch from 'batchflow';
import lodash from 'lodash';

export default class RunScheduledEvent {
    constructor(eventName, context, callback) {
        try {
            contextValidation(context);
            const resultJob = {};
            const nextEvent = context.data.nextEvent;
            new CreateEventJob(eventName, context.session, 'NEW', 'SCHEDULED', 'N/A', (errorJob, processJob) => {
                try {
                    if (errorJob) {
                        global.gdsLogger.logError(errorJob);
                        callback({
                            message: 'Failed creating event job for scheduled event type'
                        });
                    } else {
                        processEvents(context, (errEvents, nextEventJob) => {
                            if (errEvents || !nextEventJob) {
                                callback({
                                    message: 'Failed creating event job for scheduled event type'
                                });
                            } else {
                                new CreateEventTypeScheduled(processJob._id, nextEventJob.jobId, context.data.cronInterval, (errScheduled) => {
                                    if (errScheduled) {
                                        global.gdsLogger.logError(errScheduled);
                                        new RemoveEventJobById(processJob._id, () => {
                                            callback({
                                                message: 'Failed creating event type scheduled for job id ' + processJob._id
                                            });
                                        });
                                    } else {
                                        resultJob.jobId = processJob._id;
                                        resultJob.eventType = 'SCHEDULED';
                                        resultJob.eventName = eventName;
                                        resultJob.session = context.session;
                                        resultJob.nextEvent = nextEventJob;
                                        callback(undefined, resultJob);
                                    }
                                });
                            }
                        });
                    }
                } catch (errorJob) {
                    global.gdsLogger.logError(errorJob);
                    callback({
                        message: 'Failed creating job for ' + eventName
                    });
                }
            });
        } catch (err) {
            callback(err);
        }
    }
}

function contextValidation(context) {
    if (!context.data.cronInterval) {
        throw new Error('data.cronInterval is required for this event type.');
    } else if (!context.data.nextEvent) {
        throw new Error('data.nextEvent object is required for this event type.');
    } else if (!context.data.nextEvent.eventType) {
        throw new Error('data.nextEvent.eventType is required for this event type.');
    } else if (!context.data.nextEvent.eventType === 'SCHEDULED') {
        throw new Error('data.nextEvent.eventType SCHEDULED? You can\'t do that. Mate!');
    } else if (!context.data.nextEvent.eventName) {
        throw new Error('data.nextEvent.eventName is required for this event type.');
    }
}

function processEvents(context, callback) {
    const nextEvent = {};
    nextEvent.data = {};
    nextEvent.session = context.session;
    nextEvent.input = context.data.nextEvent.input;
    nextEvent.data.eventName = context.data.nextEvent.eventName;
    nextEvent.data.eventType = context.data.nextEvent.eventType;
    nextEvent.data.action = context.data.nextEvent.action;
    nextEvent.status = 'ON_HOLD';
    switch (nextEvent.data.eventType) {
        case 'PROCESS':
            new RunProcessEvent(nextEvent.data.eventName, nextEvent, callback);
            break;
        case 'PROCEDURE':
            //TODO
            break;
    }
}