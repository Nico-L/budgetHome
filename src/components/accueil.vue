<template>
  <donoughts 
    v-if="!loadingData"
    :data="{dataCollection}"
    :options="{responsive: false, maintainAspectRatio: false}">
  </donoughts>
</template>

<script>
import { date } from 'quasar'
import donoughts from './chartBudget'
import { GET_BUDGET_ID_MOIS_ANNEE_QUERY } from '../constants/graphql'
import {GET_OPERATIONS_FILTRE_BUDGET_ORDER_DESC} from '../constants/operations'
import { couleurDoughnut } from '../constants/couleursCharts.js'

let timeStamp = Date.now()
let mois = date.formatDate(timeStamp, 'MMMM', {
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
})
let annee = date.formatDate(timeStamp, 'YYYY', {
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
})

export default {
  components: {
    donoughts
  },
  data () {
    return {
      dataCollection: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            data: []
          }
        ]
      },
      loadingData: true
    }
  },
  apollo: {
    budgetMois: {
      query: GET_BUDGET_ID_MOIS_ANNEE_QUERY,
      variables () {
        return {
          annee: annee,
          mois: mois
        }
      },
      fetchPolicy: 'network-only',
      update (data) {
        return data.allBudgets
      },
      result (result) {
        let dataCollectionTemp = {
          labels: [],
          datasets: [
            {
              backgroundColor: [],
              data: []
            }
          ]
        }
        if (result.data) {
          let budgetRestant = result.data.allBudgets[0].initialBudget
          this.$apollo.query({
            query: GET_OPERATIONS_FILTRE_BUDGET_ORDER_DESC,
            variables: {
              budgetId: result.data.allBudgets[0].id
            },
            fetchPolicy: 'network-only'
          }).then((data) => {
            let numeroCouleur = 0
            console.log(data.data.allOperations)
            let montantTotalParType = 0
            let typeCourant = 'queTchi'
            let listeOperations = data.data.allOperations
            listeOperations.forEach((operation) => {
              if (operation.type !== typeCourant) {
                if (typeCourant !== 'queTchi') {
                  dataCollectionTemp.datasets[0].data.push(montantTotalParType.toFixed(2))
                  budgetRestant -= montantTotalParType
                  dataCollectionTemp.datasets[0].backgroundColor.push(couleurDoughnut[numeroCouleur])
                  numeroCouleur += 1
                  if (numeroCouleur > 8) {
                    numeroCouleur = 0
                  }
                }
                typeCourant = operation.type
                montantTotalParType = operation.somme
                dataCollectionTemp.labels.push(operation.type)
              }
              else {
                montantTotalParType += operation.somme
              }
            })
            dataCollectionTemp.datasets[0].backgroundColor.push(couleurDoughnut[numeroCouleur])
            dataCollectionTemp.datasets[0].data.push(montantTotalParType.toFixed(2))
            dataCollectionTemp.datasets[0].data.push(budgetRestant.toFixed(2))
            dataCollectionTemp.labels.push('Restant')
            dataCollectionTemp.datasets[0].backgroundColor.push(couleurDoughnut[9])
            Object.assign(this.dataCollection, dataCollectionTemp)
            this.loadingData = false
          })
        }
      }
    }
  }
}
</script>

<style>
</style>
