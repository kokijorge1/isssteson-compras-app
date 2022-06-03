import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';
import settings from './settings';
import requisiciones from './requisiciones';
import adquisiciones from './adquisiciones';
import proveedores from './proveedores';
import portal from './public';

Vue.use(Vuex);

export default new Vuex.Store({
  // plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    settings,
    requisiciones,
    adquisiciones,
    proveedores,
    portal,
  },
});
