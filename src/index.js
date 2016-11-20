import { GDSDatabase, GDSServer, GDSUtil } from 'gds-config';

import EventResource from './boundary/event-resource';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

new GDSDatabase().connect((errDB) => {
    if (errDB) {
        console.error(errDB);
    } else {
        new GDSServer(app);
        new GDSUtil().getLogger(() => {
            app.listen(PORT, () => {
                global.gdsLogger.logInfo('Express is listening to port ' + PORT);
                new EventResource(app);
            });
        })
    }
});

export default app;



