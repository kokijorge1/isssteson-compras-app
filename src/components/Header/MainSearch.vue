<template>
<div id="mai-search">
  <v-text-field
    solo-inverted
    clearable
    full-width
    label="Buscar..."
    append-icon="search"
    width="500"
    class="search">
  </v-text-field>
</div>
</template>

<script>
export default {
  name: 'BuscadorPrincipal',
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.search {
  width: 400px;
}
</style>
