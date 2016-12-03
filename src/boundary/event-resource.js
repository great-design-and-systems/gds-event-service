import {
    GDSDomainDTO,
    GDSDomainPaginateHelper,
} from 'gds-config';

import EventJobService from './event-jobs';
import EventService from './events';

const API = process.env.API_NAME || '/api/event/';

export default class EventResource {
    constructor(app) {
        const eventService = new EventService();
        const eventJobService = new EventJobService();

        app.get('/', (req, res) => {
            const domain = new GDSDomainDTO();
            // domain.addPost('createEvent', 'http://' + req.headers.host + API + 'create-event');
            // domain.addGet('getEvents', 'http://' + req.headers.host + API + 'get-events');
            // domain.addGet('getEventsById', 'http://' + req.headers.host + API + 'get-event-by-id/:eventId');
            // domain.addPut('updateEvent', 'http://' + req.headers.host + API + 'update-event/:eventId');
            // domain.addDelete('removeEvent', 'http://' + req.headers.host + API + 'remove-event/:eventId');
            // domain.addGet('getEventByName', 'http://' + req.headers.host + API + 'get-event-by-name/:eventName');
            domain.addPost('createJob', 'http://' + req.headers.host + API + 'create-job');
            domain.addDelete('removeJob', 'http://' + req.headers.host + API + 'remove-job/:eventJobId');
            domain.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/:contextId');
            domain.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/:contextId');
            domain.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/:contextId');
            domain.addPut('updateJobStatus', 'http://' + req.headers.host + API + 'jobs/:eventJobId/set-status/:status');
            domain.addGet('getJobs', 'http://' + req.headers.host + API + 'jobs');
            domain.addGet('getJobById', 'http://' + req.headers.host + API + 'get-job/:eventJobId');
            domain.addGet('getJobsByStatus', 'http://' + req.headers.host + API + 'jobs/:status');
            domain.addGet('getContextFieldByJobId', 'http://' + req.headers.host + API + 'get-context-field-by-job-id/:eventJobId');
            domain.addPut('updateProcedureContext', 'http://' + req.headers.host + API + 'update-procedure-context/:eventJobId');
            res.status(200).send(domain);
        });

        app.post(API + 'create-event', (req, res) => {
            eventService.createEvent(req.body.name, req.body.eventType, req.body.action, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const createDomain = new GDSDomainDTO('CREATE-EVENT', 'Event has been created');
                    createDomain.addGet('getEventsById', 'http://' + req.headers.host + API + 'get-event-by-id/' + result._id);
                    createDomain.addPut('updateEvent', 'http://' + req.headers.host + API + 'update-event/' + result._id);
                    createDomain.addDelete('removeEvent', 'http://' + req.headers.host + API + 'remove-event/' + result._id);
                    createDomain.addGet('getEventByName', 'http://' + req.headers.host + API + 'get-event-by-name/' + result.name);
                    res.status(200).send(createDomain);
                }
            });
        });

        app.get(API + 'get-events', (req, res) => {
            eventService.getEvents(new GDSDomainPaginateHelper(req),
                (err, result) => {
                    if (err) {
                        res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                            err.message
                        ));
                    } else {
                        const data = [];
                        const domain = new GDSDomainDTO('GET-EVENTS', data);
                        if (result && result.docs) {
                            let docDom;
                            result.docs.forEach(doc => {
                                docDom = new GDSDomainDTO('EVENT', doc);
                                docDom.addGet('getEventsById', 'http://' + req.headers.host + API + 'get-event-by-id/' + doc._id);
                                docDom.addPut('updateEvent', 'http://' + req.headers.host + API + 'update-event/' + doc._id);
                                docDom.addDelete('removeEvent', 'http://' + req.headers.host + API + 'remove-event/' + doc._id);
                                docDom.addGet('getEventByName', 'http://' + req.headers.host + API + 'get-event-by-name/' + doc.name);
                                data.push(docDom);
                            });
                        }
                        res.status(200).send(domain);
                    }
                });
        });

        app.get(API + 'get-event-by-id/:eventId', (req, res) => {
            eventService.getEventById(req.params.eventId, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('GET-EVENT-BY-ID', result);
                    domain.addPut('updateEvent', 'http://' + req.headers.host + API + 'update-event/' + result._id);
                    domain.addDelete('removeEvent', 'http://' + req.headers.host + API + 'remove-event/' + result._id);
                    res.status(200).send(domain);
                }
            });
        });

        app.put(API + 'update-event/:eventId', (req, res) => {
            eventService.updateEvent(req.params.eventId, req.body, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ))
                } else {
                    const domain = new GDSDomainDTO('UPDATE-EVENT', 'Event has been updated');
                    domain.addGet('getEventsById', 'http://' + req.headers.host + API + 'get-event-by-id/' + result._id);
                    domain.addDelete('removeEvent', 'http://' + req.headers.host + API + 'remove-event/' + result._id);
                    res.status(200).send(domain);
                }
            });
        });

        app.delete(API + 'remove-event/:eventId', (req, res) => {
            eventService.removeEventById(req.params.eventId, (err) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ))
                } else {
                    res.status(200).send(new GDSDomainDTO('REMOVE-EVENT', 'Event has been removed'));
                }
            });
        });

        app.get(API + 'get-event-by-name/:eventName', (req, res) => {
            eventService.getEventByName(req.params.eventName, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('GET-EVENT-BY-NAME', result);
                    domain.addPut('updateEvent', 'http://' + req.headers.host + API + 'update-event/' + result._id);
                    domain.addDelete('removeEvent', 'http://' + req.headers.host + API + 'remove-event/' + result._id);
                    res.status(200).send(domain);
                }
            });
        });

        app.get(API + 'get-context-field-by-id/:contextId', (req, res) => {
            eventJobService.getContextField(req.params.contextId, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('GET-EVENT-CONTEXT-BY-ID', result);
                    domain.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + result._id);
                    domain.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + result._id);
                    res.status(200).send(domain);
                }
            });
        });

        app.put(API + 'update-context-field/:contextId', (req, res) => {
            eventJobService.updateContextField(req.params.contextId, req.body, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('UPDATE-CONTEXT-FIELD', result);
                    domain.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + req.params.contextId);
                    res.status(200).send(domain);
                }
            });
        });

        app.delete(API + 'remove-context-field-by-id/:contextId', (req, res) => {
            eventJobService.removeContextField(req.params.contextId, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('REMOVE-EVENT-CONTEXT-BY-ID', result);
                    res.status(200).send(domain);
                }
            });
        });

        app.post(API + 'create-job', (req, res) => {
            const eventName = req.params.eventName;
            eventJobService.createEventJob(req.body, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE', err.message));
                } else {
                    const domain = new GDSDomainDTO('JOB', result);
                    domain.addDelete('removeJob', 'http://' + req.headers.host + API + 'remove-job/' + result.jobId);
                    domain.addGet('getJob', 'http://' + req.headers.host + API + 'get-job/' + result.jobId);
                    if (result && result.context) {
                        if (result.context.body) {
                            result.context.body.forEach(contextDTO => {
                                contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                            });
                        }
                        if (result.context.header) {
                            result.context.header.forEach(contextDTO => {
                                contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                            });
                        }
                        if (result.context.param) {
                            result.context.param.forEach(contextDTO => {
                                contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                            });
                        }
                        if (result.context.query) {
                            result.context.query.forEach(contextDTO => {
                                contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                            });
                        }
                    } else if (result && result.eventSequence) {
                        result.eventSequence.forEach(sequence => {
                            sequence.addDelete('removeJob', 'http://' + req.headers.host + API + 'remove-job/' + sequence.data.jobId);
                            sequence.addGet('getJob', 'http://' + req.headers.host + API + 'get-job/' + sequence.data.jobId);
                            if (sequence.data.context) {
                                if (sequence.data.context.body) {
                                    sequence.data.context.body.forEach(contextDTO => {
                                        contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                                    });
                                }
                                if (sequence.data.context.header) {
                                    sequence.data.context.header.forEach(contextDTO => {
                                        contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                                    });
                                }
                                if (sequence.data.context.param) {
                                    sequence.data.context.param.forEach(contextDTO => {
                                        contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                                    });
                                }
                                if (sequence.data.context.query) {
                                    sequence.data.context.query.forEach(contextDTO => {
                                        contextDTO.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + contextDTO.data._id);
                                        contextDTO.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + contextDTO.data._id);
                                    });
                                }
                            }
                        });
                    }
                    res.status(200).send(domain);
                }
            });
        });

        app.get(API + 'get-job/:eventJobId', (req, res) => {
            eventJobService.getEventJobById(req.params.eventJobId, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('GET-JOB-BY-ID', result);
                    if (result) {
                        domain.addDelete('removeJob', 'http://' + req.headers.host + API + 'remove-job/' + result._id);
                        domain.addGet('getContextFieldByJobId', 'http://' + req.headers.host + API + 'get-context-field-by-job-id/' + result._id);
                        domain.addPut('setJobToInProgress', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/IN_PROGRESS');
                        domain.addPut('setJobToCompleted', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/COMPLETED');
                        domain.addPut('setJobToLocked', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/LOCKED');
                        domain.addPut('setJobToStopped', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/STOPPED');
                        domain.addPut('setJobToScheduled', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/SCHEDULED');
                        domain.addPut('setJobToNew', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/NEW');
                        domain.addPut('setJobToOnHold', 'http://' + req.headers.host + API + 'jobs/' + result._id + '/set-status/ON_HOLD');
                        res.status(200).send(domain);
                    } else {
                        res.status(404).send(new GDSDomainDTO('JOB_NOT_FOUND', null));
                    }
                }
            });
        });

        app.delete(API + 'remove-job/:eventJobId', (req, res) => {
            eventJobService.removeEventJob(req.params.eventJobId, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('REMOVE-JOB-BY-ID', result);
                    res.status(200).send(domain);
                }
            });
        });

        app.put(API + 'jobs/:eventJobId/set-status/:status', (req, res) => {
            eventJobService.updateStatus(req.params.eventJobId, req.params.status, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const domain = new GDSDomainDTO('UPDATE-STATUS', result);
                    res.status(200).send(domain);
                }
            });
        });

        app.get(API + 'jobs', (req, res) => {
            eventJobService.getJobs((err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE', err.message));
                } else {
                    const resultDTOData = [];
                    const domain = new GDSDomainDTO('GET-JOBS', resultDTOData);
                    if (result) {
                        result.forEach((job) => {
                            const jobDom = new GDSDomainDTO('JOB', job);
                            jobDom.addGet('getJobById', 'http://' + req.headers.host + API + 'get-job/' + job._id);
                            jobDom.addDelete('removeJob', 'http://' + req.headers.host + API + 'remove-job/' + job._id);
                            jobDom.addGet('getContextFieldByJobId', 'http://' + req.headers.host + API + 'get-context-field-by-job-id/' + job._id);
                            jobDom.addPut('setJobToInProgress', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/IN_PROGRESS');
                            jobDom.addPut('setJobToCompleted', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/COMPLETED');
                            jobDom.addPut('setJobToLocked', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/LOCKED');
                            jobDom.addPut('setJobToStopped', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/STOPPED');
                            jobDom.addPut('setJobToScheduled', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/SCHEDULED');
                            jobDom.addPut('setJobToNew', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/NEW');
                            jobDom.addPut('setJobToOnHold', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/ON_HOLD');
                            resultDTOData.push(jobDom);
                        });
                    }
                    res.status(200).send(domain);
                }
            });
        });
        app.get(API + 'jobs/:status', (req, res) => {
            eventJobService.getJobsByStatus(req.params.status, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE', err.message));
                } else {
                    const resultDTOData = [];
                    const domain = new GDSDomainDTO('GET-JOBS', resultDTOData);
                    if (result) {
                        result.forEach((job) => {
                            const jobDom = new GDSDomainDTO('JOB', job);
                            jobDom.addDelete('removeJob', 'http://' + req.headers.host + API + 'remove-job/' + job._id);
                            jobDom.addGet('getContextFieldByJobId', 'http://' + req.headers.host + API + 'get-context-field-by-job-id/' + job._id);
                            jobDom.addPut('setJobToInProgress', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/IN_PROGRESS');
                            jobDom.addPut('setJobToCompleted', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/COMPLETED');
                            jobDom.addPut('setJobToLocked', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/LOCKED');
                            jobDom.addPut('setJobToStopped', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/STOPPED');
                            jobDom.addPut('setJobToScheduled', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/SCHEDULED');
                            jobDom.addPut('setJobToNew', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/NEW');
                            jobDom.addPut('setJobToOnHold', 'http://' + req.headers.host + API + 'jobs/' + job._id + '/set-status/ON_HOLD');
                            resultDTOData.push(jobDom);
                        });
                    }
                    res.status(200).send(domain);
                }
            });
        });

        app.get(API + 'get-context-field-by-job-id/:eventJobId', (req, res) => {
            eventJobService.getContextFieldByJobId(req.params.eventJobId, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    const contexts = [];
                    const domain = new GDSDomainDTO('EVENT_CONTEXTS', contexts);
                    if (result) {
                        result.forEach(context => {
                            const contextDomain = new GDSDomainDTO('EVENT_CONTEXT', context);
                            contextDomain.addGet('getContextFieldById', 'http://' + req.headers.host + API + 'get-context-field-by-id/' + context._id);
                            contextDomain.addDelete('removeContextFieldById', 'http://' + req.headers.host + API + 'remove-context-field-by-id/' + context._id);
                            contextDomain.addPut('updateContextField', 'http://' + req.headers.host + API + 'update-context-field/' + context._id);
                            contexts.push(contextDomain);
                        });
                    }
                    res.status(200).send(domain);
                }
            });
        });

        app.put(API + 'update-procedure-context/:eventJobId', (req, res) => {
            eventJobService.updateProcedureContext(req.params.eventJobId, req.body, (err, result) => {
                if (err) {
                    res.status(500).send(new GDSDomainDTO('ERROR_MESSAGE',
                        err.message
                    ));
                } else {
                    res.status(200).send(new GDSDomainDTO('UPDATE-PROCEDURE-CONTEXT', result));
                }
            });
        });
    }
}