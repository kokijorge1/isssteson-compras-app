<template>
  <v-menu offset-y left>
    <v-btn
      slot="activator"
      icon
      class="white--text">
      <v-icon class="pri--text">add</v-icon>
    </v-btn>
    <v-list>
      <template>
        <v-list-tile
          :to="{name: 'requisicionAgregar'}">
          <v-list-tile-title>
            Requisición
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          :to="{name: 'adquisicionesAgregar'}">
          <v-list-tile-title>
            Adquisición
          </v-list-tile-title>
        </v-list-tile>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'AgregarRegistrosAccesoRapido',
  data() {
    return {
    };
  },
  methods: {
    doomie() {},
  },
};
</script>

<style lang="scss">
</style>
