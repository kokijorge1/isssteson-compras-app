<template>
  <div id="tool-bar">
    <v-toolbar
      fixed
      app
      color="white"
      >
      <v-toolbar-side-icon
        class="pri--text"
        @click.stop="mostrar = !mostrar">
      </v-toolbar-side-icon>
      <v-layout row align-center>
        <v-flex xs3 sm2 md1 mr-2>
          <v-img src="/img/LogoISSSTESON-01.png"></v-img>
        </v-flex>
        <v-flex xs3 sm3 md3 lg3>
          <span class="font-weight-black title pri--text">
            PLATAFORMA VIRTUAL DE OSD
          </span>
        </v-flex>
      </v-layout>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <agregar-rapido
          v-if="$auth.user().roles !== 'proveedor'">
        </agregar-rapido>
        <usuario-info-tool-bar></usuario-info-tool-bar>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import AgregarRapido from './Agregar.vue';
import UsuarioInfoToolBar from './UsuarioInfoToolBar.vue';

export default {
  name: 'ToolBar',
  props: {
    drawer: {
      type: Boolean,
    },
  },
  components: {
    AgregarRapido,
    UsuarioInfoToolBar,
  },
  data() {
    return {
      mostrar: this.drawer,
    };
  },
  watch: {
    mostrar(nuevoValor) {
      this.$emit('mostrarDrawer', nuevoValor);
    },
    drawer(nuevoValor) {
      this.mostrar = nuevoValor;
    },
  },
};
</script>

<style lang="scss">
</style>
