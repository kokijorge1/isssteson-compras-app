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
            label="Clave Interna"
            :rules="[reglas.requerido]"
            hint="Requerido *"
            persistent-hint>
          </v-text-field>
          <div class="mt-3 px-2 py-2 grey lighten-3">
            <h3 class="title mb-2">Claves Internas</h3>
            <template v-for="(item, index) in articulo.claves_unidades">
              <v-layout align-start justify-start row wrap :key="`contenedor-${index}`">
                <v-flex xs7>
                  {{ item.unidad_administrativa.nombre }}
                </v-flex>
                <v-flex xs4>
                  {{ item.clave_interna_unidad }}
                </v-flex>
                <v-flex xs1 class="justify-center layout px-0">
                  <v-btn
                    @click="removerClave(item)"
                    flat
                    icon
                    color="red lighten-2">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-divider
                class="mb-2"
                :key="`divider-${index}`"
                v-if="(index + 1) !== articulo.claves_unidades.length">
              </v-divider>
            </template>
            <v-layout row wrap v-if="mostrarFormularioClaves">
              <v-flex xs7 class="pr-3">
                <v-select
                  v-model="articuloClaveUnidad.id_unidad_administrativa"
                  label="Unidad Administrativa"
                  :items="unidades"
                  item-text="nombre"
                  item-value="id"
                  class="body-1">
                </v-select>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  v-model="articuloClaveUnidad.clave_interna_unidad"
                  label="Clave">
                </v-text-field>
              </v-flex>
              <div>
                <v-btn
                  @click.prevent="agregarNuevaClave"
                  color="primary"
                  :loading="enviadoClaves"
                  :disabled="articuloClaveUnidad.id_unidad_administrativa === ''
                  || articuloClaveUnidad.clave_interna_unidad === ''">
                  Guardar
                </v-btn>
                <v-btn
                  @click="mostrarFormularioClaves = !mostrarFormularioClaves"
                  flat>
                  Cancelar
                </v-btn>
              </div>
            </v-layout>
            <v-btn
              @click="mostrarFormularioClaves = !mostrarFormularioClaves"
              block
              round
              small
              color="primary"
              v-if="articulo.claves_unidades && !mostrarFormularioClaves">
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
      enviadoClaves: false,
      mostrarFormularioClaves: false,
      articulo: {
        id_partida: null,
        clave_interna: null,
        cabms: null,
        nombre: null,
        unidad: null,
        presentacion: null,
        claves_unidades: [],
      },
      articuloClaveUnidad: {
        id_articulo: null,
        id_unidad_administrativa: null,
        clave_interna_unidad: '',
      },
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
    };
  },
  methods: {
    ...mapActions('settings/catalogos',
      [
        'actulizarArticulo',
        'agregarClaveUnidadArticulo',
        'borrarClaveUnidadArticulo',
      ]),
    actulizar() {
      this.enviando = true;
      this.actulizarArticulo({
        id: this.id,
        articulo: this.articulo,
      })
        .then((data) => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;

          const datos = {
            tipo: 'ACTUALIZAR_ARTICULO',
            data,
          };

          this.$socket.emit('afectacionCatalogoGlobal', datos);

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
    agregarNuevaClave() {
      this.enviadoClaves = true;
      this.agregarClaveUnidadArticulo(this.articuloClaveUnidad).then((data) => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        this.enviadoClaves = false;

        const datos = {
          tipo: 'ACTUALIZAR_ARTICULO',
          data,
        };

        this.articulo.claves_unidades = data.claves_unidades;

        this.articuloClaveUnidad.id_unidad_administrativa = null;
        this.articuloClaveUnidad.clave_interna_unidad = '';

        this.mostrarFormularioClaves = false;

        this.$socket.emit('afectacionCatalogoGlobal', datos);
      })
        .catch((err) => {
          this.enviadoClaves = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    removerClave(item) {
      this.borrarClaveUnidadArticulo(item).then((data) => {
        const respuesta = new Mensajes(null).success;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });

        const datos = {
          tipo: 'ACTUALIZAR_ARTICULO',
          data,
        };

        this.articulo.claves_unidades = data.claves_unidades;

        this.$socket.emit('afectacionCatalogoGlobal', datos);
      })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
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
  },
  computed: {
    ...mapGetters({
      articuloId: 'settings/catalogos/articulo',
      partidas: 'settings/catalogos/partidas',
      unidades: 'settings/catalogos/unidadesAdministrativas',
    }),
    getArticulo() {
      return this.articuloId(this.id);
    },
  },
  watch: {
    id: {
      handler(value) {
        if (!value) return;
        this.articulo.id_partida = this.getArticulo.partida.id;
        this.articulo.clave_interna = this.getArticulo.clave_interna;
        this.articulo.cabms = this.getArticulo.cabms;
        this.articulo.nombre = this.getArticulo.nombre;
        this.articulo.unidad = this.getArticulo.unidad;
        this.articulo.presentacion = this.getArticulo.presentacion;
        this.articulo.claves_unidades = this.getArticulo.claves_unidades;
        this.articuloClaveUnidad.id_articulo = this.id;
      },
    },
  },
};
</script>

<style lang="scss">
</style>
