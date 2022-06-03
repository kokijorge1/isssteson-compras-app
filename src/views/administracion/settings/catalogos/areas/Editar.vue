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
            hint="Campo requerido"
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
    ...mapActions('settings/catalogos', ['actulizarArea']),
    actulizar() {
      this.enviando = true;
      this.actulizarArea({
        id: this.id,
        area: this.area,
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
      areaId: 'settings/catalogos/area',
      unidades: 'settings/catalogos/unidadesAdministrativas',
    }),
    getArea() {
      return this.areaId(this.id);
    },
  },
  watch: {
    id: {
      handler(value) {
        if (!value) return;
        this.area.id_unidad_administrativa = this.getArea.unidad_administrativa.id;
        this.area.nombre = this.getArea.nombre;
        this.area.nombre_responsable = this.getArea.nombre_responsable;
        this.area.puesto_responsable = this.getArea.puesto_responsable;
      },
    },
  },
};
</script>

<style lang="scss">
</style>
