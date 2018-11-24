import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const { div, h1, pre } = hh(h);

const view = (dispatch, model) =>
  div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Currency Converter'),
    pre(JSON.stringify(model, null, 2))
  ]);

export default view;
