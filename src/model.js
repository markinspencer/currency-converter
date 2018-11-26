const initModel = {
  topKey: 'EUR',
  topValue: '1',
  bottomKey: 'CAD',
  bottomValue: '1.5',
  sourceTop: true,
  lastUpdate: new Date(),
  rates: {},
  keys: ['AUD', 'CAD', 'CNY', 'EUR', 'JPY', 'USD', 'VND'],
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
