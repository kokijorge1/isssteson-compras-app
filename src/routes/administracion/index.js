import MainAdministracion from '@/views/administracion/Main.vue';
import Catalogos from './settings/catalogos';
import Requisiciones from './requisiciones';
import Adquisiciones from './adquisiciones';
import Informes from './informes';
import Usuario from '../usuario';

const administracion = [
  {
    name: 'admin',
    path: 'panel',
    meta: {
      title: 'Panel de Administración',
      breadTitle: 'Inicio',
      auth: ['superadmin', 'compras', 'area'],
    },
    component: MainAdministracion,
    children: [
      ...Catalogos,
      ...Requisiciones,
      ...Adquisiciones,
      ...Informes,
      ...Usuario,
    ],
  },
];

export default administracion;
