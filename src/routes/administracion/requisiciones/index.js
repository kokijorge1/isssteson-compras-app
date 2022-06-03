import Main from '@/views/administracion/requisiciones/Main.vue';
import Listado from '@/views/administracion/requisiciones/Listado.vue';
import Agregar from '@/views/administracion/requisiciones/Agregar.vue';
import Editar from '@/views/administracion/requisiciones/Editar.vue';

const requisiciones = [
  {
    path: 'requisiciones',
    meta: {
      breadTitle: 'Requisiciones',
      namePathInicial: 'requisiciones',
    },
    component: Main,
    children: [
      {
        name: 'requisiciones',
        path: '',
        meta: {
          title: 'Requisiciones',
          auth: {
            roles: ['superadmin', 'compras', 'area'],
          },
        },
        component: Listado,
        children: [],
      },
      {
        name: 'requisicionAgregar',
        path: 'agregar',
        meta: {
          title: 'Agregar Requisicion',
          breadTitle: 'Agregar',
          auth: {
            roles: ['superadmin', 'compras', 'area'],
          },
        },
        component: Agregar,
        children: [],
      },
      {
        name: 'requisicionEditar',
        path: ':id/detalles',
        meta: {
          title: 'Editar Requisicion',
          breadTitle: 'Detalles',
          auth: {
            roles: ['superadmin', 'compras', 'area'],
          },
        },
        component: Editar,
        children: [],
      },
    ],
  },
];

export default requisiciones;
