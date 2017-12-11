import { LocalStorage } from 'quasar'

export default {
  loggedIn () {
    return !!LocalStorage.has('token')
  },
  login (params, cb) {
    if (LocalStorage.has('token')) {
      if (cb) {
        const retour = {statut: 'OK'}
        cb(retour)
      }
      this.onChange(true)
      return
    }
    window.gapi.load('auth2', () => {
      const auth2 = window.gapi.auth2.init(params)
      auth2.signIn().then((googleUser) => {
        var profile = googleUser.getBasicProfile()
        const retour = {statut: 'todo', googleId: profile.getId()}
        cb(retour)
      },
      (error) => {
        console.log('erreur', error)
        const retour = {statut: 'erreur'}
        cb(retour)
      }
      )
    })
  },
  logout (cb) {
    LocalStorage.remove('token')
    if (cb) cb()
    this.onChange(false)
  },
  onChange () {}
}
