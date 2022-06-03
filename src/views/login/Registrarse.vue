<template>
  <div id="contenedor-registrar-proveedor">
    <v-content>
      <public-header />
      <v-container>
        <v-layout row justify-center>
          <v-flex xs12 md7>
            <v-card class="roundedCustom elevation-7">
              <v-stepper v-model="pasoCodigo" vertical>
                <v-stepper-step :complete="pasoCodigo > 1" step="1">
                  Indique su correo
                </v-stepper-step>

                <v-stepper-content step="1">
                  <v-form v-model="correoValido">
                    <v-text-field
                      v-model="email"
                      label="Correo Electrónico"
                      placeholder="Correo Electrónico"
                      :rules="[reglas.requerido, reglas.email]"
                      prepend-inner-icon="alternate_email"
                      type="email"
                      hide-details
                      outline>
                    </v-text-field>
                  </v-form>
                  <v-btn
                    color="primary"
                    :disabled="!correoValido"
                    @click="validarCorreo">
                    Enviar Código
                  </v-btn>
                </v-stepper-content>

                <v-stepper-step :complete="pasoCodigo > 2" step="2">
                  Código de verificación
                </v-stepper-step>

                <v-stepper-content step="2">
                  <v-btn
                    color="secondary"
                    class="roundedCustom mb-3"
                    @click="pasoCodigo = 1">
                    Cambiar el correo
                  </v-btn>
                  <v-form v-model="codigoValido">
                    <span>
                      Se ha enviado un código de verificación al correo:
                    </span><br>
                    <b>{{email}}</b>
                    <v-layout class="mt-2">
                      <v-flex xs12 md3>
                        <v-text-field
                          v-model="codigo"
                          label="Código"
                          placeholder="Código"
                          :rules="[reglas.requerido]"
                          prepend-inner-icon="vpn_key"
                          hide-details
                          outline>
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-form>
                  <v-btn
                    color="primary"
                    class="roundedCustom mt-3"
                    :disabled="!codigoValido"
                    @click="validarCodigo">
                    Validar
                  </v-btn>
                </v-stepper-content>

                <v-stepper-step :complete="pasoCodigo > 3" step="3">
                  Contraseña
                </v-stepper-step>

                <v-stepper-content step="3">
                  <v-form v-model="passValido">
                    <v-layout>
                      <v-flex xs12 md6 px-1>
                        <v-text-field
                          v-model="password"
                          type="password"
                          label="Contraseña"
                          :rules="[reglas.requerido, reglas.minCaracteres]"
                          persistent-hint
                          outline>
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 md6 px-1>
                        <v-text-field
                          v-model="rePassword"
                          type="password"
                          label="Re-Contraseña"
                          :rules="[reglas.requerido, reglas.minCaracteres,
                              reglas.comprarPasswords]"
                          persistent-hint
                          outline>
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-form>
                  <v-btn
                    color="primary"
                    class="roundedCustom mt-3"
                    :disabled="!passValido"
                    @click="establecerPass">
                    Establecer contraseña
                  </v-btn>
                </v-stepper-content>

              </v-stepper>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <custom-footer/>
  </div>
</template>

<script>
import Mensajes from '@/helpers/mensajes';
import PublicHeader from '@/components/PublicHeader.vue';
import CustomFooter from '@/components/CustomFooter.vue';
// import CustomButton from '@/components/CustomButton.vue';

export default {
  name: 'registrarseProveedor',
  components: {
    PublicHeader,
    CustomFooter,
    // CustomButton,
  },
  data() {
    return {
      correoValido: false,
      codigoValido: false,
      passValido: false,
      enviando: false,
      pasoCodigo: 1,
      email: '',
      codigo: '',
      token: '',
      password: '',
      rePassword: '',
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        email: (val) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(val) || 'Correo electrónico invalido.';
        },
        minCaracteres: v => v.length >= 8 || 'La contraseña debe de tener un minimo de 8 caracteres',
        comprarPasswords: () => this.password === this.rePassword
            || 'Las contraseñas no coiciden.',
      },
    };
  },
  methods: {
    async validarCorreo() {
      this.enviando = true;
      let correoNoEncontrado = false;
      const usuario = {
        correo_electronico: this.email,
      };
      await this.axios
        .post('/verificar/correo', { usuario })
        .then(() => {
          this.enviando = false;
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          correoNoEncontrado = true;
        });
      if (correoNoEncontrado) return;
      this.pasoCodigo = 2;
    },
    async validarCodigo() {
      this.enviando = true;
      let codigoErroneo = false;
      const usuario = {
        correo_electronico: this.email,
        codigo: this.codigo,
      };
      await this.axios
        .post('/verificar/codigo', { usuario })
        .then((res) => {
          this.enviando = false;
          this.token = res.data.token;
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          codigoErroneo = true;
        });
      if (codigoErroneo) return;
      this.pasoCodigo = 3;
    },
    async establecerPass() {
      this.enviando = true;
      let falloEstablecerPass = false;
      const usuario = {
        password: this.password,
        rePassword: this.codirePasswordgo,
      };
      const config = {
        headers: {
          Authorization: this.token,
          'Content-Type': 'application/json',
        },
      };
      await this.axios
        .patch('/usuario/password', { usuario }, config)
        .then(() => {
          this.enviando = false;
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          falloEstablecerPass = true;
        });
      if (falloEstablecerPass) return;
      const { email, password } = this;

      const login = {
        email,
        password,
      };

      this.$auth.login({
        url: 'auth/login',
        data: { login },
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
  computed: {},
};
</script>

<style lang="scss">
.altura-minima-docs {
  height: 24vh;
}</style>
