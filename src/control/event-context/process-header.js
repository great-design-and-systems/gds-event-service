import CreateEventContext from './create-event-context';
import {
    GDSDomainDTO,
} from 'gds-config';
import RemoveEventContextByJobId from './remove-event-context-by-job-id';
import batch from 'batchflow';
import lodash from 'lodash';

export default class ProcessHeader {
    constructor(eventJobId, inputHeader, callback) {
        processHeader(eventJobId, inputHeader, callback);
    }
}

function processHeader(eventJobId, inputHeader, callback) {
    const resultHeader = [];
    batch(inputHeader).sequential()
        .each((field, value, next) => {
            new CreateEventContext(eventJobId, field, value, 'PATH',
                (err, result) => {
                    if (err) {
                        global.gdsLogger.logError(err);
                        new RemoveEventContextByJobId(eventJobId, () => {
                            callback({
                                message: 'Failed saving event context path for header ' + field
                            });
                        });
                    } else {
                        resultHeader.push(new GDSDomainDTO('EVENT-CONTEXT-HEADER', result));
                        next();
                    }
                });
        })
        .end(() => {
            callback(undefined, resultHeader);
        });
}