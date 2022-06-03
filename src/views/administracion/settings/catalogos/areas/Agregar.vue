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
          <v-select
            v-model="area.id_unidad_administrativa"
            label="Unidad Administrativa"
            :rules="[reglas.requerido]"
            :items="unidades"
            item-text="nombre"
            item-value="id"
            hint="Requerido *"
            persistent-hint>
          </v-select>
          <v-text-field
            v-model="area.nombre"
            label="Nombre"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model="area.nombre_responsable"
            label="Nombre Responsable">
          </v-text-field>
          <v-textarea
            v-model="area.puesto_responsable"
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
import { mapGetters, mapActions } from 'vuex';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AgregarArea',
  data() {
    return {
      valido: false,
      enviando: false,
      area: {
        id_unidad_administrativa: null,
        nombre: null,
        nombre_responsable: null,
        puesto_responsable: null,
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['agregarArea']),
    guardar() {
      this.enviando = true;
      this.agregarArea(this.area).then(() => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });

        this.area.nombre = null;
        this.area.id_unidad_administrativa = null;

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
      unidades: 'settings/catalogos/unidadesAdministrativas',
    }),
  },
};
</script>

<style lang="scss">
</style>
