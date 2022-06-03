import Vue from 'vue';

Vue.filter('Nombrefiltro', parametro => parametro.toUpperCase());
Vue.filter('EstatusRequisicion', (estatus) => {
  switch (estatus) {
    case 0: return 'Solicitada';
    case 1: return 'Autorizada';
    case 2: return 'En compras';
    default:
      break;
  }
  return '';
});

Vue.filter('DosDigitos', (value) => {
  if (value.toString().length <= 1) {
    return `0${value.toString()}`;
  }
  return value.toString();
});
