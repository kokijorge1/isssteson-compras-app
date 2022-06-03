import Vue from 'vue';
import Router from 'vue-router';
import MainView from '@/views/Main.vue';
import MainLogin from '@/views/login/Main.vue';
import MainPublic from '@/views/public/Main.vue';
import MainPortal from '@/views/public/Portal.vue';
import MainPortalDetalleAdquisicion from '@/views/public/DetalleAdquisicion.vue';
import MainDetallesInversionRealizada from '@/views/public/DetallesInversionRealizada.vue';
import MainLogout from '@/views/login/Logout.vue';
import MainRegistrarse from '@/views/login/Registrarse.vue';
import NoTienePermisos from '@/views/pageCodes/403.vue';
import NoSeEncontro from '@/views/pageCodes/404.vue';
import AdministracionRutas from './administracion';
import ProveedoresRutas from './proveedores';

Vue.use(Router);

const routes = new Router({
  routes: [
    {
      name: 'AppInicio',
      path: '/',
      meta: {
        title: 'Compras',
        auth: true,
      },
      component: MainView,
      children: [
        ...AdministracionRutas,
        ...ProveedoresRutas,
      ],
    },
    {
      path: '/portal',
      meta: {
        title: 'Portal',
        auth: false,
      },
      component: MainPublic,
      children: [
        {
          path: '',
          name: 'portal',
          meta: {
            title: 'Portal',
          },
          component: MainPortal,
        },
        {
          path: 'adquisicion/:id',
          name: 'portalDetalleAdquisicion',
          meta: {
            title: 'Portal',
          },
          component: MainPortalDetalleAdquisicion,
        },
        {
          path: 'inversion',
          name: 'portalDetallesInversion',
          meta: {
            title: 'Inversión Realizada',
          },
          component: MainDetallesInversionRealizada,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Inicio de sesión',
        auth: false,
      },
      component: MainLogin,
    },
    {
      path: '/registrarse',
      name: 'registrarse',
      meta: {
        title: 'Registrarse',
        auth: false,
      },
      component: MainRegistrarse,
    },
    {
      path: '/logout',
      name: 'logout',
      meta: {
        title: 'Cerrar sesión',
        auth: true,
      },
      component: MainLogout,
    },
    {
      path: '/403',
      name: 'sinpermisos',
      meta: {
        title: 'Acceso Restringido.',
        auth: true,
      },
      component: NoTienePermisos,
    },
    {
      path: '*',
      name: 'NotFound',
      meta: {
        title: 'No se encontro la pagina que estaba buscando.',
      },
      component: NoSeEncontro,
    },
  ],
});

routes.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  document.title = `Compras - ${to.meta.title}`;
  next();
});

export default routes;
