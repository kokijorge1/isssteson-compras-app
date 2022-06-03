import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

let baseURL = 'https://demo-api.ecompra.mx';
if (process.env.NODE_ENV !== 'production') {
  baseURL = 'http://localhost:3000';
}

if (baseURL) {
  Vue.axios.defaults.baseURL = baseURL;
}

export default Vue.axios;
