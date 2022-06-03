<template>
  <div id="contenedor-perfil">
      <v-content>
          <v-container>
              <v-toolbar
                flat
                color="transparent">
                  <page-title titulo="Mi Perfil"></page-title>
              </v-toolbar>
              <v-card>
                  <v-card-text>
                      <h1 class="title mb-4">
                          <v-icon left>perm_identity</v-icon>
                          Generales
                      </h1>
                      <v-form v-model="validoUsuario">
                          <v-text-field
                            v-model="usuario.nombre"
                            label="Nombre"
                            :rules="[reglas.requerido]">
                          </v-text-field>
                          <v-text-field
                            v-model="usuario.correo_electronico"
                            type="email"
                            label="Correo Electrónico"
                            :rules="[reglas.requerido, reglas.email]">
                          </v-text-field>
                          <v-btn
                            color="teal darken-3"
                            dark
                            block
                            class="mb-4"
                            @click="cambiarPassword">
                            <v-icon left>lock</v-icon>
                            Cambiar contraseña
                          </v-btn>
                          <v-textarea
                            v-model="usuario.puesto"
                            label="Puesto"
                            :rules="[reglas.requerido]"
                            auto-grow
                            rows=3>
                          </v-textarea>
                          <v-btn
                            color="primary"
                            class="mt-2"
                            :loading="enviandoUsuario"
                            :disabled="!validoUsuario"
                            @click.prevent="guardarDatosUsuarios">
                            <v-icon left dark>save</v-icon>
                            Guardar
                          </v-btn>
                      </v-form>
                  </v-card-text>
              </v-card>
          </v-container>
      </v-content>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'PerfilUsuario',
  components: {
    PageTitle,
  },
  data() {
    return {
      validoUsuario: false,
      enviandoUsuario: false,
      usuario: {
        nombre: this.$auth.user().nombre,
        correo_electronico: this.$auth.user().correo_electronico,
        puesto: this.$auth.user().puesto,
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        email: (val) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(val) || 'Correo electrónico invalido.';
        },
      },
    };
  },
  methods: {
    guardarDatosUsuarios() {
      this.enviandoUsuario = true;
      this.axios.patch('/usuario', { usuario: this.usuario })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.$auth.user().nombre = this.usuario.nombre;
          this.$auth.user().correo_electronico = this.usuario.correo_electronico;
          this.$auth.user().puesto = this.usuario.puesto;
          this.enviandoUsuario = false;
        })
        .catch((err) => {
          this.enviandoUsuario = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
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
