<template>
  <div v-if="loadingOperations">
    chargement en cours...
  </div>
  <div class="formOperations" v-else-if="budgetExiste">
    <!-- <div>{{budgetID}} et {{idOperation}}</div> -->
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
  <div class="col-1"></div>
    <q-btn color="info"  class="col-5" icon="ion-compose" @click="saveOperation">{{entrerModifier}} l'opération</q-btn>
    <span class="col-1"></span>
    <q-btn color="warning"  v-if="isCorrection" class="col-5" icon="ion-compose" @click="confirmationEffacer">Effacer l'opération</q-btn>
  </div>
  </div>
  <div v-else class="formOperations">
    <div>Le budget du mois {{mois}} n'est pas encore défini.</div>
    <span class="col-3"></span><q-btn color="warning"  class="col-6" icon="ion-compose" @click="goEntrees">Définir le budget du mois</q-btn>
  </div>
</template>

<script>
import {QField, QSelect, QInput, QIcon, QBtn, Dialog, date} from 'quasar'

import {GET_BUDGET_MOIS_ANNEE_QUERY, CREATE_OPERATION_MUTATION, GET_DEPENSE_TYPE_QUERY, GET_OPERATION_MUTATION, UPDATE_OPERATION_MUTATION, EFFACE_OPERATION_MUTATION} from '../constants/graphql'

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
      entrerModifier: 'Entrer',
      budgetExiste: true,
      loadingOperations: 0
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
        if (this.allBudgets.length === 0) {
          /* Dialog.create({
            title: 'Attention',
            message: 'Pas de revenues déclarés pour ' + mois + '. Les entrer sur la page suivante.',
            buttons: [{
              label: 'OK',
              handle () {
              }
            }]
          })
          that.$router.push({name: 'budgetMensuel'}) */
          this.budgetExiste = false
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
        this.listeTypesOptions = []
        this.allDepenseTypes[0].liste.forEach((categorie) => {
          this.listeTypesOptions.push({label: categorie, value: categorie})
        })
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
        this.titre = ''
        this.montant = ''
        this.selectListe = ''
        return !this.idOperation
      },
      loadingKey: 'loadingOperations',
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
        console.log('correction !')
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
          this.dialogue('Operation modifiée avec succès.')
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
      else {
        console.log('creation')
        this.$apollo.mutate({
          mutation: CREATE_OPERATION_MUTATION,
          variables: {
            name,
            type,
            somme,
            budgetId
          }
        }).then((data) => {
          // Result
          this.dialogue('Operation sauvée avec succès.')
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
    },
    confirmationEffacer: function () {
      Dialog.create({
        title: 'Attention !',
        message: 'Confirmer la suppression de la dépense',
        position: 'top',
        buttons: [{
          label: 'Confirmer',
          color: 'negative',
          handler: () => {
            this.effaceOperation()
          }
        },
        {
          label: 'Annuler',
          color: 'positive',
          handler () {
          }
        }]
      })
    },
    effaceOperation: function () {
      if (this.isCorrection) {
        const id = this.idOperation
        this.$apollo.mutate({
          mutation: EFFACE_OPERATION_MUTATION,
          variables: {
            id
          }
        }).then((data) => {
          console.log(data)
          this.dialogue('Operation effacée avec succès.')
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    dialogue: function (texte) {
      Dialog.create({
        title: 'Succès',
        message: texte,
        position: 'top',
        buttons: [{
          label: 'OK',
          handler: () => {
            this.$router.push({name: 'accueil'})
          }
        }]
      })
    },
    goEntrees: function () {
      this.$router.push({name: 'budgetMensuel'})
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
  
div.formRevenue h4
  text-align: center
  
q-field
  margin-left: 50px

div.bouton
  margin-top: 20px

</style>
