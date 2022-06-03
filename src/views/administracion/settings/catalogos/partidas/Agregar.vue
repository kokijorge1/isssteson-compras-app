<template>
  <div id="contenedor-agregar-partida">
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
          <v-autocomplete
            v-model="partida.id_partida_generica"
            :items="partidasGenericas"
            :filter="filtroBusquedaPartidaGenerica"
            label="Partida Generica"
            item-text="nombre"
            item-value="id"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
            <template slot="item" slot-scope="data">
              {{ data.item.clave }} - {{ data.item.nombre }}
            </template>
          </v-autocomplete>
          <v-text-field
            v-model="partida.clave"
            label="Clave"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model="partida.nombre"
            label="Nombre"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model.number="partida.porcentaje_iva_propuesto"
            type="number"
            label="% de I.V.A Propuesto"
            placeholder="16"
            :rules="[reglas.numerico]"
            hint=""
            persistent-hint
            @keypress="soloNumeros">
          </v-text-field>
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
  name: 'AgregarPartida',
  data() {
    return {
      valido: false,
      enviando: false,
      partida: {
        id_partida_generica: null,
        clave: null,
        nombre: null,
        porcentaje_iva_propuesto: '',
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        numerico: (v) => {
          const isNum = num => /^-?\d+$/.test(num) || /^-?\d+\.\d+$/.test(num);
          return isNum(v) || 'El valor debe de ser Númerico.';
        },
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['agregarPartida']),
    guardar() {
      this.enviando = true;
      this.agregarPartida(this.partida).then((data) => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        this.partida.id_partida_generica = null;
        this.partida.nombre = null;
        this.partida.clave = null;
        this.porcentaje_iva_propuesto = '';
        this.enviando = false;

        const datos = {
          tipo: 'AGREGAR_PARTIDA',
          data,
        };

        this.$socket.emit('afectacionCatalogoGlobal', datos);

        this.cerrar();
      })
        .catch((err) => {
          this.enviando = false;
          this.$store.state.settings.generales.respuesta = err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
        });
    },
    filtroBusquedaPartidaGenerica(item, queryText) {
      const nombre = item.clave.toLowerCase();
      const clave = item.nombre.toLowerCase();
      const searchText = queryText.toLowerCase();

      return nombre.indexOf(searchText) > -1
          || clave.indexOf(searchText) > -1;
    },
    cerrar() {
      this.$emit('cerrar');
    },
    soloNumeros(evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode;
      if (charCode !== 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) { evt.preventDefault(); }

      if (charCode === 46) {
        if (evt.target.value.toString().includes('.')) {
          evt.preventDefault();
        }
      }

      return true;
    },
  },
  computed: {
    ...mapGetters({
      partidasGenericas: 'settings/catalogos/partidasGenericas',
    }),
  },
};
</script>

<style lang="scss">
</style>
