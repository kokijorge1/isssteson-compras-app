<template>
  <div id="contenedor-cambiar-password">
      <v-card>
          <v-toolbar flat color="primary" dark class="headline">
            Cambiar contraseña
            <v-spacer></v-spacer>
            <v-btn icon @click="cancelar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
              <v-form v-model="valido">
                  <v-text-field
                    v-model="password"
                    type="password"
                    label="Nueva Contraseña"
                    hint="Requerido *"
                    :rules="[reglas.requerido, reglas.minCaracteres]"
                    persistent-hint>
                  </v-text-field>
                  <v-text-field
                    v-model="rePassword"
                    type="password"
                    label="Re-Nueva Contraseña"
                    :rules="[reglas.requerido, reglas.minCaracteres,
                        reglas.comprarPasswords]"
                    hint="Requerido *"
                    persistent-hint>
                  </v-text-field>
              </v-form>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :loading="enviando"
                :disabled="!valido"
                @click.prevent="guardar">
                  Guardar
              </v-btn>
              <v-btn flat @click="cancelar">Cancelar</v-btn>
          </v-card-actions>
      </v-card>
  </div>
</template>

<script>
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'CambiarPassword',
  data() {
    return {
      valido: false,
      enviando: false,
      password: '',
      rePassword: '',
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        minCaracteres: v => v.length >= 8 || 'La contraseña debe de tener un minimo de 8 caracteres',
        comprarPasswords: () => this.password === this.rePassword
            || 'Las contraseñas no coiciden.',
      },
    };
  },
  methods: {
    guardar() {
      this.enviando = true;
      this.axios.patch('/usuario/password', {
        usuario: {
          password: this.password,
          rePassword: this.rePassword,
        },
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
          this.cancelar();
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    cancelar() {
      this.password = '';
      this.rePassword = '';
      this.$store.commit('settings/generales/CAMBIAR_PASSWORD');
    },
  },
};
</script>

<style lang="scss">
</style>
