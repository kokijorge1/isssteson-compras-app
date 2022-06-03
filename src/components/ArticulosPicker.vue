<template>
  <div id="contenedor-articulos-picker">
      <v-card>
        <v-toolbar flat color="primary" dark class="headline">
          <v-card-title
            primary-title>
              Agregar Artículo
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrar">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
              <v-form v-model="valido">
                  <v-autocomplete
                    v-model="articulo.id_articulo"
                    label="Artículo"
                    solo
                    :items="listadoArticulos"
                    :filter="filtroBusquedaArticulos"
                    item-text="nombre"
                    item-value="id"
                    :rules="[reglas.requerido]"
                    hint="Requerido *"
                    persistent-hint
                    @change="getArticulo">
                    <template slot="item" slot-scope="data">
                        {{ data.item.clave_interna }} -
                        {{ data.item.nombre }}
                        / {{ data.item.unidad }}
                    </template>
                  </v-autocomplete>
                  <v-alert
                    :value="repetido"
                    type="warning">
                    El Artículo seleccionado ya existe en el listado.
                  </v-alert>
                  <v-layout row wrap class="my-4">
                      <v-flex xs12 md3 class="pr-2">
                          <numeric-text-field
                            v-model="articulo.cantidad"
                            label="Cantidad"
                            persistentHint
                            solo>
                        </numeric-text-field>
                      </v-flex>
                      <v-flex xs12 md3 class="pl-2">
                          <numeric-text-field
                            v-model="articulo.precio_referencia"
                            label="Precio Referencia"
                            moneda
                            persistentHint
                            solo>
                        </numeric-text-field>
                      </v-flex>
                  </v-layout>
                  <v-textarea
                    v-model="articulo.caracteristicas"
                    label="Caracteristicas"
                    :decimales="4"
                    solo>
                  </v-textarea>
              </v-form>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="!camposRequeridos"
                @click.prevent="enviarAgregar">
                  Agregar
              </v-btn>
              <v-btn flat @click="cerrar">
                  Cerrar
              </v-btn>
          </v-card-actions>
      </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NumericTextField from '@/components/NumericTextField.vue';

export default {
  name: 'ArticulosPicker',
  components: {
    NumericTextField,
  },
  props: {
    partida: {
      type: Number,
      required: false,
    },
    articulosExistentes: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      repetido: false,
      valido: false,
      articulo: {
        id_articulo: null,
        nombre: null,
        clave_interna: null,
        cantidad: 0,
        precio_referencia: 0,
        unidad: null,
        caracteristicas: null,
        presentacion: null,
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
    };
  },
  methods: {
    enviarAgregar() {
      this.$emit('articulo', ({
        id_articulo: this.articulo.id_articulo,
        nombre: this.articulo.nombre,
        clave_interna: this.articulo.clave_interna,
        cantidad: this.articulo.cantidad,
        precio_referencia: this.articulo.precio_referencia,
        unidad: this.articulo.unidad,
        caracteristicas: this.articulo.caracteristicas,
        presentacion: this.articulo.presentacion,
      }));

      this.repetido = false;
      this.articulo.id_articulo = null;
      this.articulo.nombre = null;
      this.articulo.clave_interna = null;
      this.articulo.cantidad = 0;
      this.articulo.precio_referencia = 0;
      this.articulo.caracteristicas = null;
      this.articulo.presentacion = null;
    },
    getArticulo() {
      const articulo = this.articuloById(this.articulo.id_articulo);
      this.repetido = this.articulosExiste(this.articulo.id_articulo);
      this.articulo.nombre = articulo.nombre;
      this.articulo.clave_interna = articulo.clave_interna;
      this.articulo.unidad = articulo.unidad;
      this.articulo.presentacion = articulo.presentacion;
    },
    articulosExiste(idArticulo) {
      if (!this.articulosExistentes) return false;
      if (!this.articulosExistentes
        .find(item => item.id === idArticulo)) return false;

      return true;
    },
    filtroBusquedaArticulos(item, queryText) {
      const clave = item.clave_interna !== null
        ? item.clave_interna.toLowerCase()
        : '';
      const cabms = item.cabms
        ? item.cabms.toLowerCase()
        : '';
      const nombre = item.nombre
        ? item.nombre.toLowerCase()
        : '';
      const clavesConcatenadas = item.claves_internas_concatenadas
        ? item.claves_internas_concatenadas.toLowerCase()
        : '';
      const searchText = queryText.toLowerCase();

      return nombre.indexOf(searchText) > -1
          || clave.indexOf(searchText) > -1
          || cabms.indexOf(searchText) > -1
          || clavesConcatenadas.indexOf(searchText) > -1;
    },
    cerrar() {
      this.$emit('cerrar');
    },
  },
  computed: {
    ...mapGetters({
      articuloById: 'settings/catalogos/articulo',
      articulosByPartida: 'settings/catalogos/articulosByPartida',
    }),
    listadoArticulos() {
      return this.articulosByPartida(this.partida);
    },
    camposRequeridos() {
      if (this.valido && this.articulo.cantidad > 0) return true;
      return false;
    },
  },
};
</script>

<style lang="scss">
</style>
