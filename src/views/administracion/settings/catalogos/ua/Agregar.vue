<template>
  <div id="contenedor-agregar">
    <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
            Nueva
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="unidadAdministrativa.nombre"
            label="Nombre"
            :rules="[reglas.requerido]"
            hint="Campo requerido"
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model="unidadAdministrativa.nombre_corto"
            label="Siglas"
            :rules="[reglas.requerido]"
            hint="Campo requerido"
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model="unidadAdministrativa.nombre_responsable"
            label="Nombre Responsable">
          </v-text-field>
          <v-textarea
            v-model="unidadAdministrativa.puesto_responsable"
            label="Puesto Responsable">
          </v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click.prevent="guardar"
            :loading="enviando"
            :disabled="!valido">
            <v-icon>save</v-icon>
            Guardar
          </v-btn>
          <v-btn flat @click="cerrar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AgregarUnidadAdm',
  data() {
    return {
      valido: false,
      enviando: false,
      unidadAdministrativa: {
        nombre: null,
        nombre_corto: null,
        nombre_responsable: null,
        puesto_responsable: null,
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['agregarUnidadAdm']),
    guardar() {
      this.enviando = true;
      this.agregarUnidadAdm(this.unidadAdministrativa).then(() => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        this.unidadAdministrativa.nombre = null;
        this.unidadAdministrativa.nombre_corto = null;
        this.unidadAdministrativa.nombre_responsable = null;
        this.unidadAdministrativa.puesto_responsable = null;

        this.enviando = false;
        this.cerrar();
      })
        .catch((err) => {
          this.enviando = false;
          this.$store.state.settings.generales.respuesta = err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
        });
    },
    cerrar() {
      this.$emit('cerrar');
    },
  },
};
</script>

<style lang="scss">
</style>
