/* eslint-disable prettier/prettier */
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { formatCurrency } from './util';
import {
  topValueInputMsg,
  bottomValueInputMsg,
  topCurrencyChangeMsg,
  bottomCurrencyChangeMsg
} from './update';

const { div, h1, h3, pre, form, input, select, option } = hh(h);
const toMoney = formatCurrency(2);

const groupByCurrency = (acc, currency) => {
  const { key, symbol, label } = currency;
  return {
    ...acc,
    [key]: { symbol, label }
  };
};

const currencyOptions = (selected, currencies) => {
  const toOption = currency => {
    const { key, label, symbol } = currency;

    return option(
      { className: 'tc', value: key, selected: key === selected },
      `${label} (${symbol})`
    );
  };

  return currencies.map(toOption);
};

const currencySelect = (selected, currencies, selectMsg) =>
  select(
    {
      className: 'dib ml2 w-40 f4 pa2 ba input-reset br1 bg-white b--black pointer',
      onchange: e => selectMsg(e.target.value)
    },
    currencyOptions(selected, currencies)
  );

const currencySet = (value, currencyKey, currencies, inputMsg, selectMsg) =>
  div({ className: 'db w-100 ma1' }, [
    input({
      className: 'dib w-40 f4 mv2 pa2 input-reset ba',
      value,
      oninput: e => inputMsg(e.target.value)
    }),
    currencySelect(currencyKey, currencies, selectMsg)
  ]);

const currencyForm = (dispatch, model) => {
  const { topValue, bottomValue, topKey, bottomKey, currencies } = model;

  const topBlurMsg = val => dispatch(topValueInputMsg(val));
  const bottomBlurMsg = val => dispatch(bottomValueInputMsg(val));
  const topSelectChangeMsg = val => dispatch(topCurrencyChangeMsg(val));
  const bottomSelectChangeMsg = val => dispatch(bottomCurrencyChangeMsg(val));

  return form({}, [
    currencySet(topValue, topKey, currencies, topBlurMsg, topSelectChangeMsg),
    currencySet(bottomValue, bottomKey, currencies, bottomBlurMsg, bottomSelectChangeMsg)
  ]);
};

const currencyDisplay = model => {
  const { topValue, topKey, bottomValue, bottomKey, currencies, sourceTop, lastUpdate } = model;

  const currencyLookup = currencies.reduce(groupByCurrency, {});

  const [baseCurrency, relativeCurrency] = sourceTop
    ? [currencyLookup[topKey], currencyLookup[bottomKey]]
    : [currencyLookup[bottomKey], currencyLookup[topKey]];

  const [baseValue, relativeValue] = model.sourceTop
    ? [topValue, bottomValue]
    : [bottomValue, topValue];

  return div({}, [
    div(
      { className: 'f4 gray' },
      `${toMoney(baseCurrency.symbol, baseValue)} ${baseCurrency.label} equals`
    ),
    div(
      { className: 'f2' },
      `${toMoney(relativeCurrency.symbol, relativeValue)} ${relativeCurrency.label}`
    ),
    div({ className: 'f5 gray' }, `as of ${lastUpdate.toString()}`)
  ]);
};

const applicationState = model =>
  div({}, [
    h3({}, 'Application State'),
    pre({ className: 'w-50' }, JSON.stringify(model, null, 2))
  ]);

const view = (dispatch, model) =>
  div({ className: 'mw9 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Currency Converter'),
    div({ className: 'center flex' }, [
      div({ className: 'w-50' }, [
        h3({}, 'Application'),
        currencyDisplay(model),
        currencyForm(dispatch, model)
      ]),
      applicationState(model)
    ])
  ]);

export default view;
