<template>
  <div id="contenedor-main-bienes-servicios">
    <v-toolbar
      flat
      color="transparent">
      <page-title
        titulo="Bienes y Servicios">
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
  name: 'MainBienesServicios',
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
