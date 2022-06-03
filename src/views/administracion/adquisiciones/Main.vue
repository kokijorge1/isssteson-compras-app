<template>
  <div id="contenedor-main-adquisiciones">
    <v-content class="background">
      <router-view name="pageHeader"/>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'MainAdquisiciones',
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
    if (this.requisiciones.length <= 0) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this['requisiciones/cargarRequisiciones']()
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
      'requisiciones/cargarRequisiciones',
      'adquisiciones/cargarAdquisiciones',
    ]),
  },
  computed: {
    ...mapGetters({
      requisiciones: 'requisiciones/requisiciones',
      adquisiciones: 'adquisiciones/adquisiciones',
    }),
  },
};
</script>

<style lang="scss">
</style>
