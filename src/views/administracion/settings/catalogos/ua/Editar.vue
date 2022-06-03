<template>
  <div id="contenedor-editar">
    <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
            Editar
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
            @click.prevent="actulizar"
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
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'Editar',
  props: {
    id: {
      type: Number,
    },
  },
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
    ...mapActions('settings/catalogos', ['actulizarUnidadAdm']),
    actulizar() {
      this.enviando = true;
      this.actulizarUnidadAdm({
        id: this.id,
        unidadAdministrativa: this.unidadAdministrativa,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
          this.cerrar();
        })
        .catch((err) => {
          this.enviando = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    cerrar() {
      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      unidadAdm: 'settings/catalogos/unidad',
    }),
    getUnidad() {
      return this.unidadAdm(this.id);
    },
  },
  watch: {
    id: {
      handler(value) {
        if (!value) return;
        this.unidadAdministrativa.nombre = this.getUnidad.nombre;
        this.unidadAdministrativa.nombre_corto = this.getUnidad.nombre_corto;
        this.unidadAdministrativa.nombre_responsable = this.getUnidad.nombre_responsable;
        this.unidadAdministrativa.puesto_responsable = this.getUnidad.puesto_responsable;
      },
    },
  },
};
</script>

<style lang="scss">
</style>
