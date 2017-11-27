<script>
import { Doughnut } from 'vue-chartjs'
import {GET_BUDGET_OPERATIONS_MOIS_ANNEE_QUERY, GET_DEPENSE_TYPE_QUERY} from '../constants/graphql'
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

export default {
  extends: Doughnut,
  components: {
    Doughnut
  },
  data () {
    return {
      allBudget: [],
      bilanBudget: [],
      dataChart: {
        datasets: [{
          data: []
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: []
      },
      options: {responsive: false, maintainAspectRatio: true}
    }
  },
  apollo: {
    bilanBudget: {
      query: GET_BUDGET_OPERATIONS_MOIS_ANNEE_QUERY,
      variables () {
        return {
          mois,
          annee
        }
      },
      update (data) {
        return data.allBudgets[0]
      },
      result (result) {
        let dataChartTemp = {
          datasets: [{
            data: []
          }],
          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: []
        }
        this.$apollo.query({
          query: GET_DEPENSE_TYPE_QUERY,
          variables () {
          }
        }).then((data) => {
          let listeTypes = data.data.allDepenseTypes[0].liste
          let resteBudget = this.bilanBudget.initialBudget
          listeTypes.forEach((type) => {
            console.log(type)
            let isFound = false
            let total = 0
            console.log('bilanBudget')
            console.log(this.bilanBudget)
            this.bilanBudget.operations.forEach((operation) => {
              console.log(operation.type)
              if (operation.type === type) {
                console.log(operation.name)
                resteBudget -= operation.somme
                total += operation.somme
                if (!isFound) {
                  dataChartTemp.labels.push(type)
                }
                isFound = true
              }
            })
            console.log('total')
            console.log(total)
            if (isFound) {
              dataChartTemp.datasets[0].data.push(total)
            }
          })
          console.log(this.dataChart.datasets[0].data)
          dataChartTemp.datasets[0].data.push(resteBudget)
          dataChartTemp.labels.push('restant mensuel')
          this.dataChart = {...dataChartTemp}
          console.log(this.dataChart)
          console.log('dataset')
          console.log(this.dataChart.datasets[0].data)
          console.log('labels')
          console.log(this.dataChart.labels)
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
    }
  },
  watch: {
    data: function () {
      this.renderChart(this.dataChart, this.options)
    }
  },
  mounted () {
    this.renderChart(this.dataChart, this.options)
  }
}
</script>

<style>
</style>
