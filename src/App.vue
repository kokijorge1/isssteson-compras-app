<template>
  <v-app class="background">
    <nprogress-container></nprogress-container>
    <router-view></router-view>
    <v-snackbar
      v-model="showSnack"
      :color="$store.state.settings.generales.respuesta.color"
      multi-line>
      {{ $store.state.settings.generales.respuesta.texto }}
      <v-btn
        dark
        flat
        @click="cerrarSnack">
        cerrar
      </v-btn>
    </v-snackbar>
    <v-dialog
      v-model="$store.state.settings.generales.isCargando"
      persistent
      max-width="100px">
      <v-card>
        <v-card-text>
          <v-layout align-center justify-center row fill-height>
            <v-progress-circular
              indeterminate
              color="primary">
            </v-progress-circular>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer.vue';

export default {
  name: 'MainApp',
  components: {
    NprogressContainer,
  },
  data() {
    return {
      showSnack: false,
      name: process.env.VUE_APP_NAME,
    };
  },
  methods: {
    cerrarSnack() {
      const respuesta = {
        mostrar: false,
        texto: '',
        color: '',
      };
      this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
    },
  },
  watch: {
    '$store.state.settings.generales.respuesta': {
      handler(respuesta) {
        this.showSnack = respuesta.mostrar;
      },
      deep: true,
    },
    showSnack: {
      handler(newVal) {
        const respuesta = {
          mostrar: false,
          texto: '',
          color: '',
        };
        if (!newVal) {
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        }
      },
    },
  },
};
</script>

<style lang="scss">
.nprogress-custom-parent {
  overflow: inherit !important;
}
.loading-dialog{
  background-color: #303030;
}
</style>
