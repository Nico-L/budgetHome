<template>
  <div>
  <q-btn color="warning"  icon="ion-compose" @click="authentification">authentification</q-btn>
  <div>{{retour}}</div>
  </div>
</template>

<script>
import Authenticator from 'netlify-auth-providers'
import {QBtn} from 'quasar'

export default {
  components: {
    QBtn
  },
  data () {
    return {
      retour: 'bob'
    }
  },
  methods: {
    authentification: function () {
      // var authenticator = new netlify.Default({})
      const that = this
      let test = new Authenticator({site_id: '523e8529-de61-41fc-9b9a-e3e82464f1fd'})
      console.log(test)
      test.authenticate({provider: 'github', scope: 'user'}, function (err, data) {
        console.log('pof')
        console.log(data)
        if (err) {
          that.retour = 'Error Authenticating with GitHub: ' + err
          // return $("#output").text("Error Authenticating with GitHub: " + err);
        }
        that.retour = 'Authenticated with GitHub. Access Token: ' + data.token
        // $("#output").text("Authenticated with GitHub. Access Token: " + data.token);
      })
    }
  }
}
</script>

<style>
</style>
