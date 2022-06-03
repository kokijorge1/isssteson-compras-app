<template>
  <div id="contenedor-proveedor-adquisiciones">
    <!-- <v-toolbar flat color="transparent">
      <page-title titulo="Compras"></page-title>
      <v-alert
        :value="true"
        color="warning"
        icon="new_releases"
      >
      <span class="py-0">
        En caso de ofertar medicamentos, material de curación y reactivos de laboratorio deberá
        entregar el registro sanitario correspondiente al renglón o a la partida adjudicada.
      </span>
      </v-alert>
    </v-toolbar> -->
    <v-layout row align-center>
      <page-title titulo="Compras"></page-title>
      <!-- <v-alert
        :value="true"
        color="warning"
        icon="new_releases"
      >
        En caso de ofertar medicamentos, material de curación y reactivos de laboratorio deberá
        entregar el registro sanitario correspondiente al renglón o a la partida adjudicada.
      </v-alert> -->
    </v-layout>
    <v-card>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12 md3 class="pr-3">
            <v-select
              v-model="filtros.tipo"
              label="Tipo"
              placeholder="Todos"
              :items="tipos"
              item-text="texto"
              item-value="id"
              clearable
              @click:clear="$nextTick(() => filtros.tipo = '')"
            ></v-select>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              v-model="filtros.searchText"
              placeholder="Buscar..."
              append-icon="search"
              clearable
            ></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-btn
            fab
            small
            color="info"
            @click="abrirManual()">
            <v-icon large>contact_support</v-icon>
          </v-btn>
        </v-layout>
        <v-data-table :items="listado" :headers="headers" :pagination.sync="pagination">
          <template slot="items" slot-scope="props">
            <td v-if="!props.item.declina_participar">
              <v-chip>
                <strong>
                  <router-link
                    :to="{name: 'proveedoresAdquisicion',
                      params: {id: props.item.id}}"
                  >
                    <v-tooltip top>
                      <template #activator="data">
                        <span v-on="data.on">{{ props.item.numero }}</span>
                      </template>
                      <span>Detalles /
                        <v-icon small dark>edit</v-icon>Editar
                      </span>
                    </v-tooltip>
                  </router-link>
                </strong>
              </v-chip>
            </td>
            <td v-else>
              <v-chip
                dark
                color="red">
                <span>{{ props.item.numero }}</span>
              </v-chip>
            </td>
            <td>{{ getTipo(props.item.tipo).texto }}</td>
            <td>{{ props.item.nombre }}</td>
            <td>
              <fecha-humano :fecha="new Date(props.item.fecha)"></fecha-humano>
            </td>
            <td>
              <fecha-humano :fecha="new Date(props.item.fecha_inicio)"></fecha-humano>
            </td>
            <td>
              <fecha-humano :fecha="new Date(props.item.fecha_termino)"></fecha-humano>
            </td>
            <td>
              <fecha-humano :fecha="new Date(props.item.created_at)"></fecha-humano>
            </td>
            <td class="justify-center align-center layout row px-0">
              <v-tooltip
                top
                v-if="!props.item.declina_participar">
                <v-btn
                  color="amber"
                  round
                  small
                  slot="activator"
                  @click="preDeclinarElemento(props.item.id)">
                  <v-icon small>clear</v-icon>
                  <span>Declinar</span>
                </v-btn>
                <span>Declinar Participación</span>
              </v-tooltip>
              <v-tooltip
                top
                v-else>
                <v-chip
                  dark
                  color="red"
                  slot="activator">
                  <span>Declinada</span>
                </v-chip>
                <fecha-humano
                  :fecha="new Date(props.item.participantes[0].updated_at)">
                </fecha-humano>
              </v-tooltip>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogAutorizar" persistent max-width="290">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Confirmación
        </v-card-title>
        <v-card-text>
          ¿Seguro que desea declinar esta invitación?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="declinarElemento" :loading="enviando">
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
import { mapActions, mapGetters } from 'vuex';
import PageTitle from '@/components/PageTitle.vue';
import FechaHumano from '@/components/FechaHumano.vue';
import Mensajes from '@/helpers/mensajes';

export default {
  name: 'ProveedorAdquisiciones',
  components: {
    PageTitle,
    FechaHumano,
  },
  data() {
    return {
      enviando: false,
      idElementoDeclinar: null,
      dialogAutorizar: false,
      pagination: {
        sortBy: 'created_at',
        descending: true,
        rowsPerPage: 25,
      },
      headers: [
        { text: 'Número', sortable: true, value: 'numero' },
        { text: 'Tipo', sortable: true, value: 'tipo' },
        { text: 'Nombre', sortable: true, value: 'partida.id' },
        { text: 'Fecha', sortable: true, value: 'fecha' },
        { text: 'Fecha Inicio', sortable: true, value: 'fecha_inicio' },
        { text: 'Fecha Término', sortable: true, value: 'fecha_termino' },
        { text: 'Fecha Reg.', sortable: true, value: 'created_at' },
        { text: '', value: 'acciones' },
      ],
      filtros: {
        tipo: '',
        searchText: '',
        estatus: '',
      },
    };
  },
  methods: {
    ...mapActions('proveedores', ['declinarAdquisicion']),
    getTipo(tipo) {
      return this.tipo(tipo);
    },
    preDeclinarElemento(id) {
      this.idElementoDeclinar = id;
      this.dialogAutorizar = true;
    },
    declinarElemento() {
      if (!this.idElementoDeclinar) return;

      this.enviando = true;
      this.declinarAdquisicion({
        id: this.idElementoDeclinar,
      })
        .then(() => {
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.cerrarDialog();
        })
        .catch((err) => {
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', { respuesta });
          this.cerrarDialog();
        });
    },
    cerrarDialog() {
      this.dialogAutorizar = false;
      this.idElementoDeclinar = null;
      this.enviando = false;
    },
    abrirManual() {
      const ruta = window.location.hostname === 'localhost' ? 'http://localhost:8080' : window.location.hostname;
      window.open(`${ruta}/manual_proveedores.pdf`, '_blank');
    },
  },
  computed: {
    ...mapGetters({
      adquisiciones: 'proveedores/adquisiciones',
      tipos: 'adquisiciones/tipos',
      tipo: 'adquisiciones/tipo',
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
  },
};
</script>

<style lang="scss">
</style>
