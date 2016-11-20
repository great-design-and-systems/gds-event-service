import batch from 'batchflow';
import lodash from 'lodash';
import CreateEventContext from './create-event-context';
import RemoveEventContextByJobId from './remove-event-context-by-job-id';
import {
  GDSDomainDTO
} from 'gds-config';

export default class ProcessBody {
  constructor(eventJobId, body, callback) {
    processBody(eventJobId, body, callback);
  }
}

function processBody(eventJobId, body, callback) {
  const resultBody = [];
  batch(body).sequential()
    .each((field, value, next) => {
      new CreateEventContext(eventJobId, field, value, 'BODY',
        (err, result) => {
          if (err) {
            global.gdsLogger.logError(err);
            new RemoveEventContextByJobId(eventJobId, () => {
              callback({
                message: 'Failed saving event context body for field ' + field
              });
            });
          } else {
            resultBody.push(new GDSDomainDTO('EVENT-CONTEXT-BODY', result));
            next();
          }
        });
    })
    .end(() => {
      callback(undefined, resultBody);
    });
}