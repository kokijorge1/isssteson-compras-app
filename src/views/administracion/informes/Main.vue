<template>
  <div id="contenedor-informes">
    <v-content>
      <v-container grid-list-lg fluid class="pt-0">
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'MainInformes',
  components: {
  },
  data() {
    return {};
  },
  mounted() {
    if (this.adquisiciones.length <= 0) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this['adquisiciones/cargarAdquisiciones']()
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
    ...mapActions([
      'adquisiciones/cargarAdquisiciones',
    ]),
  },
  computed: {
    ...mapGetters({
      adquisiciones: 'adquisiciones/adquisiciones',
    }),
  },
  sockets: {
    nuevaAdquisicion(adquisicion) {
      this.$store.commit('adquisiciones/AGREGAR_ADQUISICION', { adquisicion });
    },
    adjudicarArticulo(datos) {
      this.$store.commit('adquisiciones/ACTUALIZAR_COTIZACIONES_ARTICULO', { datos });
    },
    actualizarCotizacionAdquisicion(cotizacion) {
      const { cotizaciones: payload } = cotizacion;
      this.$store.commit('adquisiciones/ACTUALIZAR_PANEL', { payload });
    },
    borrarArticuloAdquisicion(payload) {
      this.$store.commit('adquisiciones/BORRAR_ARTICULO_ADQUISICION', { payload });
    },
  },
};
</script>

<style lang="scss">
</style>
