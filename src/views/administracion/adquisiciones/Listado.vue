<template>
  <div id="contenedor-listada-adquisiciones">
    <v-toolbar flat color="transparent">
      <page-title titulo="Compras"></page-title>
    </v-toolbar>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout row wrap align-center>
          <v-flex xs12 md2 class="p-xs-r-15">
            <v-select
              v-model="filtros.tipo"
              label="Tipo"
              placeholder="Todos"
              :items="tipos"
              item-text="texto"
              item-value="id"
              clearable
              hide-details
              solo
              @click:clear="$nextTick(() => (filtros.tipo = ''))"
              @change="setFiltros"
            ></v-select>
          </v-flex>
          <v-flex xs12 md3>
            <v-text-field
              v-model="filtros.searchText"
              placeholder="Buscar..."
              append-icon="search"
              clearable
              solo
              hide-details
              @keyup.native="setFiltros"
              @click:clear="setFiltros"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-tooltip top class="hidden-sm-and-down">
              <v-btn
                slot="activator"
                color="indigo"
                :dark="getAdquisicionesIdSelected.length !== 0"
                small
                round
                :disabled="getAdquisicionesIdSelected.length === 0"
                @click="descagarActa"
              >
                <v-icon small class="indigo--text text--lighten-4 mr-2">description</v-icon>
                <span class="mr-2">Gen. Acta</span>
                <v-chip
                  v-if="getAdquisicionesIdSelected.length !== 0"
                  color="indigo lighten-1"
                  small
                  class="ma-0 ml-1"
                >
                  {{ getAdquisicionesIdSelected.length }}
                </v-chip>
              </v-btn>
              <span>Generar Acta</span>
            </v-tooltip>
          </v-flex>
          <v-spacer></v-spacer>
          <v-tooltip top class="hidden-sm-and-down">
            <v-btn
              slot="activator"
              color="primary"
              dark
              class="roundedCustom"
              :to="{ name: 'adquisicionesAgregar' }"
            >
              <v-icon class="white--text">add</v-icon>
              <span class="white--text">Agregar</span>
            </v-btn>
            <span>Adquisición</span>
          </v-tooltip>
        </v-layout>
        <v-data-table
          v-model="adquisicionesSeleccionadas"
          :items="listado"
          :headers="headers"
          :pagination.sync="pagination"
          select-all
          dense
          item-key="id"
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
            </td>
            <td class="pl-0 pr-1">
              <strong>
                <router-link
                  :to="{
                    name: 'adquisicionesEditar',
                    params: { id: props.item.id, identificador: props.item.numero }
                  }"
                >
                  <v-tooltip top>
                    <template #activator="data">
                      <span v-on="data.on">
                        <span class="badge badge-info">
                          {{ props.item.numero }}
                          <v-icon small dark>more</v-icon>
                        </span>
                      </span>
                    </template>
                    <span>Detalles / <v-icon small dark>edit</v-icon>Editar </span>
                  </v-tooltip>
                </router-link>
              </strong>
            </td>
            <td class="px-2">{{ getTipo(props.item.tipo).texto }}</td>
            <td class="px-1">
              <small>{{ props.item.nombre }}</small>
            </td>
            <td class="px-2" align="center">
              <fecha-humano :fecha="new Date(props.item.fecha)"> </fecha-humano>
            </td>
            <td class="px-2" align="center">
              <fecha-humano :fecha="new Date(props.item.fecha_inicio)"> </fecha-humano>
            </td>
            <td class="px-2" align="center">
              <fecha-humano :fecha="new Date(props.item.fecha_termino)"> </fecha-humano>
            </td>
            <td class="px-2" align="center">
              {{ props.item.requisiciones.length > 0 ? props.item.requisiciones.length : "" }}
            </td>
            <td class="px-2" align="center">{{ props.item.articulos.length }}</td>
            <td>
              <fecha-humano :fecha="new Date(props.item.created_at)"></fecha-humano>
            </td>
            <td class="justify-end align-center layout px-0">
              <v-badge :value="props.item.expedientes.length > 0" color="grey lighten-1" overlap>
                <template v-slot:badge>
                  <span>
                    {{ props.item.expedientes.length }}
                  </span>
                </template>
                <v-btn icon @click="mostrarExpediente(props.item)">
                  <v-icon large color="yellow darken-2">folder</v-icon>
                </v-btn>
              </v-badge>
              <v-menu>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile
                    :to="{
                      name: 'adquisicionesEditar',
                      params: { id: props.item.id, identificador: props.item.numero }
                    }"
                  >
                    <v-list-tile-action>
                      <v-icon>edit</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Editar</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile @click="borrarAdquisicion">
                    <v-list-tile-action>
                      <v-icon>delete</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title>Borrar</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </td>
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
        :to="{ name: 'adquisicionesAgregar' }"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-tooltip>
    <v-dialog v-model="dialogExpediente" max-width="600px">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>
            Expediente / <b>{{ adquisicion.numero }}</b>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogExpediente = !dialogExpediente">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar flat color="transparent" v-if="!mostrarAnexarArchivo">
          <v-spacer></v-spacer>
          <v-btn color="primary" small @click="seleccionarArchivo">
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
                  prepend-icon="attach_file"
                >
                </v-text-field>
                <v-btn small color="primary" @click="anexarArchivo">
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
            <div v-for="(anexo, index) in adquisicion.expedientes" :key="`t__${anexo.public_key}`">
              <v-list-tile ripple avatar :key="anexo.public_key">
                <v-list-tile-avatar>
                  <v-btn icon flat class="blue white--text" @click="descagarExpediente(anexo, 0)">
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
                      <fecha-humano :fecha="new Date(anexo.created_at)"> </fecha-humano>
                      - <v-icon small>attachment</v-icon>
                      {{ $humanFileSize(anexo.file_size) }}
                    </small>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon @click="borrarAnexoExpediente(anexo.id)">
                    <v-icon color="error">
                      delete
                    </v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                inset
                v-if="index + 1 < adquisicion.expedientes.length"
                :key="`div-${index}`"
                class="pt-1"
              >
              </v-divider>
            </div>
            <template v-if="expedienteRequisiciones.length > 0">
              <v-divider class="mb-1 mt-3"> </v-divider>
              <v-subheader>
                <h3>
                  Requisición(es)
                </h3>
              </v-subheader>
            </template>
            <div v-for="(requisicion, index) in expedienteRequisiciones" :key="`tmp-${index}`">
              <v-subheader :key="`sub-titulo-requisicion-${index}`">
                <b>{{ requisicion.numero }}</b>
              </v-subheader>
              <div v-for="(exp, inx) in requisicion.expedientes" :key="`t_div-${exp.public_key}`">
                <v-list-tile :key="exp.public_key">
                  <v-list-tile-avatar>
                    <v-btn icon flat class="blue white--text" @click="descagarExpediente(exp, 1)">
                      <v-icon>cloud_download</v-icon>
                    </v-btn>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      {{ exp.file_original_name }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      <small>
                        {{ exp.usuario.nombre }} -
                        <fecha-humano :fecha="new Date(exp.created_at)"> </fecha-humano>
                        - <v-icon small>attachment</v-icon>
                        {{ $humanFileSize(exp.file_size) }}
                      </small>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action> </v-list-tile-action>
                </v-list-tile>
                <v-divider
                  inset
                  v-if="inx + 1 < requisicion.expedientes.length"
                  :key="`div-${exp.public_key}`"
                  class="pt-1"
                >
                </v-divider>
              </div>
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
        @change="archivoSeleccionado"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FileDownloader from 'js-file-download';
import Mensajes from '@/helpers/mensajes';
import PageTitle from '@/components/PageTitle.vue';
import FechaHumano from '@/components/FechaHumano.vue';

export default {
  name: 'ListadoAdquisiciones',
  components: {
    PageTitle,
    FechaHumano,
  },
  data() {
    return {
      adquisicion: {},
      adquisicionesSeleccionadas: [],
      requisicionesSeleccionadas: [],
      dialogExpediente: false,
      mostrarAnexarArchivo: false,
      archivoAnexo: '',
      pagination: {
        sortBy: 'created_at',
        descending: true,
        rowsPerPage: 25,
      },
      headers: [
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Tipo', sortable: true, value: 'tipo' },
        {
          text: 'Nombre',
          sortable: true,
          value: 'nombre',
          width: '40%',
        },
        { text: 'Fecha', sortable: true, value: 'fecha' },
        { text: 'F. Inicio', sortable: true, value: 'fecha_inicio' },
        { text: 'F. Término', sortable: true, value: 'fecha_termino' },
        {
          text: 'Req.',
          sortable: false,
          value: 'requisiciones',
          align: 'center',
          width: '1%',
        },
        {
          text: 'Art.',
          sortable: false,
          value: 'articulos',
          align: 'center',
          width: '1%',
        },
        { text: 'Fecha Reg.', sortable: true, value: 'created_at' },
        {
          text: '',
          sortable: false,
          value: '',
        },
      ],
      filtros: {
        tipo: '',
        searchText: '',
        estatus: '',
      },
    };
  },
  mounted() {
    if (this.getFiltros) {
      const filtros = {
        tipo: this.getFiltros.tipo,
        searchText: this.getFiltros.searchText,
        estatus: this.getFiltros.estatus,
      };
      this.filtros = filtros;
    }
  },
  methods: {
    getTipo(tipo) {
      return this.tipo(tipo);
    },
    borrarAdquisicion() {},
    setFiltros() {
      const filtros = {
        tipo: this.filtros.tipo,
        searchText: this.filtros.searchText,
        estatus: this.filtros.estatus,
      };
      this.$store.commit('adquisiciones/SET_FILTROS', { filtros });
    },
    mostrarExpediente(adquisicion) {
      this.dialogExpediente = true;
      this.adquisicion = adquisicion;

      this.requisicionesSeleccionadas = this.adquisicion.requisiciones.map(item => item.id);
    },
    seleccionarArchivo() {
      const anexarArchivoInput = document.getElementById('archivo');
      anexarArchivoInput.click();

      this.mostrarAnexarArchivo = true;
    },
    archivoSeleccionado(e) {
      const nombreArchivo = e.target.files[0].name
        .split('.')
        .slice(0, -1)
        .join('.');
      // const extencionArchivo = e.target.files[0].name.split('.').pop();
      this.archivoAnexo = nombreArchivo;
    },
    cancelarAnexarArchivo() {
      this.mostrarAnexarArchivo = !this.mostrarAnexarArchivo;
      this.archivoAnexo = '';
    },
    async anexarArchivo() {
      const formData = new FormData();
      const anexarArchivoInput = document.getElementById('archivo');
      formData.append('id_adquisicion', this.adquisicion.id);
      formData.append('numero', this.adquisicion.numero);
      formData.append('nombre_adjunto', this.archivoAnexo);
      formData.append('adjunto', anexarArchivoInput.files[0]);

      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');

      await this.axios
        .post('adquisiciones/expediente', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((anexo) => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.$store.commit('adquisiciones/ANEXAR_ARCHIVO', { anexo: anexo.data });

          this.cancelarAnexarArchivo();
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
    async borrarAnexoExpediente(id) {
      this.$store.commit('settings/generales/CAMBIAR_IS_CARGANDO');

      await this.axios
        .delete(`/adquisiciones/expediente/${id}`)
        .then(() => {
          const anexo = {
            id_adquisicion: this.adquisicion.id,
            id,
          };

          const respuesta = new Mensajes('El anexo fue borrado correctamente.').success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.$store.commit('adquisiciones/REMOVER_ANEXAR_ARCHIVO', { anexo });
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
    descagarExpediente(anexo, tipo) {
      const urlsDescargas = ['/adquisiciones/expediente/', '/requisiciones/expediente/'];
      this.axios
        .get(`${urlsDescargas[tipo]}${anexo.public_key}`, {
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
    descagarActa() {
      if (this.getAdquisicionesIdSelected.length === 0) return;
      this.axios
        .post(
          '/adquisiciones/generar/multiacta',
          { idAdquisiciones: this.getAdquisicionesIdSelected },
          {
            responseType: 'blob',
            timeout: 30000,
          },
        )
        .then((res) => {
          FileDownloader(res.data, 'Acta.docx');
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
  },
  computed: {
    ...mapGetters({
      adquisiciones: 'adquisiciones/adquisiciones',
      requisiciones: 'requisiciones/requisiciones',
      tipos: 'adquisiciones/tipos',
      tipo: 'adquisiciones/tipo',
      getFiltros: 'adquisiciones/filtros',
    }),
    listado() {
      return this.adquisiciones
        .filter((item) => {
          if (!this.filtros.tipo) return item;
          return item.tipo === this.filtros.tipo;
        })
        .filter((item) => {
          if (!this.filtros.searchText) return item;
          const expt = new RegExp(this.filtros.searchText, 'gi');
          return expt.test(item.numero) || expt.test(item.nombre);
        });
    },
    expedienteRequisiciones() {
      if (!this.adquisicion || this.requisicionesSeleccionadas.length <= 0) return [];
      return this.requisiciones.filter(item => this.requisicionesSeleccionadas.includes(item.id));
    },
    getAdquisicionesIdSelected() {
      if (this.adquisicionesSeleccionadas.length === 0) return [];
      return this.adquisicionesSeleccionadas.map(item => item.id);
    },
  },
};
</script>

<style lang="scss"></style>
