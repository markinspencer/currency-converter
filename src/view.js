import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import * as R from 'ramda';

const { div, h1, h3, pre, form, input, select, option } = hh(h);

const round = places =>
  R.pipe(
    num => num * 10 ** places,
    Math.round,
    num => num * 10 ** (-1 * places)
  );

const formatCurrency = R.curry((places, symbol, number) =>
  R.pipe(
    R.defaultTo(0),
    round(places),
    num => num.toFixed(places),
    R.concat(symbol)
  )(number)
);

const toMoney = formatCurrency(2);

const currencySelect = (selected, currencies) =>
  select(
    { className: 'dib ml2 w-40 f4 pa2 ba input-reset br1 bg-white b--black pointer' },
    currencies.map(currency =>
      option(
        { className: 'tc', value: currency.key, selected: currency.key === selected },
        `${currency.label} (${currency.symbol})`
      )
    )
  );

const currencySet = (value, currencyKey, currencies) =>
  div({ className: 'db w-100 ma1' }, [
    input({ className: 'dib w-40 f4 mv2 pa2 input-reset ba', value }),
    currencySelect(currencyKey, currencies)
  ]);

const currencyForm = model => {
  const { baseValue, relativeValue, base, relative, currencies } = model;

  return form({}, [
    currencySet(baseValue, base, currencies),
    currencySet(relativeValue, relative, currencies)
  ]);
};

const applicationState = model =>
  div({}, [
    h3({}, 'Application State'),
    pre({ className: 'w-50' }, JSON.stringify(model, null, 2))
  ]);

const currencyDisplay = model => {
  const { baseValue, base, relativeValue, relative, currencies, lastUpdate } = model;

  const baseCurrency = currencies.find(currency => currency.key === base);
  const relativeCurrency = currencies.find(currency => currency.key === relative);

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

const view = (dispatch, model) =>
  div({ className: 'mw9 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Currency Converter'),
    div({ className: 'center flex' }, [
      div({ className: 'w-50' }, [
        h3({}, 'Application'),
        currencyDisplay(model),
        currencyForm(model)
      ]),
      applicationState(model)
    ])
  ]);

export default view;
