import fs from 'fs'

export function getDataMais30Dias() {
    const dataAtual = new Date();
    const dataMenos30Dias = new Date(dataAtual.getTime() + 30 * 24 * 60 * 60 * 1000);

    return dataMenos30Dias;
}

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

export function writeOut(content) {
    const asJson = JSON.stringify(content, null, 2);
    fs.writeFileSync('output.json', asJson);
}
