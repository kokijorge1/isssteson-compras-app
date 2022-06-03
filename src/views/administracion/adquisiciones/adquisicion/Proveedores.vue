<template>
  <div id="contenedor-proveedor">
    <v-toolbar
      flat
      color="transparent">
      <page-title
        titulo="Invitación Proveedores">
      </page-title>
    </v-toolbar>
    <v-card v-if="getAdquisicion" class="roundedCustom">
      <v-card-text>
        <v-layout row wrap class="mt-4">
          <v-flex xs12 md6 class="p-xs-r-15">
            <v-toolbar
              color="colorText"
              class="roundedCustom"
              dense
              dark
              extended>
              <template v-slot:extension>
                <v-checkbox
                  pl-0
                  dark
                  color="white"
                  v-model="soloProveedoresSugeridos"
                  label="Solo proveedores sugeridos">
                </v-checkbox>
                <v-text-field
                  v-model="searchProveedor"
                  placeholder="Buscar..."
                  solo-inverted
                  prepend-inner-icon="search"
                  append-outer-icon="close"
                  clearable
                  autofocus
                  v-if="mostrarBuscador"
                  @click:append-outer="mostrarBuscador = !mostrarBuscador">
                </v-text-field>
                <v-btn
                  icon
                  dark
                  v-if="!mostrarBuscador"
                  @click="mostrarBuscador = !mostrarBuscador">
                  <v-icon>search</v-icon>
                </v-btn>
              </template>
              <v-badge color="info" class="hidden-sm-and-down">
                <template v-slot:badge>
                  <span>
                    {{ listadoProveedores.length }}
                  </span>
                </template>
                <v-toolbar-title>
                  Proveedores
                </v-toolbar-title>
              </v-badge>
              <v-spacer></v-spacer>
              <v-badge overlap color="orange">
                <template v-slot:badge>
                  {{ proveedoresSelected.length }}
                </template>
                <v-btn
                  dark
                  color="primary"
                  @click.prevent="agregarParticipantes"
                  :disabled="proveedoresSelected.length <= 0 || enviando"
                  :loading="enviando">
                  Invitar
                </v-btn>
              </v-badge>
            </v-toolbar>
            <div
              class="altura-card-text">
              <v-data-table
                v-model="proveedoresSelected"
                :search.sync="searchProveedor"
                :headers="proveedoresHeaders"
                :items="listadoProveedores"
                select-all
                item-key="id"
                hide-actions>
                <template v-slot:items="props">
                  <tr :active="props.selected">
                      <td>
                        <v-checkbox
                          v-model="props.selected"
                          primary
                          hide-details>
                        </v-checkbox>
                      </td>
                      <td>
                        <strong>
                          {{ props.item.nombre }}
                        </strong>
                      </td>
                      <td>
                        {{ props.item.rfc }}
                      </td>
                      <td>
                        {{ props.item.nombre_representante }}
                      </td>
                      <td></td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-flex>
          <v-flex xs12 md6>
            <v-toolbar
              color="colorText"
              class="roundedCustom"
              dark
              dense
              extended>
              <v-badge color="info">
                <template v-slot:badge>
                  <span>
                    {{ listadoInvitados.length }}
                  </span>
                </template>
                <v-toolbar-title>
                  Invitados
                </v-toolbar-title>
              </v-badge>
              <v-spacer></v-spacer>
              <template
                v-if="getAdquisicion.invitacion.fecha">
                <small class="mt-3">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <v-icon dark small>access_time</v-icon>
                      </span>
                      <fecha-humano
                        class="d-inline-block pl-1"
                        :fecha="getAdquisicion.invitacion.fecha">
                      </fecha-humano>
                    </template>
                    <span>
                      última invitación
                    </span>
                  </v-tooltip>
                  <p class="text-truncate">
                    <strong>Por</strong>
                    <small>
                      {{ getAdquisicion.invitacion.usuario.nombre }}
                    </small>
                  </p>
                </small>
                <v-divider
                  class="mx-3"
                  inset
                  vertical>
                </v-divider>
              </template>
              <template>
                <v-btn
                  color="primary"
                  dark
                  :disabled="listadoInvitados.length <= 0 || enviandoInvitar"
                  :loading="enviandoInvitar"
                  class="hidden-sm-and-down"
                  @click.prevent="enviarInvitaciones">
                  <v-icon dark left>send</v-icon>
                  <span>
                    Enviar Invitación
                  </span>
                </v-btn>
              </template>
              <template>
                <v-btn color="info" icon dark class="hidden-md-and-up">
                  <v-icon>send</v-icon>
                </v-btn>
              </template>
              <template
                v-slot:extension>
              </template>
            </v-toolbar>
            <div
              class="altura-card-text">
              <v-data-table
                :items="listadoInvitados"
                :headers="proveedoresHeaders"
                hide-actions>
                <template v-slot:items="props">
                  <td>
                    {{ props.item.proveedor.nombre }}
                  </td>
                  <td>
                    {{ props.item.proveedor.rfc }}
                  </td>
                  <td>
                    {{ props.item.proveedor.nombre_representante }}
                  </td>
                  <td class="text-xs-right">
                    <v-tooltip top>
                      <v-btn
                        slot="activator"
                        icon
                        dark
                        small
                        color="error"
                        @click="preRemoverParticipante(props.item.id)">
                        <v-icon>remove</v-icon>
                      </v-btn>
                      <span>Remover</span>
                    </v-tooltip>
                  </td>
                </template>
              </v-data-table>
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogAutorizar" persistent max-width="290">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Confirmación
        </v-card-title>
        <v-card-text>
          ¿Seguro que desea remover este Proveedor?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="rRemoverParticipante"
            :loading="enviandoRemover">
            <v-icon dark left>done</v-icon>
            Remover
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
import PageTitle from '@/components/PageTitle.vue';
import FechaHumano from '@/components/FechaHumano.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'Proveedores',
  components: {
    PageTitle,
    FechaHumano,
  },
  data() {
    return {
      enviando: false,
      enviandoRemover: false,
      enviandoInvitar: false,
      dialogAutorizar: false,
      proveedoresSelected: [],
      mostrarBuscador: false,
      searchProveedor: '',
      listaProveedoresSugeridos: [],
      idRemoverParticipante: null,
      soloProveedoresSugeridos: false,
      proveedoresHeaders: [
        { text: 'Nombre/Razon', sortable: true, value: 'nombre' },
        { text: 'RFC', sortable: true, value: 'rfc' },
        { text: 'Representate', sortable: false, value: 'nombre_representante' },
        { text: '', sortable: false, value: '' },
      ],
    };
  },
  methods: {
    ...mapActions('adquisiciones',
      [
        'invitarProveedores',
        'removerParticipante',
        'enviarCorreoInvitacion',
      ]),
    agregarParticipantes() {
      this.enviandoInvitar = true;
      this.invitarProveedores({
        id: Number(this.$route.params.id),
        participantes: this.datosFormateados,
      })
        .then(() => {
          this.enviandoInvitar = false;
          this.proveedoresSelected = [];
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        })
        .catch((err) => {
          this.enviandoInvitar = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    preRemoverParticipante(id) {
      this.idRemoverParticipante = id;
      this.dialogAutorizar = true;
    },
    rRemoverParticipante() {
      this.enviandoInvitar = true;
      this.dialogAutorizar = false;
      this.removerParticipante({
        id_adquisicion: Number(this.$route.params.id),
        id_registro: this.idRemoverParticipante,
      })
        .then(() => {
          this.enviandoInvitar = false;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        })
        .catch((err) => {
          this.enviandoInvitar = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    enviarInvitaciones() {
      const idAdquisicion = Number(this.$route.params.id);
      this.enviandoInvitar = true;
      this.enviarCorreoInvitacion(idAdquisicion)
        .then(() => {
          this.enviandoInvitar = false;
          const msg = 'Las invitaciones se han enviado correctamente';
          const respuesta = new Mensajes(msg).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        })
        .catch((err) => {
          this.enviandoInvitar = false;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
        });
    },
    cerrarDialog() {
      this.wepInvitar = false;
    },
  },
  computed: {
    ...mapGetters({
      proveedores: 'settings/catalogos/proveedores',
      adquisicion: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.adquisicion(Number(this.$route.params.id));
    },
    getAdquisicionPartidasGenericas() {
      return this.getAdquisicion.articulos
        .map(item => item.articulo.partida.partida_generica.id);
    },
    proveedoresInvitados() {
      return this.getAdquisicion.participantes.map(item => item.proveedor.id);
    },
    datosFormateados() {
      return this.proveedoresSelected.map(item => ({
        id_adquisicion: Number(this.$route.params.id),
        id_proveedor: item.id,
      }));
    },
    listadoInvitados() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.participantes;
    },
    listadoProveedores() {
      return this.proveedores
        .filter((item) => {
          if (this.proveedoresInvitados.length <= 0) return item;
          return !this.proveedoresInvitados.includes(item.id);
        })
        .filter((item) => {
          if (!this.soloProveedoresSugeridos
          || this.getAdquisicionPartidasGenericas.length <= 0) return item;
          return item.categorias.some(v => this.getAdquisicionPartidasGenericas
            .includes(v.partida_generica.id));
        })
        .filter((item) => {
          if (item) return item;
          return false;
        });
    },
  },
};
</script>

<style lang="scss">
.altura-card-text {
  height: 40vh;
  overflow: auto;
}
</style>
