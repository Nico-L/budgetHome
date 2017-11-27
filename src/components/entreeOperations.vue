<template>
  <div class="formOperations">
    <div>{{budgetID}} et {{idOperation}}</div>
    <q-field
      icon="ion-bookmark"
      label="Nom"
      :label-width="2"
    >
      <q-input v-model="titre" type="text" align="right" />
    </q-field>
    <q-field
      icon="ion-clipboard"
      label="Type"
      :label-width="2"
    > 
      <q-select
      v-model="selectListe"
     :options="listeTypesOptions"
     align="right"
    />
    </q-field>
    <q-field
      icon="ion-calculator"
      label="Montant"
      :label-width="2"
    > 
      <q-input v-model="montant" type="number" align="right" suffix="€" />
    </q-field>
  <div class="row bouton">
  <div class="col-3"></div>
    <q-btn color="info"  class="col-6" icon="ion-compose" @click="saveOperation">{{entrerModifier}} l'opération</q-btn>
  </div>
  </div>
</template>

<script>
import {QField, QSelect, QInput, QIcon, QBtn, Dialog, date} from 'quasar'

import {GET_BUDGET_MOIS_ANNEE_QUERY, CREATE_OPERATION_MUTATION, GET_DEPENSE_TYPE_QUERY, GET_OPERATION_MUTATION, UPDATE_OPERATION_MUTATION} from '../constants/graphql'

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
    QField,
    QSelect,
    QInput,
    QIcon,
    QBtn
  },
  data () {
    return {
      titre: '',
      typeOperation: '',
      montant: '',
      mois: mois,
      annee: annee,
      budgetID: '',
      allBudgets: [],
      allDepenseTypes: [],
      selectListe: '',
      listeTypesOptions: [],
      allOperations: [],
      isCorrection: false,
      entrerModifier: 'Entrer'
    }
  },
  props: {
    idOperation: String
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
        // console.log(this.allBudgets)
        if (this.allBudgets.length === 0) {
          Dialog.create({
            title: 'Attention',
            message: 'Pas de revenues déclarés pour ' + mois + '. Les entrer sur la page suivante.',
            buttons: [
              'OK'
            ]
          })
          this.$router.push('entrees')
        }
        else {
          this.budgetID = this.allBudgets[0].id
        }
      }
    },
    allDepenseTypes: {
      query: GET_DEPENSE_TYPE_QUERY,
      variables () {
        return {
        }
      },
      loadingKey: 'loading',
      result (result) {
        // console.log(!this.idOperation)
        // console.log(this.allDepenseTypes)
        this.allDepenseTypes[0].liste.forEach((categorie) => {
          this.listeTypesOptions.push({label: categorie, value: categorie})
        })
        // console.log(this.listeTypesOptions)
      }
    },
    allOperations: {
      query: GET_OPERATION_MUTATION,
      variables () {
        return {
          idOperation: this.idOperation
        }
      },
      skip () {
        return !this.idOperation
      },
      result (result) {
        if (this.allDepenseTypes.length > 0) {
          this.isCorrection = true
          this.entrerModifier = 'Modifier'
        }
        this.titre = this.allOperations[0].name
        this.typeOperation = this.allOperations[0].type
        this.montant = this.allOperations[0].somme
        this.selectListe = this.allOperations[0].type
      }
    }
  },
  methods: {
    saveOperation: function () {
      const name = this.titre
      const type = this.selectListe
      const somme = this.montant
      const budgetId = this.budgetID
      const id = this.idOperation
      if (this.isCorrection) {
        // console.log('correction !')
        this.$apollo.mutate({
          mutation: UPDATE_OPERATION_MUTATION,
          variables: {
            id,
            name,
            type,
            somme
          },
          updateQueries: {
          }
        }).then((data) => {
          // Result
          console.log(data)
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
      else {
        this.$apollo.mutate({
          mutation: CREATE_OPERATION_MUTATION,
          variables: {
            name,
            type,
            somme,
            budgetId
          },
          updateQueries: {
          }
        }).then((data) => {
          // Result
          console.log(data)
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

div.formOperations
  width: 500px
  padding: 10px
  
div.formRevenue h4
  text-align: center
  
q-field
  margin-left: 50px

div.bouton
  margin-top: 20px

</style>
