import gql from 'graphql-tag'

export const GET_USER = gql`
    query getUser($googleUserId: String!) {allUsers(filter: {googleUserId: $googleUserId}) {
        id
        }
    }
`
