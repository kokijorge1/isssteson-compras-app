<template>
  <v-menu
    offset-y
    left
    :close-on-content-click="false">
    <v-btn
      slot="activator"
      icon
      class="pri--text">
      <v-icon>face</v-icon>
    </v-btn>
    <v-card
        width="300">
      <v-list>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
              <span class="text-capitalize font-weight-black">
                {{ $auth.user().nombre }}
              </span>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ tipoUsuario }}
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
    </v-card>
  </v-menu>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'UsuarioInfoToolBar',
  components: {
  },
  data() {
    return { };
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
  computed: {
    tipoUsuario() {
      if (!this.$auth.check()) return '';
      switch (this.$auth.user().roles) {
        case 'superadmin': return 'Administrador';
        case 'compras': return `${this.$auth.user().unidad_administrativa.nombre}`;
        case 'area': return this.$auth.user().area.nombre;
        case 'proveedor': return this.$auth.user().proveedor.nombre;
        default:
          break;
      }

      return '';
    },
  },
};
</script>

<style lang="scss">
</style>
