import Main from '@/views/administracion/adquisiciones/Main.vue';
import MainPageHeader from '@/views/administracion/adquisiciones/PageHeader.vue';
import Listado from '@/views/administracion/adquisiciones/Listado.vue';
import Agregar from '@/views/administracion/adquisiciones/Agregar.vue';
import MainAdquisicion from '@/views/administracion/adquisiciones/adquisicion/Main.vue';
import PageHeaderAdquisicion from '@/views/administracion/adquisiciones/adquisicion/PageHeader.vue';
import EditarAdquisicion from '@/views/administracion/adquisiciones/adquisicion/Editar.vue';
import Proveedores from '@/views/administracion/adquisiciones/adquisicion/Proveedores.vue';
import PosturasIniciales from '@/views/administracion/adquisiciones/adquisicion/PosturasIniciales.vue';
import Monitor from '@/views/administracion/adquisiciones/adquisicion/Monitor.vue';
import PropuestaProveedor from '@/views/administracion/adquisiciones/adquisicion/PropuestaProveedor.vue';
import Cotizaciones from '@/views/administracion/adquisiciones/adquisicion/Cotizaciones.vue';
import Expediente from '@/views/administracion/adquisiciones/adquisicion/Expediente.vue';
import Evaluacion from '@/views/administracion/adquisiciones/adquisicion/evaluacion/Main.vue';

const adquisiciones = [
  {
    path: 'adquisiciones',
    meta: {
      breadTitle: 'Compras',
      namePathInicial: 'adquisiciones',
    },
    component: Main,
    children: [
      {
        name: 'adquisiciones',
        path: '',
        meta: {
          title: 'Compras',
          auth: {
            roles: ['superadmin', 'compras'],
          },
        },
        components: {
          pageHeader: MainPageHeader,
          default: Listado,
        },
        children: [],
      },
      {
        name: 'adquisicionesAgregar',
        path: 'agregar',
        meta: {
          title: 'Nueva Compra',
          breadTitle: 'Agregar',
          auth: {
            roles: ['superadmin', 'compras'],
          },
        },
        components: {
          default: Agregar,
          pageHeader: MainPageHeader,
        },
        children: [],
      },
      {
        path: ':id/:identificador',
        meta: {
          useParamAsBreadTitle: true,
          breadTitle: '',
        },
        components: {
          default: MainAdquisicion,
          pageHeader: PageHeaderAdquisicion,
        },
        children: [
          {
            name: 'adquisicionesEditar',
            path: '',
            meta: {
              title: 'Detalles de la Compra',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: EditarAdquisicion,
            children: [],
          },
          {
            name: 'adquisicionesProveedores',
            path: 'proveedores',
            meta: {
              title: 'Invitacion proveedores',
              breadTitle: 'Proveedores',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: Proveedores,
            children: [],
          },
          {
            name: 'adquisicionesProveedoresPosturasIniciales',
            path: 'proveedores-posturas-iniciales',
            meta: {
              title: 'Posturas Iniciales',
              breadTitle: 'Posturas Iniciales',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: PosturasIniciales,
            children: [],
          },
          {
            name: 'adquisicionesMonitor',
            path: 'monitor',
            meta: {
              title: 'Monitor de Propuestas',
              breadTitle: 'Monitor',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: Monitor,
            children: [],
          },
          {
            name: 'adquisicionesPropuestaProveedor',
            path: 'propuestaproveedor',
            meta: {
              title: 'Propuesta Proveedor',
              breadTitle: 'Propuesta Proveedor',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: PropuestaProveedor,
            children: [],
          },
          {
            name: 'adquisicionExpediente',
            path: 'expediente',
            meta: {
              title: 'Expediente',
              breadTitle: 'Expediente',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: Expediente,
          },
          {
            name: 'adquisicionesCotizaciones',
            path: 'cotizaciones',
            meta: {
              title: 'Cotizaciones',
              breadTitle: 'Cotizaciones',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: Cotizaciones,
            children: [],
          },
          {
            name: 'adquisicionesEvaluacion',
            path: 'evaluacion',
            meta: {
              title: 'Evaluación',
              breadTitle: 'Evaluación',
              auth: {
                roles: ['superadmin', 'compras'],
              },
            },
            component: Evaluacion,
            children: [],
          },
        ],
      },
    ],
  },
];

export default adquisiciones;
