import { useAuth0Redirect } from 'src/auth';
import { Router, Switch, Route, Redirect } from 'react-router';
import React from 'react';
import { Header } from 'src/components/Common/Header/Header';
import {
  createRoute,
  viewEventRoute,
  eventsRoute,
  editRoute,
  cancelParticipantRoute,
} from 'src/routing';
import { CreateEventContainer } from 'src/components/CreateEvent/CreateEventContainer';
import { ViewEventContainer } from 'src/components/ViewEvent/ViewEventContainer';
import { ViewEventsContainer } from 'src/components/ViewEvents/ViewEventsContainer';
import { EditEventContainer } from 'src/components/EditEvent/EditEventContainer';
import { CancelParticipantContainer } from 'src/components/CancelParticipant/CancelParticipant';
import { createBrowserHistory } from 'history';
import style from './App.module.scss';

const history = createBrowserHistory();

export const App = () => {
  useAuth0Redirect();
  return (
    <Router history={history}>
      <div className={style.container}>
        <Header />
        <Switch>
          <Route path={createRoute}>
            <CreateEventContainer />
          </Route>
          <Route path={viewEventRoute} exact>
            <ViewEventContainer />
          </Route>
          <Route path={eventsRoute} exact>
            <ViewEventsContainer />
          </Route>
          <Route exact path={editRoute}>
            <EditEventContainer />
          </Route>
          <Route exact path={cancelParticipantRoute}>
            <CancelParticipantContainer />
          </Route>
          <Redirect exact from={'/'} to={eventsRoute} />
        </Switch>
      </div>
    </Router>
  );
};