<template>
  <div id="contenedor-agregar-adquisicion">
    <v-toolbar flat color="transparent">
      <page-title titulo="Nueva Compra"></page-title>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-form ref="form" v-model="valido" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 md12 class="p-xs-r-15">
              <v-layout row wrap justify-space-between>
                <v-flex
                  xs12
                  md6>
                  <v-radio-group
                    v-model="adquisicion.tipo"
                    row
                    :rules="[reglas.requerido]">
                    <v-radio
                      v-for="t in getTipos"
                      :key="t.id"
                      :label="t.texto"
                      :value="t.id">
                    </v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex
                  xs12
                  md2>
                  <v-switch
                    v-model="adquisicion.publicar"
                    label="Publicar"
                    color="primary">
                  </v-switch>
                </v-flex>
              </v-layout>
              <v-divider class="mb-4"></v-divider>
              <v-layout row wrap>
                <v-flex xs12 md4
                  class="p-xs-r-15"
                  v-if="adquisicion.tipo == 'IR' || adquisicion.tipo == 'LP'">
                  <v-text-field
                    v-model="adquisicion.numero"
                    label="Número"
                    :rules="[reglas.requerido]"
                    hint="Requerido *"
                    persistent-hint
                    solo
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 md3>
                  <date-picker
                    v-model="adquisicion.fecha"
                    label="Fecha"
                    actual
                    :rules="[reglas.requerido]"
                    persistent
                    hint="Fecha"
                  ></date-picker>
                </v-flex>
              </v-layout>
              <v-layout row wrap class="mt-4">
                <v-flex xs12 md3 class="p-xs-r-15">
                  <date-picker
                    v-model="adquisicion.fecha_inicio"
                    :value="adquisicion.fecha_inicio"
                    label="Inicio"
                    persistent
                    hint="Fecha Inicio"
                  ></date-picker>
                </v-flex>
                <v-flex xs12 md3 class="p-xs-r-15">
                  <time-picker-custom
                    v-model="horaInicio"
                    label="Inicio"
                    persistent
                    hint="Hora Inicio">
                  </time-picker-custom>
                </v-flex>
                <v-flex xs12 md3 class="p-xs-r-15">
                  <date-picker
                    v-model="adquisicion.fecha_termino"
                    label="Término"
                    persistent
                    hint="Fecha Término">
                  </date-picker>
                </v-flex>
                <v-flex xs12 md3>
                  <time-picker-custom
                    v-model="horaTermino"
                    label="Término"
                    persistent
                    hint="Hora Término">
                  </time-picker-custom>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-textarea
                    v-model="adquisicion.nombre"
                    label="Nombre/Descripción"
                    :rules="[reglas.requerido]"
                    rows="3"
                    solo
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-divider class="mb-4"></v-divider>
          <v-layout row wrap class="mt-4 mb-4">
            <v-flex xs12>
              <v-toolbar color="colorText" dense dark>
                <v-toolbar-title>
                  Requisiciones
                  <v-chip
                    small
                    dark
                    outline
                    color="secondary"
                    text-color="white">
                    {{requisiciones.length }}
                  </v-chip>
                </v-toolbar-title>
                <v-layout
                  row
                  wrap>
                  <v-flex
                    md3
                    class="ml-4">
                    <v-text-field
                      v-model="buscarTextRequisicion"
                      placeholder="Buscar..."
                      solo-inverted
                      hide-details
                      clearable
                      append-icon="search">
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-toolbar>
              <div
                class="altura-requisiciones-listado">
                <v-data-table
                  v-model="requisicionesSelected"
                  :items="requisiciones"
                  :headers="requisicionesHeaders"
                  item-key="id"
                  select-all
                  hide-actions
                >
                  <template v-slot:items="props">
                    <tr :active="props.selected">
                      <td style="position: relative;">
                        <div class="contenedor-dot">
                          <div
                            class="dot"
                            :style="`background-color: ${props.item.color}`">
                          </div>
                        </div>
                        <v-checkbox
                          v-model="props.selected"
                          primary
                          hide-details>
                        </v-checkbox>
                      </td>
                      <td>{{ props.item.numero }}</td>
                      <td>{{ props.item.partida.nombre }}</td>
                      <td>{{ props.item.justificacion }}</td>
                      <td>{{ props.item.observaciones }}</td>
                    </tr>
                  </template>
                </v-data-table>
              </div>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 md12>
              <v-toolbar color="colorText" dense dark>
                <v-badge color="secondary">
                  <template v-slot:badge>
                    <span>{{ adquisicion.articulos.length }}</span>
                  </template>
                  <v-toolbar-title>Articulos</v-toolbar-title>
                </v-badge>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchTextArticulos"
                  placeholder="Buscar..."
                  solo-inverted
                  prepend-inner-icon="search"
                  append-outer-icon="close"
                  clearable
                  autofocus
                  v-show="mostrarBuscadorArticulos"
                  @click:append-outer="mostrarBuscadorArticulos = !mostrarBuscadorArticulos">
                </v-text-field>
                <v-btn
                  icon
                  dark
                  @click="mostrarBuscadorArticulos = !mostrarBuscadorArticulos"
                  v-show="!mostrarBuscadorArticulos">
                  <v-icon>search</v-icon>
                </v-btn>
                <v-tooltip top>
                  <v-btn
                    slot="activator"
                    icon
                    dark
                    @click="showArticuloPicker = !showArticuloPicker"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                  <span>Artículo</span>
                </v-tooltip>
              </v-toolbar>
              <v-data-table
                :items="listadoArticulos"
                :headers="articulosHeaders"
                hide-actions>
                <template v-slot:items="props">
                  <tr>
                    <td>
                      <div
                        class="dot"
                        :style="`background-color: ${props.item.color}`">
                      </div>
                    </td>
                    <td>
                      <strong>{{ props.item.articulo.clave_interna }}</strong>
                    </td>
                    <td>{{ props.item.articulo.nombre }}</td>
                    <td>
                      <numeric-text-field
                        v-model="props.item.cantidad"
                        label="Cantidad" solo>
                      </numeric-text-field>
                    </td>
                    <td>{{ props.item.articulo.unidad }}</td>
                    <td>
                      {{ props.item.articulo.presentacion }}
                    </td>
                    <td>{{ props.item.precio_referencia | currency }}</td>
                    <td>
                      <v-textarea
                        v-model="props.item.caracteristicas"
                        solo
                        auto-grow
                        rows="3"
                        class="mt-2"
                        style="font-size:12px;"
                      ></v-textarea>
                    </td>
                    <td class="text-xs-right px-0">
                      <v-tooltip top>
                        <v-btn
                          icon
                          slot="activator"
                          color="error"
                          small
                          @click="removerArticulo(props.index, props.item.identificador)"
                        >
                          <v-icon>remove</v-icon>
                        </v-btn>
                        <span>Remover Artículo</span>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-divider class="my-3"></v-divider>
      <v-card-actions class="pb-4">
        <v-btn
          color="primary"
          :loading="enviando"
          :disabled="!validarForm"
          @click.prevent="agregar">
          <v-icon dark left>done</v-icon>Guardar
        </v-btn>
        <v-btn flat :to="{ name: 'adquisiciones' }">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="showArticuloPicker" persistent max-width="600px">
      <articulos-picker
        @articulo="agregarArticulo"
        v-on:cerrar="cerrarDialog">
      </articulos-picker>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import DatePicker from '@/components/DatePicker.vue';
import TimePickerCustom from '@/components/TimePickerCustom.vue';
import ArticulosPicker from '@/components/ArticulosPicker.vue';
import NumericTextField from '@/components/NumericTextField.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'AgregarAdquisicion',
  components: {
    PageTitle,
    DatePicker,
    TimePickerCustom,
    ArticulosPicker,
    NumericTextField,
  },
  data() {
    return {
      valido: false,
      enviando: false,
      showArticuloPicker: false,
      requisicionesSelected: [],
      searchTextArticulos: '',
      mostrarBuscadorArticulos: false,
      buscarTextRequisicion: null,
      horaInicio: this.$moment().format('HH:mm'),
      horaTermino: '',
      adquisicion: {
        tipo: 'AD',
        publicar: true,
        numero: null,
        nombre: null,
        fecha: '',
        fecha_inicio: this.$moment().format('YYYY-MM-DD'),
        fecha_termino: '',
        requisiciones: [],
        articulos: [],
      },
      articulosSinRequisicion: [],
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
        fechasEventosMayores: () => {
          if (
            this.adquisicion.fecha_inicio
            && this.adquisicion.fecha_termino
            && new Date(this.adquisicion.fecha_termino)
              > new Date(this.adquisicion.fecha_inicio)
          ) {
            return true;
          }
          return 'La Fecha de Termino debe de ser mayor a la fecha de Inicio.';
        },
      },
      requisicionesHeaders: [
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Partida', sortable: true, value: 'partida.id' },
        { text: 'Justificación', sortable: false, value: '' },
        { text: 'Observaciones', sortable: false, value: '' },
      ],
      articulosHeaders: [
        { text: '', sortable: false, value: '' },
        { text: 'Clave', sortable: true, value: 'clave_interna' },
        { text: 'Descripción', sortable: false, value: '' },
        { text: 'Cantidad', sortable: true, value: 'cantidad' },
        { text: 'Unidad M.', sortable: false, value: 'unidad' },
        { text: 'Presentación', sortable: false, value: 'presentacion' },
        {
          text: 'Precio Referencia',
          sortable: true,
          value: 'precio_referencia',
          align: 'left',
        },
        { text: 'Caracteristicas', sortable: false, value: '' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  methods: {
    ...mapActions('adquisiciones', ['agregarAdquisicion']),
    agregar() {
      if (this.adquisicionDatosFormato().articulos.length <= 0) {
        const respuesta = new Mensajes('Debe agregar por lo menos un Artículo')
          .warning;
        this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
          respuesta,
        });
        return;
      }
      this.enviando = true;
      this.agregarAdquisicion(this.adquisicionDatosFormato())
        .then((res) => {
          this.$socket.emit('nuevaAdquisicion', res);
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.$router.push({ name: 'adquisiciones' });
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
    agregarArticulo(articulo) {
      const nuevoArticulo = {
        id: articulo.id_articulo,
        identificador: new Date().getTime(),
        cantidad: articulo.cantidad,
        caracteristicas: articulo.caracteristicas,
        precio_referencia: articulo.precio_referencia,
        articulo: {
          id: articulo.id_articulo,
          nombre: articulo.nombre,
          clave_interna: articulo.clave_interna,
          unidad: articulo.unidad,
          presentacion: articulo.presentacion,
        },
      };

      this.articulosSinRequisicion.push(nuevoArticulo);
      this.adquisicion.articulos.push(nuevoArticulo);
    },
    removerArticulo(index, identificador) {
      this.adquisicion.articulos.splice(index, 1);
      if (identificador) {
        const indexArticuloSinRequisicion = this.articulosSinRequisicion.findIndex(
          item => item.identificador === identificador,
        );
        this.articulosSinRequisicion.splice(indexArticuloSinRequisicion, 1);
      }
    },
    adquisicionDatosFormato() {
      const fechaInicio = this.adquisicion.fecha_inicio
        ? `${this.adquisicion.fecha_inicio} ${this.horaInicio || '00:00'}`
        : '';
      const fechaTermino = this.adquisicion.fecha_termino
        ? `${this.adquisicion.fecha_termino} ${this.horaTermino || '00:00'}`
        : '';

      return {
        tipo: this.adquisicion.tipo,
        numero: this.adquisicion.numero,
        nombre: this.adquisicion.nombre,
        fecha: this.adquisicion.fecha,
        fecha_inicio: fechaInicio,
        fecha_termino: fechaTermino,
        requisiciones: this.requisicionesSelected.map(item => ({
          id_requisicion: item.id,
        })),
        articulos: this.adquisicion.articulos.map(item => ({
          id_articulo: item.articulo.id,
          cantidad: item.cantidad,
          caracteristicas: item.caracteristicas,
          precio_referencia: item.precio_referencia,
        })),
      };
    },
    validar() {
      return this.$refs.form.validate();
    },
    cerrarDialog() {
      this.showArticuloPicker = false;
    },
  },
  computed: {
    ...mapGetters({
      tipos: 'adquisiciones/tipos',
      requisicionesAutorizadas: 'requisiciones/autorizadas',
    }),
    getTipos() {
      return this.tipos.filter(item => item.id !== '');
    },
    requisiciones() {
      return this.requisicionesAutorizadas.map((item) => {
        const requisicion = item;
        requisicion.color = this.$randomColor();
        return requisicion;
      })
        .filter((requisicion) => {
          if (!this.buscarTextRequisicion) return true;
          const expt = new RegExp(this.buscarTextRequisicion, 'gi');
          return expt.test(requisicion.numero)
          || expt.test(requisicion.nombre)
          || expt.test(requisicion.justificacion)
          || expt.test(requisicion.observaciones);
        });
    },
    listadoArticulos() {
      return this.adquisicion.articulos.filter((item) => {
        if (!this.searchTextArticulos) return item;
        const expt = new RegExp(this.searchTextArticulos, 'gi');
        return (
          expt.test(item.articulo.clave_interna)
          || expt.test(item.articulo.nombre)
          || expt.test(item.caracteristicas)
        );
      });
    },
    validarForm() {
      return this.valido && this.adquisicion.articulos.length > 0;
    },
  },
  watch: {
    requisicionesSelected: {
      handler(selectedRequisiciones) {
        this.adquisicion.articulos = [];
        this.adquisicion.articulos.push(...this.articulosSinRequisicion);

        if (selectedRequisiciones.length <= 0) return;

        selectedRequisiciones.forEach((requisicion) => {
          if (requisicion.articulos.length > 0) {
            requisicion.articulos.forEach((articulo) => {
              const nuevoArticulo = {
                ...articulo,
                color: requisicion.color,
                id_requisicion: requisicion.id,
              };
              this.adquisicion.articulos.push(nuevoArticulo);
            });
          }
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.altura-requisiciones-listado {
  position: relative;
  height: 40vh;
  overflow: auto;
}
.min-heigth {
  min-height: 400px;
}
.contenedor-dot {
  position: absolute;
  left: 0px;
}
.dot {
  margin-top: 4px;
  height: 17px;
  width: 17px;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
}
</style>
