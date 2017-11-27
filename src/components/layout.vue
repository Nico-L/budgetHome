<template>
    <q-layout
    ref="layout"
    :view="layoutStore.view"
    :left-breakpoint="layoutStore.leftBreakpoint"
    :right-breakpoint="layoutStore.rightBreakpoint"
    :reveal="layoutStore.reveal"
  >
  <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        {{$route.meta.title}}
      </q-toolbar-title>
  </q-toolbar>
  <q-tabs slot="navigation" v-if="!layoutStore.hideTabs">
      <q-route-tab slot="title" icon="ion-ios-download-outline" to="/operation" replace label="Entrer une dépense" />
      <q-route-tab slot="title" icon="ion-filing" to="/entrees" replace label="Revenue du mois" />
  </q-tabs>
  
  <q-scroll-area slot="left" style="width: 100%; height: 100%">
    <q-list-header>Left Panel</q-list-header>
    <q-side-link item to="correctionDepense">
      <q-item-side icon="account circle" />
      <q-item-main label="Corriger une dépense" />
    </q-side-link>
    <q-side-link item to="typeDepenses">
      <q-item-side icon="account circle" />
      <q-item-main label="Les catégories de dépenses" />
    </q-side-link>
  </q-scroll-area>
    
  <router-view />
  </q-layout>
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
  QSideLink,
  QListHeader,
  QScrollArea,
  QItemSide,
  QItemMain
} from 'quasar'
import layoutStore from '../constants/layoutStore'

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
    QBtn,
    QSideLink,
    QListHeader,
    QScrollArea,
    QItemSide,
    QItemMain
  },
  data () {
    return {
      layoutStore
    }
  }
}
</script>

<style>
</style>
