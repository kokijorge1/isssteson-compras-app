import MainProveedores from '@/views/proveedores/Main.vue';
import Adquisiciones from '@/views/proveedores/Adquisiciones.vue';
import Adquisicion from '@/views/proveedores/Adquisicion.vue';
import Perfil from '@/views/usuario/PerfilProveedor.vue';

const proveedores = [
  {
    path: 'proveedores',
    meta: {
      breadTitle: 'Proveedores',
    },
    component: MainProveedores,
    children: [
      {
        name: 'proveedores',
        path: 'compras',
        meta: {
          title: 'Adquisiciones',
          auth: {
            roles: ['proveedor'],
          },
        },
        component: Adquisiciones,
        children: [],
      },
      {
        name: 'proveedoresAdquisicion',
        path: 'compra/:id',
        meta: {
          title: 'Adquisición',
          breadTitle: 'ad',
          auth: {
            roles: ['proveedor'],
          },
        },
        component: Adquisicion,
        children: [],
      },
      {
        name: 'miPerfilProveedor',
        path: 'perfil',
        meta: {
          title: 'Mi Perfil',
          breadTitle: 'Mi Perfil',
          auth: true,
        },
        component: Perfil,
      },
    ],
  },
];

export default proveedores;
