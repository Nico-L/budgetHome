import Vue from 'vue'
import VueRouter from 'vue-router'

import {date} from 'quasar'
let timeStamp = Date.now()
let mois = date.formatDate(timeStamp, 'MMMM', {
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
})
let annee = date.formatDate(timeStamp, 'YYYY', {
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
})

Vue.use(VueRouter)

function load (component) {
  // '@' is aliased to src/components
  return () => import(`@/${component}.vue`)
}

export default new VueRouter({
  /*
   * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
   * it is only to be used only for websites.
   *
   * If you decide to go with "history" mode, please also open /config/index.js
   * and set "build.publicPath" to something other than an empty string.
   * Example: '/' instead of current ''
   *
   * If switching back to default "hash" mode, don't forget to set the
   * build publicPath back to '' so Cordova builds work again.
   */

  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: '/',
      component: load('layout'),
      children: [
        {
          path: '/',
          name: 'accueil',
          component: load('accueil'),
          meta: {
            title: 'Budget pour le mois de ' + mois + ' ' + annee
          }
        },
        {
          path: 'entrees',
          component: load('budgetMensuel'),
          meta: {
            title: 'Budget pour le mois de ' + mois + ' ' + annee
          }
        },
        {
          path: 'correctionDepense',
          component: load('correctionDepense'),
          meta: {
            title: 'Sélection de la dépense'
          }
        },
        {
          path: 'operation/:idOperation',
          component: load('entreeOperations'),
          props: true,
          meta: {
            title: 'Correction d\'une dépense'
          }
        },
        {
          path: 'operation',
          component: load('entreeOperations'),
          meta: {
            title: 'Entrer une nouvelle dépense pour le budget de ' + mois + annee
          }
        },
        {
          path: 'typeDepenses',
          component: load('listeTypes'),
          meta: {
            title: 'Les catégories de dépenses'
          }
        }
      ]
    },
    // Always leave this last one
    { path: '*', component: load('Error404') } // Not found
  ]
})
