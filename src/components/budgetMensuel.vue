<template>
  <div class="formRevenue">
  <div v-for="(revenue,index) in revenues">
  <div class="row">
  <span class="col-2"></span>
    <q-field 
      label="Reliquat" 
      :label-width="4"
      v-if="index === 0"
      class="col-6 generic-margin"
      >
      <q-input v-model="revenues[index]" type="number" :after="[{icon: 'ion-social-euro', handler () {}}]" align="right" disable />
    </q-field>
    <q-field 
      :label="'Entrée ' + index" 
      :label-width="4"
      v-if="index > 0"
      class="col-6 generic-margin"
      >
      <q-input v-model="revenues[index]" type="number" :after="[{icon: 'ion-social-euro', handler () {}}]" align="right" />
    </q-field>
    <span class="col-1"></span>
    <q-btn color="black" icon="ion-minus" small outline class="col-2 generic-margin" v-if="index > 0" @click="removeRow(index)"/>
  </div></div>
<div class="row">
  <div class="col-1"></div>
  <q-btn color="primary" class="col-6" icon="ion-plus-round" @click="addRow">Ajouter un revenu</q-btn>
  <span class="col-1"></span>
  <q-btn color="info"  class="col-4" icon="ion-compose" @click="createBudget">{{boutonValidation}}</q-btn>
  </div>
  </div>
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
  date,
  Dialog
} from 'quasar'
import layoutStore from '../constants/layoutStore'
import {GET_BUDGET_MOIS_ANNEE_QUERY, UPDATE_BUDGET_MUTATION, GET_DERNIER_BUDGET, CREATE_BUDGET_MUTATION} from '../constants/graphql'
import {GET_MENSUALITES} from '../constants/queryMensualites'
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
    QLayout,
    QToolbar,
    QToolbarTitle,
    QTabs,
    QRouteTab,
    QField,
    QInput,
    QIcon,
    QBtn
  },
  data () {
    return {
      layoutStore,
      reliquat: 0,
      revenues: [0, 4116.2, 3036.67, 64.93],
      mois: mois,
      annee: annee,
      allBudgets: [],
      budgetExiste: false,
      budgetID: '',
      boutonValidation: 'Enregistrer',
      dernierBudget: []
    }
  },
  apollo: {
    allBudgets: {
      query: GET_BUDGET_MOIS_ANNEE_QUERY,
      variables () {
        return {
          annee: this.annee,
          mois: this.mois
        }
      },
      loadingKey: 'loading',
      result (result) {
        if (this.allBudgets.length > 0) {
          this.budgetExiste = true
          this.budgetID = this.allBudgets[0].id
          this.boutonValidation = 'Modifier'
          Object.assign(this.revenues, this.allBudgets[0].revenues)
        }
      }
    },
    dernierBudget: {
      query: GET_DERNIER_BUDGET,
      update (data) {
        return data.allBudgets[0]
      },
      result (result) {
        if (this.dernierBudget) {
          this.revenues[0] = this.dernierBudget.initialBudget
          // console.log(this.revenues[0])
          this.dernierBudget.operations.forEach((operation) => {
            // console.log(operation.somme)
            this.revenues[0] -= operation.somme
          })
          this.revenues[0] = Number(this.revenues[0].toFixed(2))
        }
        else {
          this.revenues[0] = 0
        }
      }
    }
  },
  computed: {
    calculFixe: function () {
    }
  },
  methods: {
    addRow: function () {
      console.log(this.revenues)
      this.revenues.push(64.5)
    },
    removeRow: function (index) {
      this.revenues.splice(index, 1)
    },
    createBudget: function () {
      const mois = this.mois
      const annee = this.annee
      const id = this.budgetID
      const revenues = this.revenues
      let fraisFixes = 0
      this.$apollo.query({
        query: GET_MENSUALITES,
        updateQueries: {
        }
      }).then((data) => {
        console.log(data.data.allMensualites)
        data.data.allMensualites.forEach((fraisFixe) => {
          fraisFixes += fraisFixe.montant
        })
        let initialBudget = 0
        let numeroBudget = 0
        if (this.dernierBudget) {
          if (!this.budgetExiste) {
            numeroBudget = this.dernierBudget.numeroBudget + 1
          }
          else {
            numeroBudget = this.dernierBudget.numeroBudget
          }
        }
        console.log('budget')
        console.log(numeroBudget)
        // console.log(this.revenues)
        this.revenues.forEach((revenue) => {
          initialBudget += revenue
        })
        console.log(initialBudget)
        initialBudget -= fraisFixes
        initialBudget = Number(initialBudget.toFixed(2))
        console.log(initialBudget)
        // Mutation
        if (this.budgetExiste) {
          console.log('modification')
          this.$apollo.mutate({
            mutation: UPDATE_BUDGET_MUTATION,
            variables: {
              id,
              mois,
              annee,
              initialBudget,
              revenues
            },
            updateQueries: {
            }
          }).then((data) => {
            // Result
            console.log(data)
            let that = this
            Dialog.create({
              title: 'Succès',
              message: 'Budget de ' + mois + annee + ' modifié avec succès.',
              buttons: [{
                label: 'OK',
                handler () {
                  // empty the trash bin, yo
                  that.$router.push({name: 'accueil'})
                }
              }]
            })
          }).catch((error) => {
            // Error
            console.error(error)
          })
        }
        else {
          console.log('pas correction')
          this.$apollo.mutate({
            mutation: CREATE_BUDGET_MUTATION,
            variables: {
              mois,
              annee,
              initialBudget,
              revenues,
              numeroBudget
            },
            updateQueries: {
            }
          }).then((data) => {
            // Result
            console.log(data)
            Dialog.create({
              title: 'Succès',
              message: 'Budget de ' + mois + annee + ' créé avec succès.',
              buttons: [{
                label: 'OK',
                handler () {
                  this.$router.push({name: 'accueil'})
                }
              }]
            })
          }).catch((error) => {
            // Error
            console.error(error)
          })
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
div.formRevenue
  width: 100%
  max-width: 500px
  padding: 10px
  
div.formRevenue h4
  text-align: center
  
q-field
  margin-left: 50px
</style>