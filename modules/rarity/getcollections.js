const fs = require('fs');
const path = require('path');

const getCollectionList = () => {

    // __dirname + '../../rarity-checker/results/raw'
    const ruta = path.join(__dirname, '..', '..', '..', 'rarity-checker', 'results', 'raw')
    // console.log(ruta);

    //Sacamos los .json de results
    const collectionList = fs.readdirSync(ruta).filter(file => file.endsWith('.json'));

    const list = []

    for (const element of collectionList) {
        list.push(element.slice(0, -5))
    }

    // console.log(list);
    return list

}
// getCollectionList()

const getCollectionHTML = async (list) => {

    const ruta = path.join(__dirname, 'assets', 'collections')

    //Leemos el txt
    const txt = await fs.readFileSync(ruta + '.txt', 'utf-8')

    var text = ''

    //Cogemos cada item de la lista y lo usamos para generar el HMTL
    for (const element of list) {
        text += `  <div class="list_item">
        <div class="number">${list.indexOf(element) + 1}</div>
        <a class="name" href="https://opensea.io/collection/${element}" target="_blank"> ${element} </a>\n</div>`
    }

    //Añadimos ese HTML generado al documento plantilla
    const html = txt.replace('{elemento-lista}', text)

    //Escribimos el HTML
    fs.writeFileSync(ruta + '.html', html);

}


exports.getCollectionList = getCollectionList
exports.getCollectionHTML = getCollectionHTML

