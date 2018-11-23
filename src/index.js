import initModel from './model';
import update from './update';
import view from './view';
import app from './app';

const node = document.getElementById('app');

app(initModel, update, view, node);
