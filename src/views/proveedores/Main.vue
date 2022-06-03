<template>
  <div id="contenedor-main-panel-proveedores">
    <main-header
      :menu="menu">
    </main-header>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MainHeader from '@/components/Header.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'MainPanelProveedores',
  components: {
    MainHeader,
  },
  data() {
    return {
      menu: [
        {
          text: 'Compras',
          route: 'proveedores',
          icon: 'add_shopping_cart',
        },
      ],
    };
  },
  mounted() {
    this.$socket.emit('usuarioConectado', this.$auth.user());
    if (this.listado.length <= 0) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.cargarAdquisiciones()
        .then(() => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    }
  },
  methods: {
    ...mapActions('proveedores', ['cargarAdquisiciones']),
  },
  computed: {
    ...mapGetters({
      listado: 'proveedores/adquisiciones',
    }),
  },

  sockets: {
    editarAdquisicion(adquisicion) {
      this.$store.commit('adquisiciones/ACTUALIZAR_ADQUISICION', { adquisicion });
    },
    actualizarCotizacionAdquisicion(cotizacion) {
      const { cotizaciones: data } = cotizacion;
      this.$store.commit('proveedores/ACTULIZAR_ARTICULO_MEJOR_PROPUESTA', { data });
    },
  },
};
</script>

<style lang="scss">
</style>
