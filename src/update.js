import * as R from 'ramda';
import { formatCurrency } from './util';

const API_KEY = `9b6fb19b083f99bc6fc75fb0c7bfbdc3`; /* YOUR API KEY HERE */

const apiEndPoint = (base, keys) =>
  `http://data.fixer.io/api/latest?access_key=${API_KEY}&base=${base}&symbols=${keys}`;

const MSGS = {
  TOP_VALUE_INPUT: 'TOP_VALUE_INPUT',
  BOTTOM_VALUE_INPUT: 'BOTTOM_VALUE_INPUT',
  TOP_CURRENCY_CHANGE: 'TOP_CURRENCY_CHANGE',
  BOTTOM_CURRENCY_CHANGE: 'BOTTOM_CURRENCY_CHANGE',
  HTTP_SUCCESS: 'HTTP_SUCCESS',
  HTTP_ERROR: 'HTTP_ERROR',
  INITIALIZE_APP: 'INITIALIZE_APP'
};

export const topValueInputMsg = payload => ({
  type: MSGS.TOP_VALUE_INPUT,
  payload
});

export const bottomValueInputMsg = payload => ({
  type: MSGS.BOTTOM_VALUE_INPUT,
  payload
});

export const topCurrencyChangeMsg = payload => ({
  type: MSGS.TOP_CURRENCY_CHANGE,
  payload
});

export const bottomCurrencyChangeMsg = payload => ({
  type: MSGS.BOTTOM_CURRENCY_CHANGE,
  payload
});

export const initMsg = {
  type: MSGS.INITIALIZE_APP
};

const httpSuccessMsg = R.curry((key, response) => ({
  type: MSGS.HTTP_SUCCESS,
  payload: {
    key,
    response
  }
}));

const httpErrorMsg = R.curry((key, error) => ({
  type: MSGS.HTTP_ERROR,
  payload: {
    key,
    error
  }
}));

const format = R.curry(formatCurrency(2, ''));

const update = (action, model) => {
  switch (action.type) {
    case MSGS.TOP_VALUE_INPUT: {
      const { payload } = action;
      const { topValue, rates, bottomKey } = model;

      if (payload === topValue) return model;

      const bottomValue = format(payload * rates[bottomKey]);

      return {
        ...model,
        bottomValue,
        topValue: payload,
        sourceTop: true
      };
    }

    case MSGS.BOTTOM_VALUE_INPUT: {
      const { payload } = action;
      const { bottomValue, rates, bottomKey } = model;

      if (payload === bottomValue) return model;

      const topValue = format(payload / rates[bottomKey]);

      return {
        ...model,
        topValue,
        bottomValue: payload,
        sourceTop: false
      };
    }

    case MSGS.TOP_CURRENCY_CHANGE: {
      const { payload: topKey } = action;

      return [
        { ...model, topKey },
        {
          request: { url: apiEndPoint(topKey, model.keys) },
          successMsg: httpSuccessMsg(topKey),
          errorMsg: httpErrorMsg(topKey)
        }
      ];
    }

    case MSGS.BOTTOM_CURRENCY_CHANGE: {
      const { payload: key } = action;
      const { topValue: tVal, bottomValue: bVal, rates, sourceTop } = model;

      const [topValue, bottomValue] = sourceTop
        ? [tVal, format(tVal * rates[key])]
        : [format(bVal / rates[key]), bVal];

      return {
        ...model,
        topValue,
        bottomValue,
        bottomKey: key
      };
    }

    case MSGS.HTTP_SUCCESS: {
      const { timestamp, rates, success, error } = action.payload.response.data;
      const { topKey, bottomKey } = model;

      if (!success) return update(httpErrorMsg(topKey, error), model);

      const lastUpdate = new Date(timestamp * 1000);
      const { topValue: tVal, bottomValue: bVal, sourceTop } = model;

      const [topValue, bottomValue] = sourceTop
        ? [tVal, format(tVal * rates[bottomKey])]
        : [format(bVal / rates[bottomKey]), bVal];

      return {
        ...model,
        rates,
        topValue,
        bottomValue,
        lastUpdate
      };
    }

    case MSGS.HTTP_ERROR: {
      const { key, error } = action.payload;
      // eslint-disable-next-line no-console
      console.warn(`Error retrieving exchange rates for ${key}. ${error.info}`);
      return model;
    }

    case MSGS.INITIALIZE_APP: {
      const { topKey, keys } = model;
      return [
        model,
        {
          request: { url: apiEndPoint(topKey, keys) },
          successMsg: httpSuccessMsg(topKey),
          errorMsg: httpErrorMsg(topKey)
        }
      ];
    }

    default: {
      return model;
    }
  }
};

export default update;
