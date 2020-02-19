import { useCallback } from 'react';
import { getEvent, getEvents } from 'src/api/arrangementSvc';
import { IEvent, maybeParseEvent } from 'src/types/event';
import { useLocalStorage } from './localStorage';
import { cachedRemoteData } from 'src/remote-data';

const eventCache = cachedRemoteData<string, IEvent>();

export const useEvent = (id: string) => {
  return eventCache.useOne({
    key: id,
    fetcher: useCallback(async () => {
      const retrievedEvent = await getEvent(id);
      return maybeParseEvent(retrievedEvent);
    }, [id]),
  });
};

export const useEvents = () => {
  return eventCache.useAll(
    useCallback(async () => {
      const eventContracts = await getEvents();
      return eventContracts.map(({ id, ...event }) => {
        return [id, maybeParseEvent(event)];
      });
    }, [])
  );
};

type EditEventToken = {
  eventId: string;
  editToken: string;
};
const isCreatedEvent = (x: any): x is EditEventToken =>
  'eventId' in x &&
  typeof x.eventId === 'string' &&
  'editToken' in x &&
  typeof x.editToken === 'string';

export const useSavedEditableEvents = (): {
  savedEvents: EditEventToken[];
  saveEditableEvents: (event: EditEventToken) => void;
} => {
  const [storage, setStorage] = useLocalStorage({
    key: 'editable-events',
  });

  const parsedStorage: unknown[] = storage ? JSON.parse(storage) : [];
  const validatedStorage = Array.isArray(parsedStorage)
    ? parsedStorage.filter(isCreatedEvent)
    : [];

  const updateStorage = (event: EditEventToken) =>
    JSON.stringify([
      ...validatedStorage.filter(x => x.eventId !== event.eventId),
      event,
    ]);

  return {
    savedEvents: validatedStorage,
    saveEditableEvents: (event: EditEventToken) =>
      setStorage(updateStorage(event)),
  };
};
