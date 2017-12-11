import gql from 'graphql-tag'

export const GET_BUDGET_MOIS_ANNEE_QUERY = gql`
query getBudget($mois:String!, $annee:String!){allBudgets(filter: { AND: [{annee: $annee},{mois: $mois}]}) {
  id
  annee
  initialBudget
  mois
  revenues
  numeroBudget
}}
`

export const GET_BUDGET_OPERATIONS_MOIS_ANNEE_QUERY = gql`
query getBudget($mois:String!, $annee:String!){allBudgets(filter: { AND: [{annee: $annee},{mois: $mois}]}) {
  id
  initialBudget
  operations {
    id
    name
    somme
    type
  }
}}
`

export const GET_BUDGET_ID_MOIS_ANNEE_QUERY = gql`
query getBudget($mois:String!, $annee:String!){allBudgets(filter: { AND: [{annee: $annee},{mois: $mois}]}) {
  id
  initialBudget
}}
`

export const GET_DERNIER_BUDGET = gql`
query getDernierBudget{allBudgets(first:1, orderBy: numeroBudget_DESC) {
  numeroBudget
  operations {
    somme
  }
  initialBudget
}}
`

export const GET_BUDGET_ANNEES = gql`
query getBudgetsAnnees {allBudgets{annee}}
`

export const GET_BUDGET_MOIS = gql`
query getBudgetsMois($annee: String!) {allBudgets (filter: {annee: $annee}) {
  mois
  id
}
}
`

export const GET_BUDGET_OPERATIONS = gql`
query getBudgetOperations($annee: String!, $mois: String!) {
  allBudgets (filter: { AND: [{annee: $annee},{mois:$mois}]}) {
    id
    operations {
      name
      somme
      type
      id
    }
  }
}
`

export const UPDATE_BUDGET_MUTATION = gql`
  mutation createBudget($id: ID!, $mois: String!, $annee: String!, $initialBudget: Float!, $revenues: [Float!]!) {
    updateBudget(id: $id, mois: $mois, annee: $annee, initialBudget: $initialBudget, revenues: $revenues) {
      id
      initialBudget
      revenues
      operations {
      id
      name
      somme
      type
      }
    }
  }
`

export const CREATE_OPERATION_MUTATION = gql`
  mutation createOperation($name: String!, $type: String!, $somme: Float!, $budgetId: ID!) {
    createOperation(name: $name, type: $type, somme: $somme, budgetId: $budgetId) {
      id
      name
      somme
      type
      budget {
        id
      }
    }
  }
`

export const UPDATE_OPERATION_MUTATION = gql`
  mutation updateOperation($id: ID!, $name: String!, $type: String!, $somme: Float!) {
    updateOperation(id: $id, name: $name, type: $type, somme: $somme) {
      id
      name
      somme
      type
    }
  }
`

export const GET_OPERATION_MUTATION = gql`
  query getOperation($idOperation: ID!) {
    allOperations(filter : {id: $idOperation}) {
      id
      name
      type
      somme
      budget {
        id
      }
    }
  }
`

export const EFFACE_OPERATION_MUTATION = gql`
mutation effaceOperation($id: ID!) {
  deleteOperation(id: $id) {
    id
    name
    type
    somme
  }
}
`

export const CREATE_BUDGET_MUTATION = gql`
  mutation createBudget($mois: String!, $annee: String!, $initialBudget: Float!, $revenues: [Float!]!, $numeroBudget: Int!) {
    createBudget(mois: $mois, annee: $annee, initialBudget: $initialBudget, revenues: $revenues, numeroBudget: $numeroBudget) {
      id
      initialBudget
      revenues
      numeroBudget
    }
  }
`

export const GET_DEPENSE_TYPE_QUERY = gql`
query getDepenseType {allDepenseTypes{
  id
  liste
  }
}
`

export const UPDATE_DEPENSE_TYPE_MUTATION = gql`
 mutation createDepenseType($id: ID!, $liste: [String!]) {
   updateDepenseType(id: $id, liste: $liste) {
     id
     liste
   }
 }
`
