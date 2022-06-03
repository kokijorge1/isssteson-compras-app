<template>
  <div id="contenedor">
      <v-alert
        :value="true"
        type="warning">
        Acceso Restringido.
        <a @click.prevent="$router.go(-1)">Regresar</a>
      </v-alert>
      <h1 class="display-4 font-weight-thin">403</h1>
  </div>
</template>

<script>
export default {
  name: 'SinPermisos',
  data() {
    return {};
  },
};
</script>

<style lang="scss">
</style>
