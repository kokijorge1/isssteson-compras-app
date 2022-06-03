<template>
  <div id="contenedor-main-panel-administracion">
    <h1 class="display-2 font-weight-thin my-4">Bienvenidos</h1>
    <v-layout
      row wrap>
      <v-flex
        xs12
        md6>
        <v-card>
          <v-toolbar
            dense
            color="info"
            dark>
            <v-toolbar-title>
              <v-icon left>
                people_outline
              </v-icon>
              Actividad
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md6 pr-1>
                <v-card flat>
                  <v-card-title class="pb-0">
                    Usuarios
                    <v-chip
                      small
                      outline>
                      {{ listadoUduariosInternos.length }}
                    </v-chip>
                  </v-card-title>
                  <v-list two-line dense>
                    <template
                      v-for="(usuario, index) in listadoUduariosInternos">
                      <v-divider
                          v-if="index > 0"
                          inset
                          :key="`__${usuario.id}`">
                      </v-divider>
                      <v-list-tile :key="usuario.id">
                        <v-list-tile-avatar>
                          <v-icon class="green--text" large>account_circle</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title v-text="usuario.nombre"></v-list-tile-title>
                          <v-list-tile-sub-title>
                            <strong>
                              {{ usuario.roles }}
                            </strong>
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            icon
                            ripple
                            @click="mostrarDatosUsuarioInterno(usuario)">
                            <v-icon color="grey lighten-1">info</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card>
              </v-flex>
              <v-divider>
              </v-divider>
              <v-flex xs12 md6>
                <v-card flat>
                  <v-card-title>
                    Usuarios Proveedores
                    <v-chip
                      small
                      outline>
                      {{ listadoUduariosProveedor.length }}
                    </v-chip>
                  </v-card-title>
                  <v-list three-line>
                    <template
                      v-for="(usuario, index) in listadoUduariosProveedor">
                      <v-divider
                          v-if="index > 0"
                          inset
                          :key="`__${usuario.id}`">
                      </v-divider>
                      <v-list-tile :key="usuario.id">
                        <v-list-tile-avatar>
                          <v-icon class="green--text" large>account_circle</v-icon>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                          <v-list-tile-title v-text="usuario.nombre"></v-list-tile-title>
                          <v-list-tile-sub-title>
                            <strong>
                              {{ usuario.proveedor.nombre }}
                            </strong>
                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            icon
                            ripple
                            @click="mostrarDatosUsuarioProveedor(usuario)">
                            <v-icon color="grey lighten-1">info</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        md6>
      </v-flex>
    </v-layout>
    <!-- DETALLES USUARIO INTERNO -->
    <v-dialog v-model="dialogUsuarioInterno" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Detalles Usuario
        </v-card-title>
        <v-card-text>
          <v-layout row wrap v-if="usuarioInterno">
            <v-flex xs12>
              <small>Nombre: </small><strong>{{ usuarioInterno.nombre }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Unidad Administrativa: </small>
              <strong>{{ usuarioInterno.unidad_administrativa.nombre || '-' }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Area: </small>
              <strong>{{ usuarioInterno.area.nombre || '-' }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Puesto: </small><strong>{{ usuarioInterno.puesto }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Rol: </small><strong>{{ usuarioInterno.roles }}</strong>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- DETALLES USUARIO PROVEEDOR -->
    <v-dialog v-model="dialogUsuarioProveedor" max-width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Detalles Usuario
        </v-card-title>
        <v-card-text>
          <v-layout row wrap v-if="usuarioProveedor">
            <v-flex xs12>
              <small>Nombre: </small><strong>{{ usuarioProveedor.nombre }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Empresa: </small>
              <strong>{{ usuarioProveedor.proveedor.nombre || '-' }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>RFC: </small>
              <strong>{{ usuarioProveedor.proveedor.rfc || '-' }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Informacion Contacto: </small>
              <strong>{{ usuarioProveedor.proveedor.informacion_contacto || '-' }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Nombre Representante: </small>
              <strong>{{ usuarioProveedor.proveedor.nombre_representante || '-' }}</strong>
            </v-flex>
            <v-flex xs12>
              <small>Rol: </small><strong>{{ usuarioProveedor.roles }}</strong>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Bienvenida',
  components: {},
  data() {
    return {
      dialogUsuarioInterno: false,
      dialogUsuarioProveedor: false,
      usuarioInterno: null,
      usuarioProveedor: null,
    };
  },
  mounted() {},
  methods: {
    mostrarDatosUsuarioInterno(usuario) {
      this.usuarioInterno = usuario;
      this.dialogUsuarioInterno = true;
    },
    mostrarDatosUsuarioProveedor(usuario) {
      this.usuarioProveedor = usuario;
      this.dialogUsuarioProveedor = true;
    },
  },
  computed: {
    listadoUduariosInternos() {
      return this.$store.state.settings.generales.usuariosConectados
        .filter(usuario => usuario.roles !== 'proveedor')
        .filter(usuario => usuario.id !== 1);
    },
    listadoUduariosProveedor() {
      return this.$store.state.settings.generales.usuariosConectados
        .filter(usuario => usuario.roles === 'proveedor');
    },
  },
};
</script>

<style lang="scss">
</style>
