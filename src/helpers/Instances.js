import Vue from 'vue';

Vue.prototype.$checkLocalStore = () => {
  const prueba = 'valor';
  try {
    localStorage.setItem(prueba, prueba);
    localStorage.removeItem(prueba);
    return true;
  } catch (e) {
    return false;
  }
};

Vue.prototype.$range = (inicio, final) => (
  new Array((final - inicio) + 1)).fill(undefined).map((_, i) => i + inicio);

Vue.prototype.$ejercicioActual = () => Number((new Date()).getFullYear());

Vue.prototype.$scrollTop = () => {
  const element = document.getElementById('app');
  const top = element.offsetTop;
  window.scrollTo(0, top);
};

Vue.prototype.$compararFechas = (fechaUno, fechaDos) => new Date(fechaUno) > new Date(fechaDos);

Vue.prototype.$parseDate = (fecha, split, format) => {
  if (!fecha) return null;

  const [year, mes, dia] = fecha.split(split);
  return `${dia.padStart(2, '0')}${format}${mes.padStart(2, '0')}${format}${year}`;
};

Vue.prototype.$fechaDiffDias = (fechaMenor, fechaMayor) => {
  const fechaUno = new Date(fechaMenor);
  const fechaDos = new Date(fechaMayor);

  if (!fechaUno) return 0;
  if (!fechaDos) return 0;

  return Number((fechaDos - fechaUno) / (1000 * 60 * 60 * 24));
};
Vue.prototype.$fecha = () => ({
  init(fechaMenor, fechaMayor) {
    this.fechaUno = new Date(fechaMenor) || new Date();
    this.fechaDos = new Date(fechaMayor) || new Date();
  },
  comparar() {
    return this.fechaDos > this.fechaUno;
  },
  diffEnDias() {
    if (!this.comparar()) return 0;
    return Number((this.fechaDos - this.fechaUno) / (1000 * 60 * 60 * 24));
  },
  parse(split, format) {
    const [year, mes, dia] = this.fechaUno.split(split);
    return `${dia.padStart(2, '0')}${format}${mes.padStart(2, '0')}${format}${year}`;
  },
  parseEng(fecha) {
    return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
  },
  diasEnUnMes(ejercicio, mes) {
    return new Date(ejercicio, mes, 0).getDate();
  },
  agregarDias(fecha, dias) {
    const resultado = new Date(fecha) || new Date();
    return resultado.setDate(resultado.getDate() + dias);
  },
});

Vue.prototype.$sum = () => ({
  obj(obj, campo) {
    let total = 0;
    if (!Array.isArray(obj)) return 0;
    obj.forEach((item) => {
      total += parseFloat(item[campo]) || 0;
    });

    return total;
  },
  array(obj) {
    if (!obj) return 0;
    return obj.reduce(
      (anterior, actual) => (parseFloat(anterior) || 0) + (parseFloat(actual) || 0),
      0,
    );
  },
});

Vue.prototype.$multiplicar = (a, b) => parseFloat(a) * parseFloat(b);

Vue.prototype.$hasProp = (obj, campo) => campo in obj;

Vue.prototype.$ObjSumar = (obj, campo) => {
  let total = 0;
  if (!Array.isArray(obj)) return false;

  obj.forEach((item) => {
    total += parseFloat(item[campo]) || 0;
  });

  return total;
};

Vue.prototype.$sumar = (obs) => {
  if (obs) {
    return obs.reduce(
      (anterior, actual) => (parseFloat(anterior) || 0) + (parseFloat(actual) || 0),
      0,
    );
  }
  return 0;
};

Vue.prototype.$archivoValido = (archivo, ext) => {
  const re = /(?:\.([^.]+))?$/;

  if (!archivo) return false;
  if (!ext) return false;

  return re.exec(archivo)[1] === ext;
};

Vue.prototype.$randomColor = () => `#${(`${Math.random().toString(16)}000000`).substring(2, 8)}`;

Vue.prototype.$humanFileSize = (size) => {
  if (size <= 0) return 0;
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / (1024 ** i)).toFixed(2) * 1} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

Vue.prototype.$objToArray = objeto => Object.keys(objeto).map((item) => {
  const nameKey = {};
  nameKey[item] = objeto[item];
  return nameKey;
});

Vue.prototype.$objToArrKeyName = (objeto, agruparPor) => Object.keys(objeto).map((item) => {
  const nameGroup = {};
  const nameKey = {};
  nameKey[item] = objeto[item];
  nameGroup[agruparPor] = {
    nombre: item,
    grupos: nameKey[item],
  };
  return nameGroup;
});
