<template>
  <div id="contenedor-main-panel-administracion">
    <main-header :menu="menu">
    </main-header>
    <router-view></router-view>
    <v-content class="background">
      <v-container fluid class="pt-0" v-if="$route.path === '/panel'">
        <bienvenida/>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MainHeader from '@/components/Header.vue';
import Mensajes from '@/helpers/mensajes';
import Bienvenida from './Bienvenida.vue';

export default {
  name: 'MainPanelAdministracion',
  components: {
    MainHeader,
    Bienvenida,
  },
  data() {
    return {
      menu: [
        {
          text: 'Catálogos',
          route: '',
          icon: 'settings',
          children: [
            {
              text: 'Usuarios',
              route: 'settingsCatalogoUsuarios',
            },
            {
              text: 'Unidad Adm. Responsable',
              route: 'settingsCatalogoUnidadesAdministrativas',
            },
            {
              text: 'Areas',
              route: 'settingsCatalogoAreas',
            },
            {
              text: 'Partidas Genericas',
              route: 'settingsCatalogoPartidasGenericas',
            },
            {
              text: 'Partidas',
              route: 'settingsCatalogoPartidas',
            },
            {
              text: 'Bienes y Servicios',
              route: 'settingsCatalogoBienesServicios',
            },
            {
              text: 'Proveedores',
              route: 'settingsCatalogoProveedores',
            },
            {
              text: 'Tipo Requisiciones',
              route: 'settingsCatalogoTipoRequisiciones',
            },
            // {
            //   text: 'PAA',
            //   route: 'settingsCatalogoPAA',
            // },
          ],
        },
        {
          text: 'Requisiciones',
          route: 'requisiciones',
          icon: 'add_shopping_cart',
        },
        {
          text: 'Compras',
          route: 'adquisiciones',
          icon: 'shopping_cart',
        },
        // {
        //   text: 'Pedidos',
        //   route: '',
        //   icon: 'assignment_turned_in',
        // },
        {
          text: 'Informes',
          route: '',
          icon: 'insert_chart_outlined',
          children: [
            {
              text: 'Monitor',
              route: 'monitorGlobal',
            },
            {
              text: 'Adquisiciones por Fechas',
              route: 'adquisicionesFecha',
            },
            {
              text: 'Resumen Partida/Articulo',
              route: 'resumenPartidaArticulo',
            },
            {
              text: 'Resumen por Proveedores',
              route: 'resumenProveedores',
            },
            {
              text: 'Resumen por Unidad Compradora',
              route: 'resumenUniAdmin',
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.inicializarCatalogos();
    /**
     * TODO
     * coneccion con socket para cagar los datos no compartidos,
     * dependiendo del tipo de isuario
     */
    this.$socket.emit('usuarioConectado', this.$auth.user());
  },
  methods: {
    ...mapActions('settings/catalogos', ['cargarCatalogos']),
    inicializarCatalogos() {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.cargarCatalogos().then(() => {
        this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
  },
  sockets: {
    catalogoGlobal(datos) {
      if (!datos.tipo) return;

      switch (datos.tipo) {
        case 'AGREGAR_PARTIDA_GENERICA':
          this.$store.commit('settings/catalogos/AGREGAR_PARTIDA_GENERICA', {
            partidaGenerica: datos.data,
          });
          break;
        case 'ACTUALIZAR_PARTIDA_GENERICA':
          this.$store.commit('settings/catalogos/ACTUALIZAR_PARTIDA_GENERICA', {
            partidaGenerica: datos.data,
          });
          break;
        case 'BORRAR_PARTIDA_GENERICA':
          this.$store.commit('settings/catalogos/BORRAR_PARTIDA_GENERICA', {
            payload: datos.data,
          });
          break;
        case 'AGREGAR_PARTIDA':
          this.$store.commit('settings/catalogos/AGREGAR_PARTIDA', {
            partida: datos.data,
          });
          break;
        case 'ACTUALIZAR_PARTIDA':
          this.$store.commit('settings/catalogos/ACTUALIZAR_PARTIDA', {
            partida: datos.data,
          });
          break;
        case 'BORRAR_PARTIDA':
          this.$store.commit('settings/catalogos/BORRAR_PARTIDA', {
            payload: datos.data,
          });
          break;
        case 'AGREGAR_ARTICULO':
          this.$store.commit('settings/catalogos/AGREGAR_ARTICULO', {
            articulo: datos.data,
          });
          break;
        case 'ACTUALIZAR_ARTICULO':
          this.$store.commit('settings/catalogos/ACTUALIZAR_ARTICULO', {
            articulo: datos.data,
          });
          break;
        case 'BORRAR_ARTICULO':
          this.$store.commit('settings/catalogos/BORRAR_ARTICULO', {
            payload: datos.data,
          });
          break;
        default:
          break;
      }
    },
    requisiciones(datos) {
      this.$store.commit(`requisiciones/${datos.tipo}`, {
        requisicion: datos.data,
      });
    },
    editarAdquisicion(adquisicion) {
      this.$store.commit('adquisiciones/ACTUALIZAR_ADQUISICION', { adquisicion });
    },
    nuevoProveedor(proveedor) {
      this.$store.commit('settings/catalogos/AGREGAR_PROVEEDOR', { proveedor });
    },
    actualizarCotizacionAdquisicion(cotizacion) {
      const { cotizaciones: payload } = cotizacion;
      this.$store.commit('adquisiciones/ACTUALIZAR_PANEL', { payload });
    },
    updateUsuariosConectados(usuarios) {
      this.$store.commit('settings/generales/ACTUALIZAR_USUARIOS_CONECTADOS', { usuarios });
    },
  },
};
</script>

<style lang="scss">
</style>
