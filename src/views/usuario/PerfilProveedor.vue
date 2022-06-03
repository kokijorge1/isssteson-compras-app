<template>
  <div id="contenedor-perfil-proveedor">
    <v-toolbar flat color="transparent">
      <page-title titulo="Mi Perfil"></page-title>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <h1 class="title mb-4">
          <v-icon left>perm_identity</v-icon>Generales
        </h1>
        <v-form v-model="validoUsuario">
          <v-text-field
            v-model="usuario.nombre"
            label="Nombre"
            :rules="[reglas.requerido]">
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
          <v-text-field
            v-model="usuario.correo_electronico"
            label="Correo Electrónico"
            :rules="[reglas.requerido, reglas.email]"
          ></v-text-field>
          <v-textarea
            v-model="usuario.puesto"
            label="Puesto"
            :rules="[reglas.requerido]"
            auto-grow
            rows="3"
          ></v-textarea>
          <v-btn
            color="primary"
            class="mt-2"
            :loading="enviandoUsuario"
            :disabled="!validoUsuario"
            @click.prevent="guardarDatosUsuarios"
          >
            <v-icon left dark>save</v-icon>Guardar
          </v-btn>
        </v-form>
        <template v-if="$auth.user().roles === 'proveedor'">
          <v-divider class="my-5"></v-divider>
          <h1 class="title mb-4">
            <v-icon left>business</v-icon>Empresa
          </h1>
          <v-form v-model="validoProveedor">
            <v-text-field
              v-model="proveedor.nombre"
              label="Nombre/Razon"
              :rules="[reglas.requerido]"
              hint="Requerido *"
              persistent-hint
            ></v-text-field>
            <v-text-field
              v-model="proveedor.rfc"
              label="RFC"
              :rules="[reglas.requerido]"
              hint="Requerido *"
              persistent-hint
              class="mt-3"
            ></v-text-field>
            <v-textarea
                v-model="proveedor.domicilio"
                label="Domicilio"
                auto-grow
                rows="3"
                class="mt-3">
            </v-textarea>
            <v-text-field
              v-model="proveedor.nombre_representante"
              label="Representante"
              :rules="[reglas.requerido]"
              hint="Requerido *"
              persistent-hint
              class="mb-3"
            ></v-text-field>
            <v-text-field
              v-model="proveedor.correo_electronico"
              type="email"
              label="Correo Electrónico"
              :rules="[reglas.requerido, reglas.email]"
              hint="Requerido *"
              persistent-hint
              class="mb-3"
            ></v-text-field>
            <v-textarea
              v-model="proveedor.informacion_contacto"
              label="Contacto"
              placeholder="Datos del Contacto"
              auto-grow
              rows="3"
            ></v-textarea>
            <v-btn
              color="primary"
              class="mt-2"
              :loading="enviandoProveedor"
              :disabled="!validoProveedor"
              @click.prevent="guardarDatosProveedor">
              <v-icon left dark>save</v-icon>Guardar
            </v-btn>
          </v-form>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'PerfilProveedor',
  components: {
    PageTitle,
  },
  data() {
    return {
      validoUsuario: false,
      enviandoUsuario: false,
      validoProveedor: false,
      enviandoProveedor: false,
      usuario: {
        nombre: this.$auth.user().nombre,
        correo_electronico: this.$auth.user().correo_electronico,
        puesto: this.$auth.user().puesto,
      },
      proveedor: {
        nombre: this.$auth.user().proveedor.nombre,
        rfc: this.$auth.user().proveedor.rfc,
        nombre_representante: this.$auth.user().proveedor.nombre_representante,
        domicilio: this.$auth.user().proveedor.domicilio,
        informacion_contacto: this.$auth.user().proveedor.informacion_contacto,
        correo_electronico: this.$auth.user().proveedor.correo_electronico,
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
    ...mapActions('settings/catalogos', ['actulizarProveedor']),
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
    guardarDatosProveedor() {
      this.enviandoProveedor = true;
      this.actulizarProveedor({
        id: this.$auth.user().proveedor.id,
        proveedor: this.proveedor,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviandoProveedor = false;
          this.$auth.user().proveedor = {
            ...this.proveedor,
          };
        })
        .catch((err) => {
          this.enviandoProveedor = false;
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
