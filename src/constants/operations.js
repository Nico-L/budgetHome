import gql from 'graphql-tag'

export const GET_OPERATIONS_FILTRE_BUDGET_ORDER_DESC = gql`
query listeOperations($budgetId: ID!) {
    allOperations(filter: {budget: {id: $budgetId}}, orderBy: type_DESC) {
    name
    type
    id
    budget {id mois}
    somme
  }
}
`
