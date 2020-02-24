import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useEvent } from 'src/hooks/eventHooks';
import { deleteParticipant } from 'src/api/arrangementSvc';
import { Page } from '../Page/Page';
import { Button } from '../Common/Button/Button';
import { stringifyDate } from 'src/types/date';
import { stringifyTime } from 'src/types/time';
import style from './CancelParticipant.module.scss';
import { useNotification } from '../NotificationHandler/NotificationHandler';
import { hasLoaded, isBad } from 'src/remote-data';
import { viewEventRoute } from 'src/routing';
import { useQuery } from 'src/utils/query-string';
import { useSavedParticipations } from 'src/hooks/participantHooks';
import { BlockLink } from 'src/components/Common/BlockLink/BlockLink';

export const CancelParticipant = () => {
  const { eventId = 'UGYLDIG_URL', email: participantEmail } = useParams();
  const remoteEvent = useEvent(eventId);
  const cancellationToken = useQuery('cancellationToken');
  const [wasDeleted, setWasDeleted] = useState(false);
  const { catchAndNotify } = useNotification();
  const { removeSavedParticipant } = useSavedParticipations();

  const cancelParticipant = catchAndNotify(async () => {
    if (eventId && participantEmail) {
      const deleted = await deleteParticipant({
        eventId,
        participantEmail,
        cancellationToken,
      });
      if (deleted.ok) {
        removeSavedParticipant({ eventId, email: participantEmail });
        setWasDeleted(true);
      }
    }
  });

  if (isBad(remoteEvent)) {
    return (
      <div>
        Ugyldig url!{' '}
        <span role="img" aria-label="sad emoji">
          😔
        </span>
      </div>
    );
  }

  if (!hasLoaded(remoteEvent)) {
    return <div>Laster...</div>;
  }

  const event = remoteEvent.data;

  const HasCancelledView = () => (
    <>
      <h1 className={style.header}>Avmelding bekreftet!</h1>
      <div className={style.text}>
        Da er du avmeldt {event.title} den {stringifyDate(event.start.date)} kl{' '}
        {stringifyTime(event.start.time)} - {stringifyTime(event.end.time)}
      </div>
    </>
  );

  const CancelView = () => (
    <>
      <h1 className={style.header}>Avmelding</h1>
      <div className={style.text}>Vil du melde deg av {event.title}?</div>
      <div className={style.buttonContainer}>
        <Button onClick={cancelParticipant}>Meld av</Button>
        <BlockLink to={viewEventRoute(eventId)}>Se arrangement</BlockLink>
      </div>
    </>
  );

  return <Page>{wasDeleted ? <HasCancelledView /> : <CancelView />}</Page>;
};
