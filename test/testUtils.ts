export function getDataMenos30Dias() {
    const dataAtual = new Date();
    const dataMenos30Dias = new Date(dataAtual.getTime() - 31 * 24 * 60 * 60 * 1000);

    return dataMenos30Dias;
}

export function getDataMenosDias(dias) {
    const dataAtual = new Date();
    const dataMenosDias = new Date(dataAtual.getTime() - dias * 24 * 60 * 60 * 1000);

    return dataMenosDias;
}

