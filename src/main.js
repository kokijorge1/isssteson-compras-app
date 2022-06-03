import Vue from 'vue';
import Vuetify from 'vuetify';
import NProgress from 'vue-nprogress';
import Vue2Filters from 'vue2-filters';
import moment from 'moment';
import VueMoment from 'vue-moment';
import VueSocketIO from 'vue-socket.io';
import VueLodash from 'vue-lodash';
import io from 'socket.io-client';
import VueGoogleCharts from 'vue-google-charts';
import en from 'vuetify/src/locale/en.ts';
import es from 'vuetify/src/locale/es.ts';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'babel-polyfill';
import '@/assets/css/main.scss';
import '@/assets/css/overwrite.scss';
import '@/assets/css/_spacing-helpers.scss';
import App from './App.vue';
import router from './routes';
import store from './store';
import Auth from './auth';
import './registerServiceWorker';
import './helpers/Instances';
import './filters';

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  theme: {
    pri: '#410324',
    primary: '#960e53',
    primary2: '#9b2f3e',
    medio: '#b94645',
    secondary: '#dc7f37',
    colorText: '#7A7575',
    colorTextDark: '#2A2A2A',
    bkground1: '#F9F9F9',
    bkground2: '#F6F6F6',
    background: '#F6F6F6',
    alertas: '#EFBC73',
    // themes: {
    //   light: { background: '#F6F6F6' },
    //   dark: { background: '#F6F6F6' },
    // },
  },
  lang: {
    locales: {
      es,
      en,
    },
    current: 'es',
  },
});
require('moment/locale/es');

Vue.use(VueMoment, {
  moment,
});
Vue.use(VueGoogleCharts);

let url = 'https://demo-api.ecompra.mx';
if (process.env.NODE_ENV !== 'production') {
  url = 'http://localhost:3000';
}

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV !== 'production',
  connection: io(url),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
}));

Vue.use(VueLodash);
Vue.use(NProgress);
Vue.use(Vue2Filters);

const nprogress = new NProgress({ parent: '.nprogress-container' });

new Vue({
  router,
  store,
  nprogress,
  Auth,
  render: h => h(App),
}).$mount('#app');
