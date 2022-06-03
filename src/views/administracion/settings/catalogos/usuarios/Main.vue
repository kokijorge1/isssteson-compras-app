<template>
  <div id="contenedor-main-usuarios">
    <v-toolbar
      flat
      color="transparent">
      <page-title
        titulo="Usuarios">
      </page-title>
    </v-toolbar>
    <v-card class="roundedCustom">
      <v-card-text>
        <listado></listado>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle.vue';
import Listado from './Listado.vue';

export default {
  name: 'MainUsuarios',
  components: {
    PageTitle,
    Listado,
  },
  data() {
    return {};
  },
  mounted() {
  },
};
</script>

<style lang="scss">
</style>
