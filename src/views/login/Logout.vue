<template>
  <div id="contenedor-log-out"></div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Logout',
  data() {
    return {};
  },
  mounted() {
    this.logout();
  },
  methods: {
    ...mapMutations({
      limpiarRequisiciones: 'requisiciones/LIMPIAR',
      limpiarAdquisiciones: 'adquisiciones/LIMPIAR',
      limpiarProveedores: 'proveedores/LIMPIAR',
      limpiarCatalogos: 'settings/catalogos/LIMPIAR',
    }),
    logout() {
      this.limpiarRequisiciones();
      this.limpiarAdquisiciones();
      this.limpiarProveedores();
      this.limpiarCatalogos();
      this.$auth.logout({
        redirect: { name: 'login' },
      });
    },
  },
};
</script>

<style lang="scss">
</style>
