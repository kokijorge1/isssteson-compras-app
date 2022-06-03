<template>
  <div id="contenedor-editar-requisicion">
    <v-toolbar flat color="transparent">
      <page-title
        :titulo="requisicion.numero"
        subtitulo="Requisición">
      </page-title>
    </v-toolbar>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-form v-model="valido">
          <v-layout row wrap>
            <v-flex xs12 md3>
              <template v-if="editarItem !== 'fecha'">
                <h1 class="subheading">
                  <strong>Fecha Requerida</strong>
                  <v-tooltip right class="pl-1">
                    <v-icon
                      slot="activator"
                      small
                      @click="editarItem = 'fecha'"
                      v-if="requisicionData.estatus === 0">
                      edit
                    </v-icon>
                    <span>Editar</span>
                  </v-tooltip>
                </h1>
                <p>
                  {{ requisicion.fecha_requerida }}
                </p>
              </template>
              <template v-if="editarItem === 'fecha'">
                <date-picker
                  v-model="requisicion.fecha_requerida"
                  label="Fecha"
                  hint="Fecha en la que se requieren los articulos."
                  persistent>
                </date-picker>
                <v-btn
                  color="primary"
                  :disabled="!requisicion.fecha_requerida"
                  @click="editar">
                  <v-icon dark left>done</v-icon>
                  Guardar
                </v-btn>
                <v-btn flat @click="editarItem = null">
                  cancelar
                </v-btn>
              </template>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mt-4">
            <v-flex xs12 md6 class="pr-3">
              <template v-if="!isEditar">
                <h1 class="subheading">
                  <strong>Unidad Administrativa</strong>
                  <v-tooltip right class="pl-1">
                    <v-icon
                      slot="activator"
                      small
                      @click="isEditar = !isEditar"
                      v-if="requisicionData.estatus === 0">
                      edit
                    </v-icon>
                    <span>Editar</span>
                  </v-tooltip>
                </h1>
                <p>
                  {{ requisicionData.area.unidad_administrativa.nombre }}
                </p>
              </template>
              <template v-else>
                <v-select
                  v-model="id_unidad_administrativa"
                  label="Unidad Administrativa"
                  :items="unidades"
                  :rules="[reglas.requerido]"
                  item-text="nombre"
                  item-value="id"
                  hint="Requerido *"
                  persistent-hint
                  @change="requisicion.id_area = null"
                  solo>
                </v-select>
              </template>
            </v-flex>
            <v-flex xs12 md6>
              <template v-if="!isEditar">
                <h1 class="subheading">
                  <strong>Area</strong>
                  <v-tooltip right class="pl-1">
                    <v-icon
                      slot="activator"
                      small
                      @click="isEditar = !isEditar"
                      v-if="requisicionData.estatus === 0">
                      edit
                    </v-icon>
                    <span>Editar</span>
                  </v-tooltip>
                </h1>
                <p>
                  {{ requisicionData.area.nombre }}
                </p>
              </template>
              <template v-else>
                <v-select
                  v-model="requisicion.id_area"
                  label="Area"
                  :items="listadoAreas"
                  :rules="[reglas.requerido]"
                  item-text="nombre"
                  item-value="id"
                  hint="Requerido *"
                  persistent-hint
                  solo>
                </v-select>
              </template>
            </v-flex>
            <v-flex
              xs12
              v-if="isEditar"
              class="mt-3">
              <v-btn
                color="primary"
                @click="editar"
                :disabled="!valido">
                <v-icon dark left>done</v-icon>
                Guardar
              </v-btn>
              <v-btn
                flat
                @click="isEditar = !isEditar">
                cancelar
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mt-4">
            <v-flex xs12 md6 class="pr-3">
              <template v-if="editarItem !== 'justificacion'">
                <h1 class="subheading">
                  <strong>Justificación</strong>
                  <v-tooltip right class="pl-1">
                    <v-icon
                      slot="activator"
                      small
                      @click="editarItem = 'justificacion'"
                      v-if="requisicionData.estatus === 0">
                      edit
                    </v-icon>
                    <span>Editar</span>
                  </v-tooltip>
                </h1>
                <p>
                  {{ requisicion.justificacion }}
                </p>
              </template>
              <template v-if="editarItem === 'justificacion'">
                <v-textarea
                  v-model="requisicion.justificacion"
                  :rules="[reglas.requerido]"
                  label="Justificación"
                  hint="Requerido *"
                  persistent-hint
                  solo>
                </v-textarea>
                <v-btn
                  color="primary"
                  :disabled="!valido"
                  @click="editar">
                  <v-icon dark left>done</v-icon>
                  Guardar
                </v-btn>
                <v-btn flat @click="editarItem = null">
                  Cancelar
                </v-btn>
              </template>
            </v-flex>
            <v-flex xs12 md6>
              <template v-if="editarItem !== 'observaciones'">
                <h1 class="subheading">
                  <strong>Observaciones</strong>
                  <v-tooltip right class="pl-1">
                    <v-icon
                      slot="activator"
                      small
                      @click="editarItem = 'observaciones'"
                      v-if="requisicionData.estatus === 0">
                      edit
                    </v-icon>
                    <span>Editar</span>
                  </v-tooltip>
                </h1>
                <p>
                  {{ requisicion.observaciones }}
                </p>
              </template>
              <template v-if="editarItem === 'observaciones'">
                <v-textarea
                  v-model="requisicion.observaciones"
                  label="Observaciones"
                  solo>
                </v-textarea>
                <v-btn
                  color="primary"
                  @click="editar"
                  :disabled="requisicion.observaciones.length <= 0">
                  <v-icon dark left>done</v-icon>
                  Guardar
                </v-btn>
                <v-btn flat @click="editarItem = null">
                  Cancelar
                </v-btn>
              </template>
            </v-flex>
          </v-layout>
          <v-divider class="mt-3 mb-3"></v-divider>
          <v-card flat>
            <v-card-title>
              <v-badge  color="info">
                <span slot="badge">
                  {{ articulos.length }}
                </span>
                <span>
                  <h1 class="tittle font-weight-thin">
                    Articulos
                  </h1>
                </span>
              </v-badge>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="listado"
                hide-actions>
                <template slot="items" slot-scope="props">
                  <td>
                    {{ (props.index + 1) }}
                  </td>
                  <td>
                    {{
                      props.item.articulo.clave_interna !== null
                      ? props.item.articulo.clave_interna
                      : 'S/C'
                    }}
                  </td>
                  <td>
                    {{ props.item.articulo.nombre }}
                  </td>
                  <td>
                    {{ props.item.cantidad }}
                  </td>
                  <td>
                    {{ props.item.articulo.unidad }}
                  </td>
                  <td>
                    {{ props.item.articulo.presentacion }}
                  </td>
                  <td>
                    {{ props.item.caracteristicas }}
                  </td>
                  <td class="text-xs-right">
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        fab
                        small
                        dark
                        color="red"
                        @click="preRemoverArticulo(props.item.id)"
                        v-if="requisicionData.estatus === 0">
                        <v-icon>remove</v-icon>
                      </v-btn>
                      <span>Remover</span>
                    </v-tooltip>
                  </td>
                </template>
                <template slot="no-data">
                  <v-btn
                    block
                    round
                    dark
                    color="primary"
                    @click="showArticuloPicker = !showArticuloPicker"
                    v-if="requisicionData.estatus === 0">
                    <v-icon>add</v-icon>
                    agregar articulo(s)
                  </v-btn>
                </template>
                <template slot="footer">
                  <tr>
                    <td colspan="8">
                      <v-btn
                        block
                        round
                        dark
                        color="primary"
                        @click="showArticuloPicker = !showArticuloPicker"
                        v-if="requisicionData.estatus === 0">
                        <v-icon>add</v-icon>
                        agregar articulo(s)
                      </v-btn>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>
    </v-card>
    <v-dialog
      v-model="showArticuloPicker"
      persistent
      max-width="700px">
      <articulos-picker
        @articulo="agregarArticulo"
        v-on:cerrar="cerrarDialog"
        :partida="requisicion.id_partida">
      </articulos-picker>
    </v-dialog>
    <v-dialog v-model="dialogAutorizar" persistent max-width="290">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Confirmación
        </v-card-title>
        <v-card-text>
          ¿Seguro que desea remover este Articulo?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="removerArticulo" :loading="enviando">
            <v-icon dark left>done</v-icon>
            Autorizar
          </v-btn>
          <v-btn flat color="error" @click="dialogAutorizar = !dialogAutorizar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ArticulosPicker from '@/components/ArticulosPicker.vue';
import DatePicker from '@/components/DatePicker.vue';
import PageTitle from '@/components/PageTitle.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'EditarRequisiciones',
  components: {
    PageTitle,
    ArticulosPicker,
    DatePicker,
  },
  data() {
    return {
      dialogAutorizar: false,
      editarItem: null,
      valido: false,
      enviando: false,
      isEditar: false,
      id_unidad_administrativa: null,
      showArticuloPicker: false,
      idArticulosRemover: null,
      requisicion: {
        id_area: null,
        id_partida: null,
        numero: '',
        fecha_requerida: '',
        justificacion: '',
        observaciones: '',
      },
      articulos: [],
      reglas: {
        requerido: v => !!v || 'Campo Requerido.',
      },
      headers: [
        { text: '#', sortable: false, value: '' },
        { text: 'Clave', sortable: true, value: 'clave_interna' },
        { text: 'Descripción', sortable: false, value: '' },
        { text: 'Cantidad', sortable: true, value: 'cantidad' },
        { text: 'Unidad M.', sortable: false, value: 'unidad' },
        { text: 'Presentación', sortable: false, value: 'presentacion' },
        { text: 'Caracteristicas', sortable: false, value: '' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  mounted() {
    const {
      area, numero, fecha_requerida: fechaRequerida, justificacion,
      observaciones, articulos, partida,
    } = this.requisicionData;
    this.id_unidad_administrativa = area.unidad_administrativa.id;
    this.requisicion.id_area = area.id;
    this.requisicion.id_partida = partida.id;
    this.requisicion.numero = numero;
    this.requisicion.fecha_requerida = this.$moment(fechaRequerida).format('YYYY-MM-DD');
    this.requisicion.justificacion = justificacion || '';
    this.requisicion.observaciones = observaciones || '';
    this.articulos = articulos;
  },
  methods: {
    ...mapActions(
      'requisiciones',
      [
        'agregarArticuloRequisicion',
        'borrarArticuloRequisicion',
        'actulizarRequisicion',
      ],
    ),
    editar() {
      this.isEditar = false;
      this.editarItem = null;

      this.actulizarRequisicion({
        id: this.$route.params.id,
        requisicion: this.requisicion,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    agregarArticulo(articulo) {
      const nuevoArticulo = articulo;

      delete nuevoArticulo.clave_interna;
      delete nuevoArticulo.nombre;
      delete nuevoArticulo.unidad;
      delete nuevoArticulo.presentacion;

      this.agregarArticuloRequisicion({
        requisicion: this.$route.params.id,
        articulo: nuevoArticulo,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    preRemoverArticulo(id) {
      this.idArticulosRemover = id;
      this.dialogAutorizar = true;
    },
    removerArticulo() {
      if (!this.idArticulosRemover) return;

      this.enviando = true;
      this.borrarArticuloRequisicion({
        id: this.idArticulosRemover,
        idRequisicion: this.$route.params.id,
      })
        .then(() => {
          this.idArticulosRemover = null;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
          this.dialogAutorizar = false;
        })
        .catch((err) => {
          this.idArticulosRemover = null;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.enviando = false;
          this.dialogAutorizar = false;
        });
    },
    cerrarDialog() {
      this.showArticuloPicker = false;
    },
  },
  computed: {
    ...mapGetters({
      unidades: 'settings/catalogos/unidadesAdministrativas',
      getRequisicion: 'requisiciones/requisicion',
      areas: 'settings/catalogos/areasByUnidad',
    }),
    requisicionData() {
      return this.getRequisicion(this.$route.params.id);
    },
    listadoAreas() {
      return this.areas(this.id_unidad_administrativa);
    },
    listado() {
      return this.articulos;
    },
  },
};
</script>

<style lang="scss">
</style>
