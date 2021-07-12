import { isAuthenticated, redirectToAuth0, useAuth0Redirect } from 'src/auth';
import { Router, Switch, Route, Redirect, RouteProps } from 'react-router';
import React from 'react';
import { Header } from 'src/components/Common/Header/Header';
import { ReactChild } from 'src/types';
import {
  createRoute,
  viewEventRoute,
  eventsRoute,
  cancelParticipantRoute,
  emailKey,
  eventIdKey,
  editEventRoute,
  confirmParticipantRoute,
  previewEventRoute,
  rootRoute,
  previewNewEventRoute,
} from 'src/routing';
import { CreateEventContainer } from 'src/components/CreateEvent/CreateEventContainer';
import { ViewEventContainer } from 'src/components/ViewEvent/ViewEventContainer';
import { EditEventContainer } from 'src/components/EditEvent/EditEventContainer';
import { CancelParticipant } from 'src/components/CancelParticipant/CancelParticipant';
import { createBrowserHistory } from 'history';
import style from './App.module.scss';
import { ConfirmParticipant } from '../ConfirmParticipant/ConfirmParticipant';
import { PreviewEventContainer } from 'src/components/PreviewEvent/PreviewEventContainer';
import { PreviewNewEventContainer } from 'src/components/PreviewEvent/PreviewNewEventContainer';
import { ViewEventsCardsContainer } from 'src/components/ViewEventsCards/ViewEventsCardsContainer';

const history = createBrowserHistory();

history.listen((location, action) => {
  if (action === 'PUSH') {
    window.scrollTo(0, 0);
  }
});

export const App = () => {
  useAuth0Redirect();
  return (
    <Router history={history}>
      <div className={style.container}>
        <Header />
        <Switch>
          <PrivateRoute exact path={createRoute}>
            <CreateEventContainer />
          </PrivateRoute>
          <Route exact path={viewEventRoute(':' + eventIdKey)}>
            <ViewEventContainer />
          </Route>
          <PrivateRoute exact path={eventsRoute}>
            <ViewEventsCardsContainer />
          </PrivateRoute>
          <PrivateRoute path={editEventRoute(':' + eventIdKey)}>
            <EditEventContainer />
          </PrivateRoute>
          <PrivateRoute exact path={previewNewEventRoute}>
            <PreviewNewEventContainer />
          </PrivateRoute>
          <PrivateRoute exact path={previewEventRoute(':' + eventIdKey)}>
            <PreviewEventContainer />
          </PrivateRoute>
          <PrivateRoute
            path={cancelParticipantRoute({
              eventId: ':' + eventIdKey,
              email: ':' + emailKey,
            })}
          >
            <CancelParticipant />
          </PrivateRoute>
          <Route
            exact
            path={confirmParticipantRoute({
              eventId: ':' + eventIdKey,
              email: ':' + emailKey,
            })}
          >
            <ConfirmParticipant />
          </Route>
          <Redirect exact from={rootRoute} to={eventsRoute} />
        </Switch>
      </div>
    </Router>
  );
};
export type ProtectedRouteProps = {
  children: ReactChild;
} & RouteProps;

const PrivateRoute = ({ children, ...routeProps }: ProtectedRouteProps) => {
  if (!isAuthenticated()) redirectToAuth0();

  return <Route {...routeProps} render={() => children} />;
};
