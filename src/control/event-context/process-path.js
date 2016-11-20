import CreateEventContext from './create-event-context';
import {
    GDSDomainDTO,
} from 'gds-config';
import RemoveEventContextByJobId from './remove-event-context-by-job-id';
import batch from 'batchflow';
import lodash from 'lodash';

export default class ProcessPath {
    constructor(eventJobId, inputPath, callback) {
        processPath(eventJobId, inputPath, callback);
    }
}

function processPath(eventJobId, inputPath, callback) {
    const resultPath = [];
    batch(inputPath).sequential()
        .each((field, value, next) => {
            new CreateEventContext(eventJobId, field, value, 'PATH',
                (err, result) => {
                    if (err) {
                        global.gdsLogger.logError(err);
                        new RemoveEventContextByJobId(eventJobId, () => {
                            callback({
                                message: 'Failed saving event context path for field ' + field
                            });
                        });
                    } else {
                        resultPath.push(new GDSDomainDTO('EVENT-CONTEXT-PATH', result));
                        next();
                    }
                });
        })
        .end(() => {
            callback(undefined, resultPath);
        });
}