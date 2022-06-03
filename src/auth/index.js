import Vue from 'vue';
import VueAuth from '@websanova/vue-auth';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from '@/routes';
import RouterDriver from '@websanova/vue-auth/drivers/router/vue-router.2.x';
import AuthDriver from '@websanova/vue-auth/drivers/auth/bearer';
import HttpDriver from '@websanova/vue-auth/drivers/http/axios.1.x';

Vue.use(VueAxios, axios);
Vue.router = router;
Vue.axios.defaults.withCredentials = true;

Vue.axios.interceptors.request.use(config => config, error => Promise.reject(error));
// Vue.axios.interceptors.response.use(response => response, error => Promise.reject(error));

Vue.axios.interceptors.response.use(response => response, (error) => {
  if (!error.response) {
    const customErrorResponse = {
      status: 500,
      msg: 'Error 500: Error al comunicarse con el servidor.',
    };
    return Promise.reject(customErrorResponse);
  }

  if (error.status === 401) {
    Vue.auth.options.logoutProcess.call(Vue.auth, {}, {});
    return false;
  }

  return Promise.reject(error);
});

Vue.use(VueAuth, {
  router: RouterDriver,
  auth: AuthDriver,
  http: HttpDriver,
  refreshData: { url: 'auth/refrescar' },
  fetchData: { url: 'auth/usuario' },
  rolesVar: 'roles',
  tokenDefaultName: 'compras_salud_auth_token',
  authRedirect: { path: '/portal' },
  forbiddenRedirect: { name: 'sinpermisos' },
  notFoundRedirect: { name: 'NotFound' },
});

export default VueAuth;
