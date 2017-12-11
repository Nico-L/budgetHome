<template>
  <div class="formListeMensualites">
    <div class="loading" v-if="loadingMensualite">
      Chargement de la liste...
    </div>
    <q-field
      v-else=""
      icon="ion-bookmark"
      label="Liste"
      :label-width="2"
    >
      <div v-for="(mensualite,index) in mensualitesTemp">
      <div class="row">
      <q-input 
        v-model="mensualite.nom" 
        type="text" align="right" 
        placeholder="Nom de la mensualité" 
        :autofocus="true"
        class="col-5"
        @blur="$v.mensualitesTemp.$each[index].nom.$touch"
      />
      <span class="col-2"></span>
      <q-input 
        v-model="mensualite.montant"
        type="number" align="right" 
        :after="[{icon: 'ion-minus-round', handler () {removeRow(index)}}]" 
        placeholder="Montant" 
        class="col-5"
        @blur="$v.mensualitesTemp.$each[index].montant.$touch"
      />
      </div>
      <span v-if="!$v.mensualitesTemp.$each[index].nom.required" class="error">Nom requis.</span>
      <span v-if="!$v.mensualitesTemp.$each[index].montant.required" class="error">Montant requis.</span>
      </div>
    </q-field>
<div class="row">
  <div class="col-1"></div>
  <q-btn color="primary" class="col-6" icon="ion-plus-round" @click="addRow">Ajouter une catégorie</q-btn>
  <span class="col-1"></span>
  <q-btn color="info"  class="col-4" icon="ion-compose" @click="updateMensualites">Sauvegarder</q-btn>
  </div>
  </div>
</template>

<script>
import {QField, QInput, QBtn, Dialog} from 'quasar'
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import {GET_MENSUALITES, CREATE_MENSUALITE, UPDATE_MENSUALITE, DELETE_MENSUALITE} from '../constants/queryMensualites'

export default {
  components: {
    QField,
    QInput,
    QBtn
  },
  data () {
    return {
      mensualitesTemp: [{id: 'noID', nom: 'boby', montant: 0}],
      loadingMensualite: 0
    }
  },
  mixins: [validationMixin],
  validations: {
    mensualitesTemp: {
      $each: {
        nom: { required },
        montant: { required }
      }
    }
  },
  apollo: {
    mensualites: {
      query: GET_MENSUALITES,
      update (data) {
        // Object.assign(this.mensualitesTemp, data.allMensualites)
        this.mensualitesTemp = JSON.parse(JSON.stringify(data.allMensualites))
      },
      loadingKey: 'loadingMensualite'
    }
  },
  methods: {
    addRow: function () {
      let somme = Math.random() * 1000
      this.mensualitesTemp.push({id: 'noID', nom: '', montant: somme.toFixed(2)})
    },
    removeRow: function (index) {
      const mensualite = this.mensualitesTemp[index]
      if (mensualite.id !== 'noID') {
        // delete graphcool
        this.$apollo.mutate({
          mutation: DELETE_MENSUALITE,
          variables: {
            id: mensualite.id
          },
          updateQueries: {
          }
        }).then((data) => {
          // Result
          console.log('effacé !')
          console.log(data)
        }).catch((error) => {
          // Error
          console.error(error)
        })
      }
      this.mensualitesTemp.splice(index, 1)
    },
    updateMensualites: function () {
      let isOKUpdate = true
      let isOKCreate = true
      this.mensualitesTemp.forEach((mensualite, index) => {
        const montant = Number(mensualite.montant)
        if (mensualite.id === 'noID') {
          // create
          this.$apollo.mutate({
            mutation: CREATE_MENSUALITE,
            variables: {
              nom: mensualite.nom,
              montant: montant
            },
            updateQueries: {
            }
          }).then((data) => {
            // Result
            console.log(data.data.createMensualite.id)
            this.mensualitesTemp[index].id = data.data.createMensualite.id
          }).catch((error) => {
            // Error
            isOKCreate = false
            console.error(error)
          })
        }
        else {
          // update
          this.$apollo.mutate({
            mutation: UPDATE_MENSUALITE,
            variables: {
              id: mensualite.id,
              nom: mensualite.nom,
              montant: montant
            },
            updateQueries: {
            }
          }).then((data) => {
            // Result
          }).catch((error) => {
            // Error
            isOKUpdate = false
            console.error(error)
          })
        }
      })
      if (isOKCreate && isOKUpdate) {
        let that = this
        Dialog.create({
          title: 'Succès',
          message: 'Liste mise à jour avec succès.',
          buttons: [{
            label: 'OK',
            handler () {
              // empty the trash bin, yo
              that.$router.push({name: 'accueil'})
            }
          }]
        })
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

div.formListeMensualites
  width: 500px
  padding: 10px
  
div.formRevenue h4
  text-align: center
  
q-field
  margin-left: 50px

div.bouton
  margin-top: 20px
  
span.error
  color: red

</style>
