const fs = require('fs');
const path = require('path')
const { discord_rarityID } = require('../../utilities/discord');
const { html_cap } = require('../../config.json');

const parseCollectionReference = (input) => {
    //Si es una url
    if (input.includes('https://opensea.io/collection')) {
        //Si tiene filtros
        if (input.includes('?')) {
            return input.slice(30).split('?')[0]
        } else return input.slice(30)
    }
    //Si es una slug
    else {
        return input
    }
}


const getJson = async (collectionReference) => {
    try {
        //Si es una url

        // const ruta = path.join(__dirname, '..', '..', '..', 'rarity-checker', 'results', 'raw')s
        return data = await require(path.join(__dirname, '..', '..', '..', 'rarity-checker', 'results', 'raw', + collectionReference + '.json'))
    }

    //Si no encuentra json, colección no encontradas
    catch (error) {
        return 'Collection not found'
    }
}

const getNFTbyID = async (collectionReference, token_id) => {
    class Field {
        constructor(name, value, inline) {
            this.name = name
            this.value = value
            this.inline = inline
        }
    }

    const collectionData = []

    const json = await getJson(parseCollectionReference(collectionReference))

    //Si no encontramos colección, primer return
    if (json === 'Collection not found') return [null, null, 'Collection not found']

    try {
        collectionData.push(new Field("\u200b", "\u200b", true))
        collectionData.push(new Field("🏆 RANK 🏆", `${json[token_id].rank} / ${json.rarity_ranking.length}`, true))
        collectionData.push(new Field("\u200b", "\u200b", true))

        //Recorremos traits
        for ([traitName, traitValue] of Object.entries(json[token_id].traits)) {
            // sword >> Steel cuyo valor es 1312
            // console.log(`${traitName} >>cuyo valor es  ${traitValue} (${json[token_id].rarity-score[traitName]} puntos)`);

            collectionData.push(new Field(traitName, traitValue + ' (' + json[token_id].rarity_score[traitName].toFixed(2) + ' points)', true))
        }

        //Pusheamos el total
        collectionData.push(new Field('Total 📋', json[token_id].rarity_score.TOTAL.toFixed(2) + ' points', true))

        // 📊📋

        // await discord_rarityID(nftName, nftURL, id, imgURL, fieldCollection)
        // await discord_rarityID(json[token_id].name, json[token_id].permalink, token_id, json[token_id].image_url, collectionData)

        return [
            json[token_id].name, //nftName
            json[token_id].permalink, //nftURL
            token_id, //id
            json[token_id].image_url, //imgURL
            collectionData //field traits
        ]
    }
    //Si error, mal token_id
    catch (error) {
        return [null, null, "Wrong ID"]
    }
}


const getRank = async (collectionReference, rank_position) => {


    const json = await getJson(parseCollectionReference(collectionReference))

    //Si no encontramos colección, primer return
    if (json === "Collection not found") return "Collection not found"

    try {
        //Cogemos el array rarity-ranking y sacamos su posicion
        const token_id = json.rarity_ranking[rank_position - 1][1]
        // console.log(token_id);
        return token_id


    } catch (error) {
        // console.log(error.name);
        // console.log(error.message + '\n');

        return "Wrong rank number"

    }
}


//getTop() devuelve objeto del top X rareza de una colección y el json completo (para sacar el permalink)
// '1': {
//     name: 'NFT Lion #14',
//     id: '10962017699446456',
//     score: '832.18'
// }

const getTop = async (collectionReference, top) => {

    const collectionParsed = parseCollectionReference(collectionReference)

    const json = await getJson(collectionParsed)

    //Si no encontramos colección, primer return
    if (json === "Collection not found") return "Collection not found"

    try {
        //Cogemos el array rarity-ranking y sacamos su posicion
        const rarity_ranking = json.rarity_ranking

        const obj = {}
        //Retorna objeto recorriendo rarity-ranking. Desde start hasta end (incluidos)
        const objFromRarity = (start, end) => {
            for (let index = start - 1; index < end; index++) {
                const element = rarity_ranking[index];
                // [0]name [1]id [2]score
                // console.log(element[0]);
                obj[index + 1] = {
                    "name": element[0],
                    "id": element[1].trim(),
                    "score": element[2].toFixed(2),
                    "permalink": json[element[1].trim()].permalink,
                }
            }
            return obj
        }

        //Sacamos los objetos de items en todos los casos
        //Si es un porcentaje
        if (top.endsWith('%')) {
            // Porcentaje del total de items

            //Si piden más de un 2000 items
            if (((top.slice(0, -1) / 100) * rarity_ranking.length) > html_cap) {

                return [
                    objFromRarity(1, 10 / 100 * rarity_ranking.length),
                    `${top.slice(0, -1)}% is not allowed. Here you have the **${(html_cap * 100 / rarity_ranking.length).toFixed(2)}% first ${collectionParsed} items** (maximum cap). Remember to open the file in your browser:`
                ]
            }
            //Si piden menos de un 10%
            else {
                return [
                    objFromRarity(1, top.slice(0, -1) / 100 * rarity_ranking.length),
                    `Here you have the **${top.slice(0, -1)}% first ${collectionParsed} items**. Remember to open the file in your browser:`
                ]
            }
        }

        //Si es rango num1-num2
        else if (top.includes('-')) {
            // top.split('-')[0] y [1]

            //Si el rango pedido es mayor de 2000, damos [numero de inicio pedido, +2000]
            if (parseInt(top.split('-')[1]) - parseInt(top.split('-')[0]) > html_cap) {

                return [
                    objFromRarity(parseInt(top.split('-')[0]), parseInt(top.split('-')[0]) + html_cap),
                    `A ${parseInt(top.split('-')[1]) - parseInt(top.split('-')[0])} length range is not allowed. Here you have the **${parseInt(top.split('-')[0])}-${parseInt(top.split('-')[0]) + html_cap} range of ${collectionParsed}** (maximum cap). Remember to open the file in your browser: `
                ]
            }
            //Si el rango pedido es menor de 2000
            else {
                return [
                    objFromRarity(top.split('-')[0], top.split('-')[1]),
                    `Here you have the ** ${top.split('-')[0]}-${top.split('-')[1]} range of ${collectionParsed} **.Remember to open the file in your browser: `
                ]
            }

        }

        //Si es un número
        else {
            //Si es mayor de 2000
            if (top > html_cap) {
                return [
                    objFromRarity(1, top),
                    `${top} is not allowed. Here you have the **${html_cap} ${collectionParsed} first items ** (maximum cap).Remember to open the file in your browser: `
                ]
            }
            //Si es menor de 2000
            else {
                return [
                    objFromRarity(1, top),
                    `Here you have the ** ${top} ${collectionParsed} first items **.Remember to open the file in your browser: `
                ]
            }
        }


    } catch (error) {
        // console.log(error.name);
        console.log(error);
        // console.log(error.message + '\n');

        return "Wrong top number"

    }
}

const testing = async () => {
    // const json1 = await require('../../rarity-checker/results/raw/nftlions.json')
    const numero = '10%'
    const obj = await getTop('nftlions', numero)
    console.log(typeof obj);
    console.log(obj);
    console.log(obj[0]);
    // console.log(json1);

}

// testing()


const getTopHTML = async (obj) => {

    const ruta = path.join(__dirname, 'assets', 'top')

    //Leemos el txt
    const txt = await fs.readFileSync(ruta + '.txt', 'utf-8')

    // Posicion // Nombre con enlace //Score
    var text = ''

    //Cogemos cada item de la lista y lo usamos para generar el HMTL
    for (const key in obj) {
        // console.log(key);
        // console.log(obj[key].name);
        // console.log(obj[key].score);
        // console.log(obj[key].permalink);

        // console.log(" ");

        text += `<div class="list_item">
         <div class="number">#${key}</div>
         <a class="name" href="${obj[key].permalink}" target="_blank">
         ${obj[key].name}
         </a>
         <div class="score"> [${obj[key].score} points] </div>
 </div> `

    }

    //Añadimos ese HTML generado al documento plantilla
    const html = txt.replace('{elemento-lista}', text)

    //Escribimos el HTML
    fs.writeFileSync(ruta + '.html', html);

}

// getRank('nftlions', 5)




exports.getNFTbyID = getNFTbyID
exports.getRank = getRank
exports.getTop = getTop
exports.getTopHTML = getTopHTML
