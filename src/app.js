/* eslint-disable no-use-before-define */

import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';

const app = (initModel, update, view, node) => {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(action) {
    model = update(action, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
};

export default app;
