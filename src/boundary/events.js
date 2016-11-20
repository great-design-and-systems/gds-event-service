import CreateEvent from '../control/event/create-event';
import GetEventById from '../control/event/get-event-by-id';
import GetEventByName from '../control/event/get-event-by-name';
import GetEvents from '../control/event/get-events';
import RemoveEventById from '../control/event/remove-event-by-id';
import UpdateEvent from '../control/event/update-event';

export default class EventService {

  createEvent(name, eventType, action, callback) {
    new CreateEvent(name, eventType, action, callback);
  }

  getEvents(paginate, callback) {
    new GetEvents(paginate, callback);
  }
  getEventById(eventId, callback) {
    new GetEventById(eventId, callback);
  }
  updateEvent(eventId, event, callback) {
    new UpdateEvent(eventId, event, callback);
  }
  removeEventById(eventId, callback) {
    new RemoveEventById(eventId, callback);
  }
  getEventByName(eventName, callback) {
    new GetEventByName(eventName, callback);
  }
}