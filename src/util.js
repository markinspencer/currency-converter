import * as R from 'ramda';

const round = places =>
  R.pipe(
    num => num * 10 ** places,
    Math.round,
    num => num * 10 ** (-1 * places)
  );

export const formatCurrency = R.curry((places, symbol, number) =>
  R.pipe(
    R.defaultTo(0),
    round(places),
    num => num.toFixed(places),
    R.concat(symbol)
  )(number)
);

export default formatCurrency;
