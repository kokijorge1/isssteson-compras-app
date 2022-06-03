import Main from '@/views/administracion/informes/Main.vue';
import AdquisicionesFecha from '@/views/administracion/informes/AdquisicionesFecha.vue';
import ResumenPartidaArticulo from '@/views/administracion/informes/ResumenPartidaArticulo.vue';
import ResumenProveedores from '@/views/administracion/informes/ResumenProveedores.vue';
import ResumenUniAdmin from '@/views/administracion/informes/ResumenUniAdmin.vue';
import Monitor from '@/views/administracion/informes/Monitor.vue';

const informes = [
  {
    path: 'informes',
    meta: {
      title: 'Informes',
      breadTitle: 'Informes',
      auth: ['superadmin', 'compras'],
    },
    component: Main,
    children: [
      {
        name: 'monitorGlobal',
        path: 'Monitor',
        meta: {
          title: 'Monitor',
          breadTitle: 'Monitor',
          auth: ['superadmin'],
        },
        component: Monitor,
      },
      {
        name: 'adquisicionesFecha',
        path: 'adquisiciones',
        meta: {
          title: 'Informes',
          breadTitle: 'adquisiciones',
          auth: ['superadmin', 'compras'],
        },
        component: AdquisicionesFecha,
        children: [],
      },
      {
        name: 'resumenPartidaArticulo',
        path: 'partida-articulo',
        meta: {
          title: 'Informes',
          breadTitle: 'partida-articulo',
          auth: ['superadmin', 'compras'],
        },
        component: ResumenPartidaArticulo,
        children: [],
      },
      {
        name: 'resumenProveedores',
        path: 'proveedores',
        meta: {
          title: 'Informes',
          breadTitle: 'proveedores',
          auth: ['superadmin', 'compras'],
        },
        component: ResumenProveedores,
        children: [],
      },
      {
        name: 'resumenUniAdmin',
        path: 'uniadesadministrativas',
        meta: {
          title: 'Informes',
          breadTitle: 'unidades administrativas',
          auth: ['superadmin', 'compras'],
        },
        component: ResumenUniAdmin,
        children: [],
      },
    ],
  },
];

export default informes;
