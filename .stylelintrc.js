import semanticGroups from 'stylelint-semantic-groups'

const { propertyOrdering, selectorOrdering } = semanticGroups

// Пустые строки между группами свойств не используем (они конфликтуют с declaration-empty-line-before)
const withoutEmptyLines = (groups) =>
  groups.map((group) => ({ ...group, emptyLineBefore: 'never', noEmptyLineBetween: false }))

export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order', 'stylelint-use-logical'],
  rules: {
    'csstools/use-logical': 'always',
    'order/order': selectorOrdering,
    'order/properties-order': [
      withoutEmptyLines(propertyOrdering[0]),
      ...propertyOrdering.slice(1),
    ],
    'color-function-notation': 'modern',
    'custom-property-empty-line-before': 'never',
    'property-no-vendor-prefix': [true, { ignoreProperties: ['mask', 'backdrop-filter'] }],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'number-max-precision': 4,
    'declaration-block-no-redundant-longhand-properties': null,
  },
}
