import CreateEventContext from './create-event-context';
import {
    GDSDomainDTO,
} from 'gds-config';
import RemoveEventContextByJobId from './remove-event-context-by-job-id';
import batch from 'batchflow';
import lodash from 'lodash';

export default class ProcessQuery {
    constructor(eventJobId, query, callback) {
        processQuery(eventJobId, query, callback);
    }
}

function processQuery(eventJobId, query, callback) {
    let resultQuery = [];
    batch(query).sequential()
        .each((field, value, next) => {
            if (value instanceof Array) {
                processQueryArray(eventJobId, field, value, (err, result) => {
                    if (err) {
                        global.gdsLogger.logError(err);
                        new RemoveEventContextByJobId(eventJobId, () => {
                            callback({
                                message: 'Failed saving event context query for field ' + field
                            });
                        });
                    } else {
                        resultQuery = resultQuery.concat(result);
                        next();
                    }
                });
            } else {
                new CreateEventContext(eventJobId, field, value, 'QUERY',
                    (err, result) => {
                        if (err) {
                            global.gdsLogger.logError(err);
                            new RemoveEventContextByJobId(eventJobId, () => {
                                callback({
                                    message: 'Failed saving event context query for field ' + field
                                });
                            });
                        } else {
                            resultQuery.push(new GDSDomainDTO('EVENT-CONTEXT-QUERY', result));
                            next();
                        }
                    });
            }
        })
        .end(() => {
            callback(undefined, resultQuery);
        });
}

function processQueryArray(eventJobId, field, values, callback) {
    const resultQuery = [];
    batch(values).sequential()
        .each((i, value, next) => {
            new CreateEventContext(eventJobId, field, value, 'QUERY',
                (err, result) => {
                    if (err) {
                        global.gdsLogger.logError(err);
                        new RemoveEventContextByJobId(eventJobId, () => {
                            callback({
                                message: 'Failed saving event context query for field ' + field
                            });
                        });
                    } else {
                        resultQuery.push(new GDSDomainDTO('EVENT-CONTEXT-QUERY', result));
                        next();
                    }
                });
        })
        .end(() => {
            callback(undefined, resultQuery);
        });
}