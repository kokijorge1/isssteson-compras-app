<template>
  <div style="height: 100vh;">
    <public-header />
    <v-content id="contenedor-main-login" fill-height style="height: 75vh;">
      <v-layout align-center justify-center row fill-height>
        <v-flex lg4 md6 sm8 xs12>
          <v-card class="roundedCustom">
            <v-toolbar color="primary" dark>
              <v-toolbar-title class="headline">
                Iniciar sesión
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-title>
              <h1 class="headline font-weight-thin"></h1>
            </v-card-title>
            <v-card-text>
              <v-alert :value="true" type="warning" v-if="mensaje.length > 0" class="mb-4">
                {{ mensaje }}
              </v-alert>
              <v-form ref="form" v-model="valido">
                <v-text-field
                  type="email"
                  prepend-icon="person"
                  label="Correo Electrónico"
                  :rules="[reglas.requerido, reglas.email]"
                  v-model="login.email"
                  v-on:keyup.enter="doLogin"
                  autofocus
                >
                </v-text-field>
                <v-text-field
                  :append-icon="mostrarPass ? 'visibility_off' : 'visibility'"
                  prepend-icon="lock"
                  label="Contraseña"
                  :type="mostrarPass ? 'text' : 'password'"
                  :rules="[reglas.requerido]"
                  v-model="login.password"
                  counter
                  @click:append="mostrarPass = !mostrarPass"
                  v-on:keyup.enter="doLogin"
                >
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <!-- <v-btn :to="{ name: 'registrarse' }" flat>
                Registrarse
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn block color="primary" :disabled="!valido" @click="doLogin">
                <v-icon left dark v-show="valido">done</v-icon>
                Entrar
              </v-btn> -->
              <custom-button
                :to="{ name: 'registrarse' }"
                tipo="formCancelar"
                label="Registrarse"
                class="ma-3">
              </custom-button>
              <v-spacer></v-spacer>
              <custom-button
                @click="doLogin"
                :disabled="!valido"
                tipo="formAceptar"
                label="Entrar"
                class="ma-3 px-5">
              </custom-button>
            </v-card-actions>
          </v-card>
          <div class="d-flex mt-2 grey--text text--lighten-1">
            © {{ $ejercicioActual() }} ecompra.mx
            <!-- <v-divider vertical class="mx-3"></v-divider> -->
            <!-- <v-flex xs3 sm3 md3 lg3>
                <v-img src="/img/logo-sonora.png"></v-img>
              </v-flex> -->
          </div>
        </v-flex>
      </v-layout>
    </v-content>
    <custom-footer/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import PublicHeader from '@/components/PublicHeader.vue';
import CustomFooter from '@/components/CustomFooter.vue';
import CustomButton from '@/components/CustomButton.vue';

export default {
  name: 'MainLogin',
  components: {
    PublicHeader,
    CustomFooter,
    CustomButton,
  },
  data() {
    return {
      mensaje: '',
      valido: false,
      mostrarPass: false,
      login: {
        email: '',
        password: '',
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        minCharPassword: v => v.length >= 8 || 'La contraseña debe contener por lo menos 8 caracteres.',
        email: (v) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || 'Correo electrónico invalido.';
        },
      },
    };
  },
  mounted() {
    this.limpiarRequisiciones();
    this.limpiarAdquisiciones();
    this.limpiarProveedores();
    this.limpiarCatalogos();

    if (this.login.email && this.login.password) {
      this.$refs.form.validate();
    }
  },
  methods: {
    ...mapMutations({
      limpiarRequisiciones: 'requisiciones/LIMPIAR',
      limpiarAdquisiciones: 'adquisiciones/LIMPIAR',
      limpiarProveedores: 'proveedores/LIMPIAR',
      limpiarCatalogos: 'settings/catalogos/LIMPIAR',
    }),
    doLogin() {
      this.$auth.login({
        url: 'auth/login',
        data: { login: this.login },
        rememberMe: false,
        fetchUser: true,
        error(err) {
          if ((!err.status || err.status >= 500) && !err.response) {
            this.mensaje = err.msg;
            return;
          }
          this.mensaje = err.response.data.msg;
        },
      });
    },
  },
};
</script>

<style lang="scss"></style>
