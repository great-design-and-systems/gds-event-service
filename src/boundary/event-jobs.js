import CreateEventJob from '../control/event-job/create-event-job';
import GetEventByName from '../control/event/get-event-by-name';
import GetEventContextById from '../control/event-context/get-event-context-by-id';
import GetEventContextByJobId from '../control/event-context/get-event-context-by-job-id';
import GetEventJobById from '../control/event-job/get-event-job-by-id';
import GetEventJobs from '../control/event-job/get-event-jobs';
import GetEventJobsByStatus from '../control/event-job/get-event-jobs-by-status';
import GetEventTypeProcedureByJobId from '../control/event-type-procedure/get-event-type-procedure-by-job-id';
import GetEventTypeScheduledByJobId from '../control/event-type-scheduled/get-event-type-scheduled-by-job-id';
import RemoveEventContextById from '../control/event-context/remove-event-context-by-job-id';
import RemoveEventContextByJobId from '../control/event-context/remove-event-context-by-job-id';
import RemoveEventJobById from '../control/event-job/remove-event-job-by-id';
import RemoveEventTypeProcessByJobId from '../control/event-type-process/remove-event-type-process-by-job-id';
import RemoveEventTypeScheduledByJobId from '../control/event-type-scheduled/remove-event-type-scheduled-by-job-id';
import RunProcedureEvent from '../control/run-procedure-event';
import RunProcessEvent from '../control/run-process-event';
import RunScheduledEvent from '../control/run-scheduled-event';
import UpdateEventContext from '../control/event-context/update-event-context';
import UpdateEventJobStatusToCompleted from '../control/event-job/update-event-job-status-to-completed';
import UpdateEventJobStatusToInProgress from '../control/event-job/update-event-job-status-to-in-progress';
import UpdateEventJobStatusToLocked from '../control/event-job/update-event-job-status-to-locked';
import UpdateEventJobStatusToNew from '../control/event-job/update-event-job-status-to-new';
import UpdateEventJobStatusToOnHold from '../control/event-job/update-event-job-status-to-on-hold';
import UpdateEventJobStatusToScheduled from '../control/event-job/update-event-job-status-to-scheduled';
import UpdateEventJobStatusToStopped from '../control/event-job/update-event-job-status-to-stopped';
import UpdateEventTypeProcedureByJobId from '../control/event-type-procedure/update-event-type-procedure-by-job-id';

export default class EventJobService {
    getJobsByStatus(status, callback) {
        new GetEventJobsByStatus(status, callback);
    }
    getJobs(callback) {
        new GetEventJobs(callback);
    }
    createEventJob(context, callback) {
        try {
            eventValidation(context);
            const eventName = context.data.eventName;
            const eventType = context.data.eventType;

            switch (eventType) {
                case 'PROCESS':
                    new RunProcessEvent(eventName, context, callback.bind(this));
                    break;
                case 'SCHEDULED':
                    new RunScheduledEvent(eventName, context, callback.bind(this));
                    break;
                case 'PROCEDURE':
                    new RunProcedureEvent(eventName, context, callback.bind(this));
                    break;
            }

        } catch (err) {
            if (err instanceof Error) {
                callback({
                    message: err.message
                });
            } else {
                callback({
                    message: 'Event job creation failed.'
                });
            }
        }
    }
    removeEventJob(eventJobId, callback) {
        console.log('remove', eventJobId);
        new GetEventJobById(eventJobId, (errEventJob, eventJob) => {
            if (errEventJob) {
                callback(errEventJob);
            } else {
                switch (eventJob.eventType) {
                    case 'PROCESS':
                        new RemoveEventTypeProcessByJobId(eventJobId, (err) => {
                            if (err) {
                                callback(err);
                            } else {
                                removeContexts();
                            }
                        });
                        break;
                    case 'SCHEDULED':
                        new GetEventTypeScheduledByJobId(eventJobId, (err, result) => {
                            if (err) {
                                callback(err);
                            } else {
                                console.log('scheduled', result);
                                new EventJobService().removeEventJob(result.nextEventJobId, (errProcess) => {
                                    if (errProcess) {
                                        callback(errProcess);
                                    } else {
                                        new RemoveEventTypeScheduledByJobId(eventJobId, (err) => {
                                            if (err) {
                                                callback(err)
                                            } else {
                                                new RemoveEventJobById(eventJobId, callback);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        break;
                }
            }

            function removeContexts() {
                new RemoveEventContextByJobId(eventJobId, (errorRemoveContext) => {
                    if (errorRemoveContext) {
                        callback(errorRemoveContext);
                    } else {
                        new RemoveEventJobById(eventJobId, callback);
                    }
                });
            }

        });
    }
    getEventJobById(eventJobId, callback) {
        new GetEventJobById(eventJobId, (errJob, job) => {
            try {
                if (errJob) {
                    throw errJob;
                }
                const result = {};
                const eventType = job.eventType;
                const jobId = job._id;
                result._id = jobId;
                result.eventType = eventType;
                result.status = job.status;
                result.action = job.action;
                result.triggeredBy = job.triggeredBy;
                result.createdOn = job.createdOn;
                switch (eventType) {
                    case 'PROCEDURE':
                        new GetEventTypeProcedureByJobId(jobId, (errProcJob, procedure) => {
                            if (errProcJob) {
                                throw errProcJob;
                            }
                            result.procedure = procedure;
                            callback(undefined, result);
                        });
                        break;
                    case 'SCHEDULED':
                        new GetEventTypeScheduledByJobId(jobId, (errSchedJob, scheduled) => {
                            result.scheduled = scheduled;
                            callback(undefined, result);
                        });
                        break;
                    default:
                        callback(undefined, result);
                        break;
                }
            } catch (err) {
                global.gdsLogger.logError(err);
                callback(err);
            }
        });
    }
    getContextField(contextId, callback) {
        new GetEventContextById(contextId, callback);
    }
    removeContextField(contextId, callback) {
        new RemoveEventContextById(contextId, callback);
    }
    updateContextField(contextId, context, callback) {
        new UpdateEventContext(contextId, context, callback);
    }
    updateStatus(eventJobId, status, callback) {
        switch (status) {
            case 'IN_PROGRESS':
                new UpdateEventJobStatusToInProgress(eventJobId, callback);
                break;
            case 'COMPLETED':
                new UpdateEventJobStatusToCompleted(eventJobId, callback);
                break;
            case 'LOCKED':
                new UpdateEventJobStatusToLocked(eventJobId, callback);
                break;
            case 'STOPPED':
                new UpdateEventJobStatusToStopped(eventJobId, callback);
                break;
            case 'SCHEDULED':
                new UpdateEventJobStatusToScheduled(eventJobId, callback);
                break;
            case 'NEW':
                new UpdateEventJobStatusToNew(eventJobId, callback);
                break;
            case 'ON_HOLD':
                new UpdateEventJobStatusToOnHold(eventJobId, callback);
                break;
        }
    }
    getContextFieldByJobId(eventJobId, callback) {
        new GetEventContextByJobId(eventJobId, callback);
    }
    updateProcedureContext(eventJobId, context, callback) {
        new UpdateEventTypeProcedureByJobId(eventJobId, { context: JSON.stringify(context) }, callback);
    }
}

function eventValidation(context) {
    if (!context) {
        throw new Error('Request body is required.');
    } else if (!context.data) {
        throw new Error('Request data is required.');
    } else if (!context.data.eventType) {
        throw new Error('data.eventType is required.');
    } else if (!context.data.eventName) {
        throw new Error('data.eventName is required.');
    } else if (!context.session) {
        throw new Error('Request session is required.');
    }
}