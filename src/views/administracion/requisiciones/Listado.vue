<template>
  <div id="contenedor-listado-requisiciones">
    <v-toolbar flat color="transparent">
      <page-title titulo="Requisiciones"></page-title>
    </v-toolbar>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 md2 class="p-xs-r-15">
            <v-select
              v-model="filtros.estatus"
              label="Estatus"
              :items="estatus"
              item-text="texto"
              item-value="id"
              placeholder="Todas"
              clearable
              solo
              @change="setFiltros"
              @click:clear="$nextTick(() => filtros.estatus = 999)"
            >
            </v-select>
          </v-flex>
          <v-flex
            xs12
            md3
            class="p-xs-r-15"
            v-if="$auth.user().roles === 'superadmin'">
            <v-select
              v-model="filtros.unidadAdm"
              :items="unidadesAdministrativas"
              item-text="nombre"
              item-value="id"
              placeholder="Unidad Adm. Resp."
              clearable
              solo
              @change="setFiltros">
            </v-select>
          </v-flex>
          <v-flex
            xs12
            md3
            class="p-xs-r-15"
            v-if="this.$auth.user().roles !== 'area'">
            <v-select
              v-model="filtros.area"
              :items="listadoAreas"
              item-value="id"
              item-text="nombre"
              placeholder="Area"
              clearable
              solo
              @change="setFiltros">
            </v-select>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              v-model="filtros.searchText"
              placeholder="Buscar..."
              append-icon="search"
              clearable
              solo
              @keyup.native="setFiltros"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-chip
            color="info"
            text-color="white">
            Registros:
            {{ listado.length }}
          </v-chip>
          <v-chip
            color="warning"
            text-color="white">
            Solicitadas:
            {{ listadoSolicitadas.length }}
          </v-chip>
          <v-chip
            color="primary"
            text-color="white">
            <v-avatar>
              <v-icon>check_circle</v-icon>
            </v-avatar>
            Autorizadas:
            {{ listadoAutorizadas.length }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-tooltip top class="hidden-sm-and-down">
            <v-btn
              slot="activator"
              class="hidden-xs-only roundedCustom"
              color="primary"
              :to="{name: 'requisicionAgregar'}"
            >
              <v-icon class="white--text">add</v-icon>
              <span class="white--text">Agregar</span>
            </v-btn>
            <span>Requisición</span>
          </v-tooltip>
        </v-layout>
        <v-data-table
          :headers="headers"
          :items="listado"
          :pagination.sync="pagination"
          class="mt-4">
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <strong>
                  <router-link :to="{name: 'requisicionEditar', params:{id: props.item.id}}">
                    <v-tooltip top>
                      <template #activator="data">
                        <span v-on="data.on">
                          {{ props.item.numero }}
                          <!-- <v-badge color="grey lighten-3">
                            <span
                              class="grey--text text--darken-2"
                              slot="badge"
                              v-if="props.item.articulos.length > 1">
                              <small>{{ props.item.articulos.length }}</small>
                            </span>
                            <span class="badge badge-info">
                              <v-icon small dark>more</v-icon>
                              {{ props.item.numero }}
                            </span>
                          </v-badge> -->
                        </span>
                      </template>
                      <span>
                        Detalles /
                        <v-icon small dark>edit</v-icon>Editar
                      </span>
                    </v-tooltip>
                  </router-link>
                </strong>
                <chip-nuevo
                  :fecha="props.item.created_at">
                </chip-nuevo>
              </td>
              <td>
                <span
                  v-if="props.item.tipo">
                  {{ props.item.tipo.descripcion }}
                </span>
              </td>
              <td>{{ props.item.partida.nombre }}</td>
              <td>
                <span v-if="props.item.estatus === 0">
                  <fecha-calendario
                    :fecha="new Date(props.item.fecha_requerida)"
                    mostrarEstatus>
                  </fecha-calendario>
                </span>
                <span v-else>
                  {{ $moment(props.item.fecha_requerida).format('D/MM/YYYY') }}
                </span>
              </td>
              <td class="hidden-sm-and-down">
                {{ props.item.area.nombre }}
                <div v-if="$auth.user().roles === 'superadmin'">
                  <small>
                    <i>
                      ({{ props.item.area.unidad_administrativa.nombre }})
                    </i>
                  </small>
                </div>
              </td>
              <td>
                {{ props.item.articulos.length }}
              </td>
              <td>
                {{ props.item.estatus | EstatusRequisicion }}
              </td>
              <td>
                <fecha-humano
                  :fecha="props.item.created_at">
                </fecha-humano>
              </td>
              <td class="justify-end layout px-0">
                <template
                  v-if="$auth.user().valida
                  && props.item.estatus === 0"
                >
                  <v-tooltip top>
                    <v-btn
                      icon
                      class="hidden-sm-and-down"
                      slot="activator"
                      @click="preAutorizar(props.item)"
                    >
                      <v-icon>done</v-icon>
                    </v-btn>
                    <span>Autorizar</span>
                  </v-tooltip>
                </template>
                <template
                  v-if="props.item.estatus >= 1 && props.item.estatus < 99">
                  <v-menu
                    left
                    :position-x="0"
                    :nudge-width="200"
                    :close-on-content-click="false">
                    <v-btn
                      icon
                      slot="activator"
                      color="primary"
                      small>
                      <v-icon dark small>done</v-icon>
                    </v-btn>
                    <v-card>
                      <v-list>
                        <v-list-tile>
                          <v-list-tile-avatar>
                            <v-icon color="primary" dark>done</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>
                              {{ props.item.usuario_reviso.nombre }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              {{ $moment(props.item.fecha_reviso)
                              .format('D/MM/YYYY, h:mm:ss a') }}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-menu>
                </template>
                <template
                  v-if="props.item.estatus === 99">
                  <v-menu
                    left
                    :position-x="0"
                    :nudge-width="200"
                    :close-on-content-click="false">
                    <v-btn
                      icon
                      slot="activator"
                      color="error"
                      small>
                      <v-icon dark small>close</v-icon>
                    </v-btn>
                    <v-card>
                      <v-list>
                        <v-list-tile>
                          <v-list-tile-avatar>
                            <v-icon color="error" dark>cancel</v-icon>
                          </v-list-tile-avatar>
                          <v-list-tile-content>
                            <v-list-tile-title>
                              {{ props.item.usuario_reviso.nombre }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                              {{ $moment(props.item.fecha_reviso)
                              .format('D/MM/YYYY, h:mm:ss a') }}
                            </v-list-tile-sub-title>
                          </v-list-tile-content>
                        </v-list-tile>
                      </v-list>
                    </v-card>
                  </v-menu>
                </template>
                <v-badge
                  :value="props.item.expedientes.length > 0"
                  color="grey lighten-1"
                  overlap
                  >
                  <template v-slot:badge>
                    <span>
                      {{ props.item.expedientes.length }}
                    </span>
                  </template>
                  <v-btn icon @click="mostrarArchivo(props.item)">
                    <v-icon large color="yellow darken-2">folder</v-icon>
                  </v-btn>
                </v-badge>
                <v-menu
                  bottom
                  left>
                  <v-btn icon slot="activator">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                      @click="preAutorizar(props.item)"
                      v-if="$auth.user().valida
                        && props.item.estatus === 0"
                    >
                      <v-list-tile-action>
                        <v-icon color="primary" dark>done</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Autorizar</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                      @click="preCancelar(props.item)"
                      v-if="$auth.user().valida &&
                        props.item.estatus === 0">
                      <v-list-tile-action>
                        <v-icon color="error">cancel</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Cancelar</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider
                      class="my-1"
                      v-if="$auth.user().valida
                        && props.item.estatus === 0">
                    </v-divider>
                    <v-list-tile @click="descargarRequisicion(props.item)">
                      <v-list-tile-action>
                        <v-icon>folder</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Archivo</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action
                        v-if="props.item.expedientes.length > 0">
                        {{ props.item.expedientes.length }}
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="descargarRequisicion(props.item)">
                      <v-list-tile-action>
                        <v-icon>cloud_download</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Requisición</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="descargarSolicitud(props.item)">
                      <v-list-tile-action>
                        <v-icon>cloud_download</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Solicitud</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile :to="{name: 'requisicionEditar', params: {id: props.item.id }}">
                      <v-list-tile-action>
                        <v-icon>edit</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                        <v-list-tile-title>Editar</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </template>
          <template slot="no-data">
            <v-btn
              round
              block
              dark
              color="primary"
              :to="{name: 'requisicionAgregar'}">
              <v-icon right dark>add</v-icon>
              Agregar Requisición
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-tooltip top>
      <v-btn
        slot="activator"
        color="primary"
        class="hidden-sm-and-up"
        transition="slide-x-transition"
        dark
        fab
        fixed
        left
        bottom
        :to="{name: 'requisicionAgregar'}">
        <v-icon>add</v-icon>
      </v-btn>
      <span>Requisicion</span>
    </v-tooltip>
    <v-dialog v-model="dialogAutorizar" persistent max-width="290">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title>
          Autorizar Requisición
        </v-card-title>
        <v-card-text>
          ¿Seguro que desea autorizar la requisición
          <strong>{{ requisicionAutorizar.numero }}</strong>
          ?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="autorizar" :loading="enviandoAutorizar">
            <v-icon dark left>done</v-icon>Autorizar
          </v-btn>
          <v-btn
            flat color="error"
            @click="dialogAutorizar = !dialogAutorizar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogCancelar" persistent max-width="290">
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title>
          Cancelar Requisición
        </v-card-title>
        <v-card-text>
          ¿Seguro que desea cancelar la requisición
          <strong>{{ requisicionCancelar.numero }}</strong>
          ?
          <v-textarea
            v-model="observacionesCancelar"
            label="Observaciones">
          </v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="cancelar" :loading="enviandoCancelar">
            <v-icon dark left>cancel</v-icon>Cancelar
          </v-btn>
          <v-btn
            flat color="error"
            @click="dialogCancelar = !dialogCancelar">
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogArchivo"
      max-width="600px">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>
            Expediente / <b>{{ requisicion.numero }}</b>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogArchivo = !dialogArchivo">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar flat color="transparent" v-if="!mostrarAnexarArchivo">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            small
            @click="seleccionarArchivo">
            <v-icon small left dark>add</v-icon>
            Agregar
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-list subheader>
              <template v-if="mostrarAnexarArchivo">
                <v-list-tile class="mb-2">
                  <v-text-field
                    v-model="archivoAnexo"
                    label="Nombre del Archivo"
                    prepend-icon="attach_file">
                  </v-text-field>
                  <v-btn
                    small
                    color="primary"
                    @click="anexarArchivo">
                    <v-icon dark small left>save</v-icon>
                    Guardar
                  </v-btn>
                  <v-btn small @click="cancelarAnexarArchivo">
                    <v-icon small left>cancel</v-icon>
                    Cancelar
                  </v-btn>
                </v-list-tile>
                <v-divider></v-divider>
              </template>
              <div v-for="(anexo, index) in requisicion.expedientes" :key="`t-${index}`">
                <v-list-tile
                  ripple
                  avatar
                  :key="index">
                  <v-list-tile-avatar>
                    <v-btn
                      icon
                      flat
                      class="blue white--text"
                      @click="descagarExpediente(anexo)">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ anexo.file_original_name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      <small>
                        {{ anexo.usuario.nombre }} -
                        <fecha-humano
                          :fecha="new Date(anexo.created_at)">
                        </fecha-humano>
                        - <v-icon small>attachment</v-icon>
                        {{ $humanFileSize(anexo.file_size) }}
                      </small>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon @click="borrarAnexoExpediente(anexo.id)">
                      <v-icon color="error">delete</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider
                  inset
                  v-if="index + 1 < requisicion.expedientes.length"
                  :key="`div-${index}`"
                  class="pt-1">
                </v-divider>
              </div>
          </v-list>
        </v-card-text>
      </v-card>
      <input
        type="file"
        name="archivo"
        id="archivo"
        accept="application/pdf, .pdf"
        style="display:none;"
        @change="archivoSeleccionado">
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import FileDownloader from 'js-file-download';
import PageTitle from '@/components/PageTitle.vue';
import FechaCalendario from '@/components/FechaCalendario.vue';
import FechaHumano from '@/components/FechaHumano.vue';
import ChipNuevo from '@/components/ChipNuevo.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'ListadoRequisiciones',
  components: {
    PageTitle,
    FechaCalendario,
    FechaHumano,
    ChipNuevo,
  },
  data() {
    return {
      enviandoAutorizar: false,
      enviandoCancelar: false,
      dialogAutorizar: false,
      dialogCancelar: false,
      dialogArchivo: false,
      mostrarAnexarArchivo: false,
      archivoAnexo: '',
      requisicionAutorizar: {},
      requisicionCancelar: {},
      observacionesCancelar: null,
      requisicion: {},
      pagination: {
        sortBy: 'created_at',
        descending: true,
        rowsPerPage: 25,
      },
      headers: [
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Tipo', sortable: true, value: 'tipo.descripcion' },
        { text: 'Partida', sortable: true, value: 'partida.id' },
        { text: 'Fecha Requerida', sortable: true, value: 'fecha_requerida' },
        {
          text: 'Area',
          sortable: true,
          value: 'area.id',
          class: 'hidden-sm-and-down',
        },
        { text: 'Articulos', sortable: true, value: 'articulos' },
        { text: 'Estatus', sortable: true, value: 'estatus' },
        { text: 'Fecha Reg.', sortable: true, value: 'created_at' },
        {
          text: '',
          sortable: false,
          value: '',
        },
      ],
      filtros: {
        unidadAdm: '',
        area: '',
        searchText: '',
        estatus: 999,
      },
      estatus: [
        {
          id: 999,
          texto: 'Todas',
        },
        {
          id: 0,
          texto: 'Solicitadas',
        },
        { id: 1, texto: 'Autorizada' },
      ],
    };
  },
  mounted() {
    if (this.$auth.user().roles === 'compras'
    || this.$auth.user().roles === 'area') {
      this.filtros.unidadAdm = this.$auth.user().unidad_administrativa.id;
      this.filtros.area = this.$auth.user().area.id;
      return;
    }
    if (this.getFiltros) {
      const filtrosNuevos = {
        unidadAdm: this.getFiltros.unidadAdm,
        area: this.getFiltros.area,
        estatus: this.getFiltros.estatus,
        searchText: this.getFiltros.searchText,
      };
      this.filtros = filtrosNuevos;
    }
  },
  methods: {
    ...mapActions('requisiciones',
      [
        'autorizarRequisicion',
        'cancelarRequisicion',
      ]),
    preAutorizar(item) {
      this.dialogAutorizar = true;
      this.requisicionAutorizar = item;
    },
    preCancelar(item) {
      this.dialogCancelar = true;
      this.requisicionCancelar = item;
    },
    mostrarArchivo(requisicion) {
      this.dialogArchivo = !this.dialogArchivo;
      this.requisicion = requisicion;
    },
    autorizar() {
      this.enviandoAutorizar = true;
      this.autorizarRequisicion(this.requisicionAutorizar.id)
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.filtros.estatus = 999;
          this.enviandoAutorizar = false;
          this.dialogAutorizar = false;
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.enviandoAutorizar = false;
          this.dialogAutorizar = false;
        });
    },
    cancelar() {
      const requisicion = {
        id_requisicion: this.requisicionCancelar.id,
        observaciones: this.observacionesCancelar || this.requisicionCancelar.observaciones,
      };

      this.cancelarRequisicion(requisicion)
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.filtros.estatus = 999;
          this.enviandoCancelar = false;
          this.dialogCancelar = false;
          this.observacionesCancelar = null;
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
          this.enviandoCancelar = false;
          this.dialogCancelar = false;
        });
    },
    descargarRequisicion(requisicion) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.axios.get(`/requisiciones/generar/requisicion/${requisicion.id}`, {
        responseType: 'blob',
        timeout: 30000,
      })
        .then((res) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          FileDownloader(res.data, `requisición-${requisicion.numero}.pdf`);
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    descargarSolicitud(requisicion) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
      this.axios.get(`/requisiciones/generar/solicitud/${requisicion.id}`, {
        responseType: 'blob',
        timeout: 30000,
      })
        .then((res) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          FileDownloader(res.data, `solicitud-${requisicion.numero}.docx`);
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    setFiltros() {
      const filtros = {
        unidadAdm: this.filtros.unidadAdm,
        area: this.filtros.area,
        searchText: this.filtros.searchText,
        estatus: this.filtros.estatus,
      };
      this.$store.commit('requisiciones/SET_FILTROS', { filtros });
    },
    anexarArchivo() {
      const formData = new FormData();
      const anexarArchivoInput = document.getElementById('archivo');
      formData.append('id_requisicion', this.requisicion.id);
      formData.append('numero', this.requisicion.numero);
      formData.append('nombre_adjunto', this.archivoAnexo);
      formData.append('adjunto', anexarArchivoInput.files[0]);

      this.axios.post('requisiciones/expediente', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((anexo) => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.$store.commit('requisiciones/ANEXAR_ARCHIVO', { anexo: anexo.data });

          this.cancelarAnexarArchivo();
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    seleccionarArchivo() {
      const anexarArchivoInput = document.getElementById('archivo');
      anexarArchivoInput.click();
      this.mostrarAnexarArchivo = true;
    },
    archivoSeleccionado(e) {
      const nombreArchivo = e.target.files[0].name.split('.').slice(0, -1).join('.');
      // const extencionArchivo = e.target.files[0].name.split('.').pop();
      this.archivoAnexo = nombreArchivo;
    },
    cancelarAnexarArchivo() {
      this.mostrarAnexarArchivo = !this.mostrarAnexarArchivo;
      this.archivoAnexo = '';
    },
    descagarExpediente(anexo) {
      this.axios.get(`/requisiciones/expediente/${anexo.public_key}`, {
        responseType: 'blob',
        timeout: 30000,
      })
        .then((res) => {
          FileDownloader(res.data, `${anexo.file_original_name}.pdf`);
        })
        .catch((err) => {
          this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
    },
    async borrarAnexoExpediente(id) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');

      await this.axios.delete(`/requisiciones/expediente/${id}`)
        .then(() => {
          const anexo = {
            id_requisicion: this.requisicion.id,
            id,
          };

          const respuesta = new Mensajes('El anexo fue borrado correctamente.').success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.$store.commit('requisiciones/REMOVER_ANEXAR_ARCHIVO', { anexo });
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });

      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');
    },
  },
  computed: {
    ...mapGetters({
      requisiciones: 'requisiciones/requisiciones',
      getFiltros: 'requisiciones/filtros',
      unidadesAdministrativas: 'settings/catalogos/unidadesAdministrativas',
      areas: 'settings/catalogos/areasByUnidad',
    }),
    listadoAreas() {
      if (!this.filtros.unidadAdm) return [];
      return this.areas(this.filtros.unidadAdm);
    },
    listado() {
      return this.requisiciones
        .filter((item) => {
          if (this.filtros.estatus === 999
            || this.filtros.estatus === undefined) return item;
          if (this.filtros.estatus === 1) {
            return item.estatus >= 1;
          }
          return item.estatus === this.filtros.estatus;
        })
        .filter((item) => {
          if (!this.filtros.unidadAdm) return item;
          return item.area.unidad_administrativa.id === this.filtros.unidadAdm;
        })
        .filter((item) => {
          if (!this.filtros.area) return item;
          return item.area.id === this.filtros.area;
        })
        .filter((item) => {
          if (!this.filtros.searchText) return item;
          const expt = new RegExp(this.filtros.searchText, 'gi');
          return (
            expt.test(item.numero)
            || expt.test(item.justificacion)
            || expt.test(item.observaciones)
            || expt.test(item.partida.nombre)
            || expt.test(item.area.nombre)
          );
        });
    },
    listadoSolicitadas() {
      return this.listado.filter(item => item.estatus === 0);
    },
    listadoAutorizadas() {
      return this.listado.filter(item => item.estatus >= 1 && item.estatus < 99);
    },
  },
  watch: {
    dialogArchivo(nuevoValor) {
      if (!nuevoValor) {
        this.requisicion = {};
      }
    },
  },
};
</script>

<style lang="scss">
.cortar-texto-td {
    display: block;
    display: -webkit-box;
    max-width: 300px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
