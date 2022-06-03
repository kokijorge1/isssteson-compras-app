<template>
  <div id="contenedor-agregar">
    <v-form v-model="valido">
      <v-card flat>
        <v-toolbar flat color="primary" dark class="headline">
            Nuevo
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
        <v-card-text>
          <v-autocomplete
            v-model="articulo.id_partida"
            :items="partidas"
            :filter="filtroBusquedaPartida"
            label="Partida"
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
            v-model="articulo.cabms"
            label="CABMS"
            hint=""
            persistent-hint>
          </v-text-field>
          <v-text-field
            v-model="articulo.clave_interna"
            label="Clave Médica"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
          <div class="mt-3 px-2 py-2 grey lighten-3">
            <h3 class="title mb-2">Claves Internas</h3>
            <template v-for="(item, index) in articulo.claves_internas">
              <v-layout row wrap :key="`contenedor-${index}`">
                <v-flex xs7 class="pr-3">
                  <v-select
                    v-model="item.id_unidad_administrativa"
                    label="Unidad Administrativa"
                    :items="unidades"
                    item-text="nombre"
                    item-value="id"
                    class="body-1">
                  </v-select>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    v-model="item.clave_interna_unidad"
                    label="Clave">
                  </v-text-field>
                </v-flex>
                <v-flex xs1>
                  <v-btn
                    flat
                    icon
                    color="red lighten-2"
                    @click="removerClave(index)"
                    v-if="index > 0">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </template>
            <v-btn
              @click="agregarClave"
              block
              round
              small
              color="primary">
              Agregar otra clave
            </v-btn>
          </div>
          <v-textarea
            v-model="articulo.nombre"
            label="Nombre"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint
            rows="4">
          </v-textarea>
          <v-layout row wrap>
            <v-flex xs12 md3>
              <v-text-field
                v-model="articulo.unidad"
                label="Unidad Medida"
                :rules="[reglas.requerido]"
                hint="Requerido *"
                persistent-hint>
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-textarea
            v-model="articulo.presentacion"
            label="Presentación">
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
  name: 'Agregar',
  data() {
    return {
      valido: false,
      enviando: false,
      articulo: {
        id_partida: null,
        clave_interna: null,
        cabms: null,
        nombre: null,
        unidad: null,
        presentacion: null,
        claves_internas: [{
          id_unidad_administrativa: '',
          clave_interna_unidad: '',
        }],
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos', ['agregarArticulo']),
    guardar() {
      this.enviando = true;
      this.agregarArticulo(this.articulo).then((data) => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        this.articulo.id_partida = null;
        this.articulo.clave_interna = null;
        this.articulo.cabms = null;
        this.articulo.nombre = null;
        this.articulo.unidad = null;
        this.articulo.presentacion = null;
        this.enviando = false;

        const datos = {
          tipo: 'AGREGAR_ARTICULO',
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
    filtroBusquedaPartida(item, queryText) {
      const nombre = item.nombre.toLowerCase();
      const clave = item.clave.toLowerCase();
      const searchText = queryText.toLowerCase();

      return nombre.indexOf(searchText) > -1
          || clave.indexOf(searchText) > -1;
    },
    cerrar() {
      this.$emit('cerrar');
    },
    agregarClave() {
      this.articulo.claves_internas.push({
        id_unidad_administrativa: '',
        clave_interna_unidad: '',
      });
    },
    removerClave(index) {
      if (this.articulo.claves_internas.length <= 1) return;
      this.articulo.claves_internas.splice(index, 1);
    },
  },
  computed: {
    ...mapGetters({
      partidas: 'settings/catalogos/partidas',
      unidades: 'settings/catalogos/unidadesAdministrativas',
    }),
  },
};
</script>

<style lang="scss">
</style>
