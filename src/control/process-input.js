import ProcessBody from './event-context/process-body';
import ProcessHeader from './event-context/process-header';
import ProcessPath from './event-context/process-path';
import ProcessQuery from './event-context/process-query';
import batch from 'batchflow';

export default class ProcessInput {
  constructor(eventJobId, input, callback) {
    try {
      const resultInput = {};
      batch(input).sequential()
        .each((field, content, next) => {
          switch (field) {
            case 'HEADER':
            case 'header':
              new ProcessHeader(eventJobId, content, (errProcess, result) => {
                if (errProcess) {
                  global.gdsLogger.logError(errProcess);
                  callback(errProcess);
                } else {
                  resultInput.header = result;
                  next();
                }
              });
              break;
            case 'BODY':
            case 'body':
              new ProcessBody(eventJobId, content, (errProcess, result) => {
                if (errProcess) {
                  global.gdsLogger.logError(errProcess);
                  callback(errProcess);
                } else {
                  resultInput.body = result;
                  next();
                }
              });
              break;
            case 'PATH':
            case 'path':
              new ProcessPath(eventJobId, content, (errProcess, result) => {
                if (errProcess) {
                  global.gdsLogger.logError(errProcess);
                  callback(errProcess);
                } else {
                  resultInput.path = result;
                  next();
                }
              });
              break;
            case 'QUERY':
            case 'query':
              new ProcessQuery(eventJobId, content, (errProcess, result) => {
                if (errProcess) {
                  global.gdsLogger.logError(errProcess);
                  callback(errProcess);
                } else {
                  resultInput.query = result;
                  next();
                }
              });
              break;
          }
        }).end(() => {
          callback(undefined, resultInput);
        });
    } catch (error) {
      global.gdsLogger.logError(error);
      callback({
        message: 'Failed processing input'
      });
    }

  }
}