<template>
  <div id="contenedor-main-requisiciones">
      <v-content>
          <bread-crumbs class="mx-4 mt-2"></bread-crumbs>
          <v-container fluid>
              <router-view></router-view>
          </v-container>
      </v-content>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import BreadCrumbs from '@/components/BreadCrumbs.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'MainRequisiciones',
  components: {
    BreadCrumbs,
  },
  data() {
    return {};
  },
  mounted() {
    if (this.requisiciones.length <= 0) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.cargarRequisiciones()
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
    ...mapActions('requisiciones', ['cargarRequisiciones']),
  },
  computed: {
    ...mapGetters({
      requisiciones: 'requisiciones/requisiciones',
    }),
  },
};
</script>

<style lang="scss">
</style>
