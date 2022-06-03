<template>
  <div id="posturas-iniciales">
    <page-title titulo="Posturas Iniciales"></page-title>
    <v-card class="roundedCustom">
      <v-card-text>
        <v-layout row wrap align-center>
          <v-flex xs12 md4 class="p-xs-r-15">
            <v-select
              v-model="proveedorSeleccionado"
              label="Proveedor"
              :items="getParticipantes"
              item-text="nombre"
              item-value="id"
              solo>
            </v-select>
          </v-flex>
          <v-flex xs12 md4>
            <v-text-field
              v-model="searchArticulo"
              label="Buscar Articulo..."
              outline
              prepend-inner-icon="search"
              clearable>
            </v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row v-if="proveedorSeleccionado">
          <v-flex xs12 md5 class="p-xs-r-15">
            <v-toolbar
              color="indigo"
              dense
              flat
              dark>
              <v-toolbar-title>Articulos Disponibles</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="articulosSelected.length === 0"
                @click="agregarArticulos">
                Cotizar Articulos
                <v-icon right>add</v-icon>
              </v-btn>
            </v-toolbar>
            <div class="altura-card-text">
              <v-data-table
                v-model="articulosSelected"
                :search.sync="searchArticulo"
                :headers="headers"
                :items="listadoArticulos"
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
                      <small>
                        <strong>{{ props.item.articulo.clave_interna }}</strong>
                      </small>
                    </td>
                    <td><small>{{ props.item.articulo.nombre }}</small></td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-flex>
          <v-flex xs12 md7>
            <v-toolbar
              color="light-blue accent-4"
              dense
              flat
              dark>
              <v-toolbar-title>Posturas Iniciales</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="removerSelected.length === 0"
                @click="removerArticulos">
                Remover Articulos
                <v-icon right>delete</v-icon>
              </v-btn>
            </v-toolbar>
            <v-data-table
              v-model="removerSelected"
              :search.sync="searchArticulo"
              :headers="headersPosturas"
              :items="misArticulos"
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
                    <small>
                      <strong>{{ props.item.clave_interna }}</strong>
                    </small>
                  </td>
                  <td><small>{{ props.item.nombre }}</small></td>
                  <td class="px-0">
                    <v-layout row>
                      <v-text-field
                        type="number"
                        v-model="props.item.precio_unitario"
                        label="Precio Unitario (Antes de I.V.A)"
                        prefix="$"
                        @keypress="soloNumeros">
                      </v-text-field>
                      <v-btn
                        icon
                        @click="enviar(props.item)">
                        <v-icon>save</v-icon>
                      </v-btn>
                    </v-layout>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Mensajes from '@/helpers/mensajes';
import PageTitle from '@/components/PageTitle.vue';

export default {
  name: 'PosturasIniciales',
  components: {
    PageTitle,
  },
  data() {
    return {
      proveedorSeleccionado: null,
      searchText: '',
      searchArticulo: '',
      mostrarBuscador: false,
      articulosSelected: [],
      removerSelected: [],
      cotizarArticulos: [],
      enviandoEste: 0,
      headers: [
        { text: 'Clave Int.', sortable: true, value: 'articulo.clave_interna' },
        { text: 'Nombre', sortable: true, value: 'articulo.nombre' },
      ],
      headersPosturas: [
        { text: 'Clave Int.', sortable: true, value: 'clave_interna' },
        { text: 'Nombre', sortable: true, value: 'nombre' },
        {
          text: 'Precio', sortable: false, value: 'precio', width: '30%',
        },
        // { text: '', sortable: false, value: 'acciones' },
      ],
    };
  },
  mounted() {

  },
  methods: {
    ...mapActions('adquisiciones', ['posturaInicial']),
    enviar(data) {
      this.enviandoEste = data.id;
      const importe = ((data.cantidad || 0) * (data.precio_unitario || 0));
      const precioUnitario = parseFloat(data.precio_unitario);
      const cotizacion = {
        id_proveedor: this.proveedorSeleccionado,
        id_adquisicion_articulo: data.id,
        precio_unitario: precioUnitario,
        por_iva: 0,
        iva: 0,
        importe,
        iva_importe: 0,
        caracteristicas: data.caracteristicas,
        total: precioUnitario,
        gran_total: importe,
        declina_participar: false,
        es_postura_inicial: true,
      };

      this.posturaInicial({ cotizacion })
        .then(() => {
          this.cotizarArticulos = this.cotizarArticulos
            .filter(item => item.id !== cotizacion.id_adquisicion_articulo);
          this.enviandoEste = 0;
          const respuesta = new Mensajes(null).success;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        })
        .catch((err) => {
          this.enviandoEste = 0;
          const respuesta = !err.response || err.response.status >= 500
            ? new Mensajes('Error al comunicarse con el servidor 500').error
            : new Mensajes(err.response.data.msg).warning;
          this.$store.commit('settings/generales/MOSTRAR_RESPUESTA', {
            respuesta,
          });
        });
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
    agregarArticulos() {
      if (this.articulosSelected.length === 0) return;
      this.articulosSelected.forEach((item) => {
        const datos = {
          id: item.id,
          clave_interna: item.articulo.clave_interna,
          nombre: item.articulo.nombre,
          precio_unitario: null,
          cantidad: item.cantidad,
          esNuevo: true,
          es_postura_inicial: true,
        };
        this.cotizarArticulos.unshift(datos);
      });
    },
    removerArticulos() {
      const idsArticulosNuevos = this.removerSelected
        .filter(item => item.esNuevo).map(item => item.id);
      this.cotizarArticulos = this.cotizarArticulos
        .filter(item => !idsArticulosNuevos.includes(item.id));

      const cotizaciones = this.removerSelected
        .filter(item => !item.esNuevo && item.es_postura_inicial)
        .map(item => ({
          idCotizacion: item.idCotizacion,
          idArticulo: item.id,
        }));
      if (cotizaciones.length === 0) {
        this.removerSelected = [];
        return;
      }

      const removerCotizacionArticulos = cotizaciones.map(item => item.idCotizacion);
      this.axios.post('/proveedor/adquisicion/eliminar-cotizaciones', { removerCotizacionArticulos })
        .then(() => {
          this.removerSelected = [];

          const removerIds = {
            idAdquisicion: Number(this.$route.params.id),
            cotizaciones,
          };
          this.$store.commit('adquisiciones/BORRAR_ARTICULO_COTIZACION', removerIds);
        })
        .catch((err) => {
          // this.enviando = false;

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
      getAdq: 'adquisiciones/adquisicion',
    }),
    getAdquisicion() {
      return this.getAdq(Number(this.$route.params.id));
    },
    getParticipantes() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.participantes.map(item => item.proveedor);
    },
    listadoArticulos() {
      if (!this.getAdquisicion) return [];
      const idsArticulos = this.misArticulos.map(item => item.id);
      return this.getAdquisicion.articulos.filter((item) => {
        if (idsArticulos.includes(item.id)) return false;
        if (!this.searchText) return item;
        const expt = new RegExp(this.searchText, 'gi');
        return (
          expt.test(item.articulo.clave_interna || '')
          || expt.test(item.articulo.nombre)
          || expt.test(item.caracteristicas)
          || expt.test(item.articulo.presentacion)
        );
      });
    },
    getProveedorPosturasIniciales() {
      if (!this.getAdquisicion) return [];
      return this.getAdquisicion.articulos
        .filter(item => item.cotizaciones.length > 0)
        .map((item) => {
          const cotizaciones = [];
          item.cotizaciones.forEach((elem) => {
            if (elem.id_proveedor === this.proveedorSeleccionado) {
              const datos = {
                id: item.id,
                clave_interna: item.articulo.clave_interna,
                nombre: item.articulo.nombre,
                precio_unitario: elem.precio_unitario,
                cantidad: item.cantidad,
                esNuevo: false,
                idCotizacion: elem.id,
                es_postura_inicial: elem.es_postura_inicial,
              };
              cotizaciones.push(datos);
            }
          });
          return cotizaciones;
        })
        .flat(2);
    },
    misArticulos() {
      const idsArticulos = this.getProveedorPosturasIniciales.map(item => item.id);
      const cotizarArticulosFiltro = this.cotizarArticulos
        .filter(item => !idsArticulos.includes(item.id));
      return [...this.getProveedorPosturasIniciales, ...cotizarArticulosFiltro];
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
