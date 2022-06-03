<template>
  <div id="contenedor-main-public">
    <public-header />
    <v-content>
      <v-container fluid grid-list-lg pa-0>
        <router-view></router-view>
      </v-container>
    </v-content>
    <custom-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import PublicHeader from '@/components/PublicHeader.vue';
import CustomFooter from '@/components/CustomFooter.vue';

export default {
  name: 'mainPublic',
  components: {
    PublicHeader,
    CustomFooter,
  },
  data: () => ({
  }),
  mounted() {
    if (this.adquisiciones.length <= 0) this.cargarPortal();
  },
  methods: {
    ...mapActions('portal', ['cargarPortal']),
    cargar() {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.cargarPortal()
        .then(() => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
  },
  computed: {
    ...mapGetters({
      adquisiciones: 'portal/adquisiciones',
    }),
  },
  sockets: {
    nuevoProveedor(proveedor) {
      this.$store.commit('portal/AGREGAR_PROVEEDOR', { proveedor });
    },
    nuevaAdquisicion(adquisicion) {
      this.$store.commit('portal/AGREGAR_ADQUISICION', { adquisicion });
    },
    editarAdquisicion(adquisicion) {
      this.$store.commit('portal/ACTUALIZAR_ADQUISICION', { adquisicion });
    },
    adjudicarArticulo(datos) {
      this.$store.commit('portal/ACTUALIZAR_COTIZACIONES_ARTICULO', { datos });
    },
    actualizarCotizacionAdquisicion(payload) {
      this.$store.commit('portal/ACTUALIZAR_PANEL', { payload });
    },
    borrarArticuloAdquisicion(payload) {
      this.$store.commit('portal/BORRAR_ARTICULO_ADQUISICION', { payload });
    },
  },
};
</script>

<style lang="scss">

</style>
