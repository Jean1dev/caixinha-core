export function getDataMenos30Dias() {
    var dataAtual = new Date();
    var dataMenos30Dias = new Date(dataAtual.getTime() - 31 * 24 * 60 * 60 * 1000);

    return dataMenos30Dias;
}

export function getDataMenosDias(dias) {
    var dataAtual = new Date();
    var dataMenosDias = new Date(dataAtual.getTime() - dias * 24 * 60 * 60 * 1000);

    return dataMenosDias;
}

