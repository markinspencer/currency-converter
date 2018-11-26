/* eslint-disable no-use-before-define */

import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import axios from 'axios';
import * as R from 'ramda';
import { initMsg } from './update';

// Make an http request and fire off a message on successful response
const httpEffects = (dispatch, command) => {
  if (command === null) return;
  const { request, successMsg, errorMsg } = command;
  axios(request)
    .then(response => dispatch(successMsg(response)))
    .catch(error => dispatch(errorMsg(error)));
};

const app = (initModel, update, view, node) => {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  dispatch(initMsg);

  function dispatch(msg) {
    const updates = update(msg, model);
    const isArray = R.type(updates) === 'Array';

    // update the application state
    model = isArray ? updates[0] : updates;

    // if there is an http request to be made make it
    const command = isArray ? updates[1] : null;
    httpEffects(dispatch, command);
    // find the differences between updated and current view render the updates
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);

    // set the current view to our updated view
    currentView = updatedView;
  }
};

export default app;
