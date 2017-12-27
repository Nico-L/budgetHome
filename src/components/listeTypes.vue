<template>
  <div class="formListeTypes">
    <div class="loading" v-if="loading">
      Chargement de la liste...
    </div>
    <q-field
      icon="ion-bookmark"
      label="Liste"
      :label-width="2"
    >
      <div v-for="(type,index) in listeTypes">
      <q-input v-model="listeTypes[index]" type="text" align="right" :after="[{icon: 'ion-minus-round', handler () {removeRow(index)}}]" placeholder="Nom de la catégorie" :autofocus="true" />
      </div>
    </q-field>
<div class="row">
  <div class="col-1"></div>
  <q-btn color="primary" class="col-6" icon="ion-plus-round" @click="addRow">Ajouter une catégorie</q-btn>
  <span class="col-1"></span>
  <q-btn color="info"  class="col-4" icon="ion-compose" @click="updateListeTypeDepenses">Sauvegarder</q-btn>
  </div>
  </div>
</template>

<script>
import {QField, QInput, QBtn} from 'quasar'
import {GET_DEPENSE_TYPE_QUERY, UPDATE_DEPENSE_TYPE_MUTATION} from '../constants/graphql'

export default {
  components: {
    QField,
    QInput,
    QBtn
  },
  data () {
    return {
      listeTypes: [],
      allDepenseTypes: [],
      idListe: '',
      loading: 0
    }
  },
  apollo: {
    allDepenseTypes: {
      query: GET_DEPENSE_TYPE_QUERY,
      variables () {
        return {
        }
      },
      loadingKey: 'loading',
      result (result) {
        this.idListe = this.allDepenseTypes[0].id
        Object.assign(this.listeTypes, this.allDepenseTypes[0].liste)
        if (this.listeTypes.length === 0) {
          this.listeTypes = ['bob']
        }
      }
    }
  },
  methods: {
    addRow: function () {
      this.listeTypes.push('')
    },
    removeRow: function (index) {
      this.listeTypes.splice(index, 1)
    },
    updateListeTypeDepenses: function () {
      const id = this.idListe
      const liste = this.listeTypes
      this.$apollo.mutate({
        mutation: UPDATE_DEPENSE_TYPE_MUTATION,
        variables: {
          id,
          liste
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
</script>

<style lang="stylus">
@import '~variables'

div.formListeTypes
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
