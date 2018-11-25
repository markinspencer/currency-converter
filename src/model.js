const initModel = {
  base: 'EUR',
  relative: 'USD',
  baseValue: '1',
  relativeValue: '1.13',
  sourceTop: true,
  keys: ['AUD', 'CAD', 'CNY', 'EUR', 'JPY', 'USD'],
  lastUpdate: new Date(),
  rates: {
    AUD: 1.566015,
    CAD: 1.560132,
    CNY: 7.827874,
    EUR: 1,
    JPY: 132.360679,
    USD: 1.23396
  },
  currencies: [
    { key: 'AUD', label: 'Austrailian Dollar', symbol: '$' },
    { key: 'CAD', label: 'Canadian Dollar', symbol: '$' },
    { key: 'CNY', label: 'Chinese Yuan', symbol: '¥' },
    { key: 'EUR', label: 'Euro', symbol: '€' },
    { key: 'JPY', label: 'Japanese Yen', symbol: '¥' },
    { key: 'USD', label: 'United States Dollar', symbol: '$' },
    { key: 'VND', label: 'Vietnamese Đồng', symbol: 'đ' }
  ]
};

export default initModel;
