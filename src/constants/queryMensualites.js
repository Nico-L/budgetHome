import gql from 'graphql-tag'

export const GET_MENSUALITES = gql`
query getMensualites {allMensualites {
    id
    nom
    montant
}
}
`

export const CREATE_MENSUALITE = gql`
mutation createMensualite($nom: String!, $montant: Float!) {
    createMensualite(nom: $nom, montant: $montant) {id}
}
`

export const UPDATE_MENSUALITE = gql`
mutation updateMensualite($id: ID!, $nom: String!, $montant: Float!) {
    updateMensualite(id: $id, nom: $nom, montant: $montant) {id}
}
`

export const DELETE_MENSUALITE = gql`
mutation deleteMensualite($id: ID!) {
    deleteMensualite(id: $id) {id}
}
`
