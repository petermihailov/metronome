const { propertyOrdering, selectorOrdering } = require('stylelint-semantic-groups');

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order', 'stylelint-use-logical'],
  rules: {
    'csstools/use-logical': 'always',
    'order/order': selectorOrdering,
    'order/properties-order': propertyOrdering,
    'color-function-notation': 'modern',
    'custom-property-empty-line-before': 'never',
    'property-no-vendor-prefix': [true, { ignoreProperties: ['mask', 'backdrop-filter'] }],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'number-max-precision': 4,
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]+$',
      { message: 'Expected class name to be lowerCamelCase' },
    ],
    'declaration-block-no-redundant-longhand-properties': null,
  },
};
