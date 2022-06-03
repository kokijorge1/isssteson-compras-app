<template>
  <div id="contenedor-main-settings-catalogos">
    <v-content class="background">
      <bread-crumbs class="mx-4 mt-2"></bread-crumbs>
      <v-container :fluid="$store.state.settings.generales.fluid">
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/BreadCrumbs.vue';

export default {
  name: 'MainSettingsCatalogos',
  components: {
    BreadCrumbs,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
</style>
