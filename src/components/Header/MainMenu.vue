<template>
  <div id="main-menu">
    <v-navigation-drawer
      v-model="mostrar"
      fixed
      temporary>
      <usuario-info-main-menu></usuario-info-main-menu>
      <v-list>
        <v-subheader>Menu</v-subheader>
        <template v-for="m in menu">
          <template v-if="m.children && m.children.length > 0">
            <v-list-group :prepend-icon="m.icon" :key="'__' + m.text">
              <v-list-tile slot="activator">
                <v-list-tile-title>{{ m.text }}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile
                v-for="child in m.children"
                :key="'__' + child.text"
                :to="{ name: child.route }"
              >
                <v-list-tile-action>
                  <v-icon>{{ child.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>{{ child.text }}</v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </template>
          <template v-else>
            <v-list-tile :key="'__' + m.text" :to="{ name: m.route }">
              <v-list-tile-action>
                <v-icon>{{ m.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>{{ m.text }}</v-list-tile-content>
            </v-list-tile>
          </template>
        </template>
      </v-list>
      <v-divider></v-divider>
      <div class="px-4 py-2 grey--text text--darken-1">
        <small>
          © {{ $ejercicioActual() }} ecompra.mx
        </small>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import UsuarioInfoMainMenu from './UsuarioInfoMainMenu.vue';

export default {
  name: 'MenuPrincipal',
  props: {
    menu: {
      type: Array,
      required: true,
    },
    drawer: {
      type: Boolean,
    },
  },
  components: {
    UsuarioInfoMainMenu,
  },
  data() {
    return {
      mostrar: this.drawer,
    };
  },
  watch: {
    drawer(nuevoValor) {
      this.mostrar = nuevoValor;
    },
    mostrar(nuevoValor) {
      this.$emit('mostrarDrawer', nuevoValor);
    },
  },
};
</script>

<style lang="scss">
</style>
