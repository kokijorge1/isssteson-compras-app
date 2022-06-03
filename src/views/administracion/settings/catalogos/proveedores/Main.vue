<template>
  <div id="contenedor-main-">
    <v-toolbar
      flat
      color="transparent">
      <page-title
        titulo="Proveedores">
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
  name: 'Main',
  components: {
    PageTitle,
    Listado,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
</style>
