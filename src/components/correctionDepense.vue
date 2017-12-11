<template>
  <div class="formCorrectionDepense">
    <div class="loading" v-if="loading">
      Chargement de la page...
    </div>
    <q-field
      icon="ion-calendar"
      >
      <div class="row">
       <q-select
         v-model="anneeSelect"
         :options="listeAnneesSelect"
         class="col-3"
        />
        <span class="col-1"></span>
        <q-select
         v-model="moisSelect"
         :options="listeMoisSelect"
         class="col-4"
        />
      </div>
    </q-field>
    <div v-if="loadingOperations">Chargement des operations</div>
    <div v-else-if="nbOperations === 0">Pas d'opération pour ce mois</div>
    <div v-else>
       <q-list>
        <q-list-header inset>Dépenses</q-list-header>
        <q-item v-for="operation in operations" :key="operation.id" :to="{ path: 'operation/'+operation.id}">
          <q-item-side icon="ion-eye" inverted color="primary" />
          <q-item-main>
            <q-item-tile label>{{operation.name}}</q-item-tile>
            <q-item-tile sublabel>Montant : {{operation.somme}} € - catégorie : {{operation.type}}</q-item-tile>
          </q-item-main>
        </q-item>
        </q-list>
    </div>
  </div>
</template>

<script>
import {QField, QSelect, QList, QItem, QListHeader, QItemSide, QItemTile, QItemMain, date} from 'quasar'
import {GET_BUDGET_ANNEES, GET_BUDGET_MOIS, GET_BUDGET_OPERATIONS} from '../constants/graphql'

let timeStamp = Date.now()
let anneeCourante = date.formatDate(timeStamp, 'YYYY', {
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
})

export default {
  components: {
    QField,
    QSelect,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile
  },
  data () {
    return {
      anneeSelect: anneeCourante,
      listeAnneesSelect: [],
      listeAnnees: [],
      loading: 0,
      loadingMois: 0,
      annees: [],
      mois: [],
      listeMois: [],
      listeMoisSelect: [],
      moisSelect: '',
      operations: [],
      loadingOperations: 0,
      nbOperations: 0
    }
  },
  apollo: {
    annees: {
      query: GET_BUDGET_ANNEES,
      variables () {
        return {
        }
      },
      loadingKey: 'loading',
      result (result) {
        this.annees.forEach((annee) => {
          if (this.listeAnnees.indexOf(annee.annee) === -1) {
            this.listeAnneesSelect.push({label: annee.annee, value: annee.annee})
            this.listeAnnees.push(annee.annee)
          }
        })
      },
      update (data) {
        return data.allBudgets
      }
    },
    mois: {
      query: GET_BUDGET_MOIS,
      variables () {
        return {
          annee: this.anneeSelect
        }
      },
      result (result) {
        this.listeMois = []
        this.listeMoisSelect = []
        this.mois.forEach((mois) => {
          if (this.listeMois.indexOf(mois.mois) === -1) {
            this.listeMoisSelect.push({label: mois.mois, value: mois.mois})
            this.listeMois.push(mois.mois)
          }
        })
      },
      update (data) {
        return data.allBudgets
      },
      loadingKey: 'loadingMois'
    },
    operations: {
      query: GET_BUDGET_OPERATIONS,
      variables () {
        return {
          annee: this.anneeSelect,
          mois: this.moisSelect
        }
      },
      fetchPolicy: 'network-only',
      loadingKey: 'loadingOperations',
      update (data) {
        this.operations = []
        if (!data.allBudgets[0]) {
          return []
        }
        else {
          this.nbOperations = data.allBudgets[0].operations.length
          return data.allBudgets[0].operations
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

div.formCorrectionDepense
  width: 500px
  padding: 10px
  
div.formRevenue h4
  text-align: center
  
q-field
  margin-left: 50px

div.bouton
  margin-top: 20px

</style>
