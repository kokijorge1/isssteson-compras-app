<template>
  <v-menu
    offset-y
    left
    :close-on-content-click="false">
    <v-btn
        slot="activator"
        icon
        class="white--text">
        <v-badge
            v-model="mostrarBadge"
            color="red"
            overlap>
            <span slot="badge">4</span>
            <v-icon>notifications</v-icon>
        </v-badge>
    </v-btn>
    <v-card
        width="300">
      <v-toolbar
        color="light-blue"
        height="55"
        flat
        dark>
        <v-toolbar-title>Notificaciones</v-toolbar-title>
      </v-toolbar>
      <v-list
        two-line
        subheader>
        <v-subheader>Hoy</v-subheader>
        <v-list-tile avatar @click="doomie">
          <v-list-tile-content>
            <v-list-tile-title>Profile photo</v-list-tile-title>
            <v-list-tile-sub-title>Change your Google+ profile photo</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar @click="doomie">
          <v-list-tile-content>
            <v-list-tile-title>Show your status</v-list-tile-title>
            <v-list-tile-sub-title>Your status is visible to everyone</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list two-line subheader>
        <v-list-tile avatar @click="doomie">
          <v-list-tile-content>
            <v-list-tile-title>Profile photo</v-list-tile-title>
            <v-list-tile-sub-title>Change your Google+ profile photo</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar @click="doomie">
          <v-list-tile-content>
            <v-list-tile-title>Show your status</v-list-tile-title>
            <v-list-tile-sub-title>Your status is visible to everyone</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'Notificaciones',
  data() {
    return {
      mostrarBadge: true,
    };
  },
  methods: {
    doomie() {},
  },
};
</script>

<style lang="scss">
</style>
