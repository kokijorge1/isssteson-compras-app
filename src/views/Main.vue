<template>
  <div id="contenedor-main-view">
    <router-view></router-view>
    <v-dialog
      v-model="$store.state.settings.generales.cambiarPassword"
      width="600">
      <cambiar-password></cambiar-password>
    </v-dialog>
  </div>
</template>

<script>
import CambiarPassword from '@/views/usuario/CambiarPassword.vue';

export default {
  name: 'MainView',
  components: {
    CambiarPassword,
  },
  data() {
    return {};
  },
  mounted() {
    let ruta = 'admin';
    if (this.$route.matched.length === 1) {
      if (!this.$auth.check()) this.$router.push({ name: 'login' });
      if (this.$auth.user().roles === 'proveedor') ruta = 'proveedores';
      this.$router.push({ name: ruta });
    }
  },
};
</script>

<style lang="scss">
</style>
