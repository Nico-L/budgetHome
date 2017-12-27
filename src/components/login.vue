<template>
    <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
  <q-toolbar slot="header">
      <q-toolbar-title>
        Page d'identification
      </q-toolbar-title>
  </q-toolbar>
    
  <div class="row formOperations">
    <span class="col-3"></span>
    <q-btn color="warning"  icon="ion-log-in" @click="authentification" class="col-6 bouton">authentification</q-btn>
  </div>
  </q-layout>
</template>

<script>

import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QTabs,
  QRouteTab,
  QField,
  QInput,
  QIcon,
  QBtn,
  QSideLink,
  QListHeader,
  QScrollArea,
  QItemSide,
  QItemMain,
  Toast,
  LocalStorage
} from 'quasar'
import layoutStore from '../constants/layoutStore'
import auth from '../utils/auth'
import { GET_USER } from '../constants/userGraphQL'
import clientId from '../constants/googleCredentials'
console.log(clientId())

export default {
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QTabs,
    QRouteTab,
    QField,
    QInput,
    QIcon,
    QBtn,
    QSideLink,
    QListHeader,
    QScrollArea,
    QItemSide,
    QItemMain,
    Toast
  },
  data () {
    return {
      layoutStore,
      googleSignInParams: {
        client_id: clientId(),
        scope: 'profile'
      }
    }
  },
  apollo: {
  },
  methods: {
    authentification: function () {
      auth.login(this.googleSignInParams, loggedIn => {
        console.log(loggedIn)
        if (loggedIn.statut === 'todo') {
          this.$apollo.query({
            query: GET_USER,
            variables: {
              googleUserId: loggedIn.googleId
            }
          }).then((data) => {
            if (data.data.allUsers.length > 0) {
              console.log('pof')
              const token = Math.random().toString(36).substr(2)
              LocalStorage.set('token', token)
              this.succes('Authentification confirmée')
            }
            else {
              Toast.create.negative({
                html: 'Utilisateur non autorisé'
              })
            }
          }).catch((error) => {
            console.log('erreur graphQL', error)
          })
        }
        if (loggedIn.statut === 'OK') {
          this.succes('Vous êtes déjà identifié.e')
        }
      })
    },
    succes: function (texte) {
      Toast.create.positive({
        html: texte
      })
      this.$router.replace(this.$route.query.redirect || '/')
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

div.formOperations
  width: 100%
  max-width: 500px
  padding: 10px
  
div.bouton
  margin-top: 20px

</style>
