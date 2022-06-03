import Main from '@/views/administracion/settings/catalogos/Main.vue';
import MainUsuarios from '@/views/administracion/settings/catalogos/usuarios/Main.vue';
import MainUA from '@/views/administracion/settings/catalogos/ua/Main.vue';
import MainArea from '@/views/administracion/settings/catalogos/areas/Main.vue';
import MainPartidasGenericas from '@/views/administracion/settings/catalogos/partidasgenericas/Main.vue';
import MainPartidas from '@/views/administracion/settings/catalogos/partidas/Main.vue';
import MainBienesServicios from '@/views/administracion/settings/catalogos/bienesservicios/Main.vue';
import MainProveedores from '@/views/administracion/settings/catalogos/proveedores/Main.vue';
import MainTipoRequisiciones from '@/views/administracion/settings/catalogos/tiporequisiciones/Main.vue';
import MainPAA from '@/views/administracion/settings/catalogos/paa/Main.vue';

const catalogos = [
  {
    path: 'settings/catalogos',
    meta: {
      breadTitle: 'Catálogos',
    },
    component: Main,
    children: [
      {
        name: 'settingsCatalogoUsuarios',
        path: 'usuarios',
        meta: {
          title: 'Catálogo Usuarios',
          breadTitle: 'Usuarios',
          auth: {
            roles: ['superadmin', 'compras'],
          },
        },
        component: MainUsuarios,
      },
      {
        name: 'settingsCatalogoUnidadesAdministrativas',
        path: 'unidadadministrativas',
        meta: {
          title: 'Catálogo Unidades Administrativas',
          auth: {
            roles: ['superadmin'],
          },
        },
        component: MainUA,
      },
      {
        name: 'settingsCatalogoAreas',
        path: 'areas',
        meta: {
          title: 'Catálogo Areas',
          breadTitle: 'Areas',
          auth: {
            roles: ['superadmin', 'compras'],
          },
        },
        component: MainArea,
      },
      {
        name: 'settingsCatalogoPartidasGenericas',
        path: 'partidasgenericas',
        meta: {
          title: 'Catálogo Partidas Genericas',
          breadTitle: 'Partidas',
          auth: ['superadmin'],
        },
        component: MainPartidasGenericas,
      },
      {
        name: 'settingsCatalogoPartidas',
        path: 'partidas',
        meta: {
          title: 'Catálogo Partidas',
          breadTitle: 'Partidas',
          auth: ['superadmin'],
        },
        component: MainPartidas,
      },
      {
        name: 'settingsCatalogoBienesServicios',
        path: 'bienesyservicios',
        meta: {
          title: 'Catálogo Bienes y Servicios',
          breadTitle: 'Bienes y Servicios',
          auth: {
            roles: ['superadmin'],
          },
        },
        component: MainBienesServicios,
      },
      {
        name: 'settingsCatalogoProveedores',
        path: 'proveedores',
        meta: {
          title: 'Catálogo Proveedores',
          breadTitle: 'Proveedores',
          auth: {
            roles: ['superadmin', 'compras'],
          },
        },
        component: MainProveedores,
      },
      {
        name: 'settingsCatalogoTipoRequisiciones',
        path: 'tiporequisiciones',
        meta: {
          title: 'Catálogo Tipo Requisiciones',
          breadTitle: 'Tipo Requsiciones',
          auth: {
            roles: ['superadmin', 'compras'],
          },
        },
        component: MainTipoRequisiciones,
      },
      {
        name: 'settingsCatalogoPAA',
        path: 'planaa',
        meta: {
          title: 'Catálogo PAA',
          breadTitle: 'PAA',
          auth: {
            roles: ['superadmin', 'compras', 'area'],
          },
        },
        component: MainPAA,
      },
    ],
  },
];

export default catalogos;
