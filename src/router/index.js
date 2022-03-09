import React from 'react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "../views/Login/Login";
import NewsSandbox from '../views/NewsSandbox/NewsSandbox';

export default function Router () {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login" component={Login} exact />
        <Route path="/" render={
          () => localStorage.getItem("token")
          ? <NewsSandbox></NewsSandbox>
          : <Redirect to="login" /> 
        } />
      </Switch>
    </HashRouter>
  )
}
