import {
  IEvent,
  IEventViewModel,
  INewEventViewModel,
  toEventWriteModel,
} from 'src/types/event';
import { post, get, del, put } from './crud';
import { WithId } from 'src/types';
import {
  IParticipant,
  INewParticipantViewModel,
  IParticipantViewModel,
} from 'src/types/participant';
import { getArrangementSvcUrl } from 'src/config';
import { queryStringStringify } from 'src/utils/query-string';
import { toEmailWriteModel } from 'src/types/email';

export const postEvent = (
  event: IEvent,
  editUrlTemplate: string
): Promise<INewEventViewModel> =>
  post({
    host: getArrangementSvcUrl(),
    path: '/events',
    body: toEventWriteModel(event, editUrlTemplate),
  });

export const putEvent = (
  eventId: string,
  event: IEvent,
  editToken?: string
): Promise<IEventViewModel> =>
  put({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
    body: toEventWriteModel(event),
  });

export const getEvent = (eventId: string): Promise<IEventViewModel> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}`,
  });

export const getEvents = (): Promise<WithId<IEventViewModel>[]> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events`,
  });

export const deleteEvent = (eventId: string, editToken?: string) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}${queryStringStringify({ editToken })}`,
  });

export const getParticipantsForEvent = (
  eventId: string
): Promise<IParticipantViewModel[]> =>
  get({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants`,
  });

export const postParticipant = (
  eventId: string,
  participant: IParticipant,
  cancelUrlTemplate: string
): Promise<INewParticipantViewModel> =>
  post({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/${toEmailWriteModel(
      participant.email
    )}`,
    body: {
      name: participant.name,
      comment: participant.comment,
      cancelUrlTemplate,
    },
  });

export const deleteParticipant = ({
  eventId,
  participantEmail,
  cancellationToken,
}: {
  eventId: string;
  participantEmail: string;
  cancellationToken?: string;
}) =>
  del({
    host: getArrangementSvcUrl(),
    path: `/events/${eventId}/participants/${participantEmail}${queryStringStringify(
      { cancellationToken }
    )}`,
  });
