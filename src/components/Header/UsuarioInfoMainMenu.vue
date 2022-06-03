<template>
  <div id="user-data-main-menu">
    <v-list class="pa-1">
      <v-list-group>
        <v-list-tile avatar slot="activator">
          <v-list-tile-avatar>
            <v-icon x-large>face</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>
            <span class="text-lowercase">
              {{ $auth.user().nombre }}
            </span>
          </v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list>
          <template v-if="$auth.user().roles !== 'proveedor'">
            <v-list-tile :to="{name: 'miPerfil'}">
              <v-list-tile-action>
                <v-icon>person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>Mi Perfil</v-list-tile-content>
            </v-list-tile>
          </template>
          <template v-else>
            <v-list-tile :to="{name: 'miPerfilProveedor'}">
              <v-list-tile-action>
                <v-icon>person</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>Mi Perfil</v-list-tile-content>
            </v-list-tile>
          </template>
          <v-list-tile @click="cambiarPassword">
            <v-list-tile-action>
              <v-icon>lock</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Cambiar contraseña</v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logout">
            <v-list-tile-action>
              <v-icon>exit_to_app</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>Salir</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-list-group>
      <v-divider></v-divider>
    </v-list>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'UserDataMenuMenu',
  components: {
  },
  data() {
    return {
      usuarioMenu: [
        {
          text: 'Mi Perfil',
          route: '',
          icon: 'person',
        },
        {
          text: 'Cambiar contraseña',
          route: '',
          icon: 'lock',
        },
      ],
    };
  },
  methods: {
    ...mapMutations({
      limpiarRequisiciones: 'requisiciones/LIMPIAR',
      limpiarAdquisiciones: 'adquisiciones/LIMPIAR',
      limpiarProveedores: 'proveedores/LIMPIAR',
      limpiarCatalogos: 'settings/catalogos/LIMPIAR',
    }),
    logout() {
      this.$socket.emit('manual_disconnect', 'Desconección Manual');
      this.limpiarRequisiciones();
      this.limpiarAdquisiciones();
      this.limpiarProveedores();
      this.limpiarCatalogos();
      this.$auth.logout({
        redirect: { name: 'portal' },
      });
    },
    cambiarPassword() {
      this.$store.commit('settings/generales/CAMBIAR_PASSWORD');
    },
  },
};
</script>

<style lang="scss">
</style>
