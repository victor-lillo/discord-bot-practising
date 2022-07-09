//Añadir puntos
//Contar los 10 primeros
//Dar permisos a esos 10 primeros
const fs = require('fs');
const path = require('path');

const jsonUrl = path.join(__dirname, 'ranking.json')
const jsonUrl_old = path.join(__dirname, 'ranking-old.json')
const rankingJson = require(jsonUrl)

const { winners_number } = require(path.join(__dirname, '..', '..', 'config.json'))

const rankingJson_creator = () => {
    //Si no existe el ranking.json, lo creamos
    if (!fs.existsSync(jsonUrl)) {
        fs.writeFileSync(jsonUrl, JSON.stringify({}))
    }
}

const rankingPoints = (userID, userName, points) => {

    //Si no tiene propiedad ID, lo crea
    if (!rankingJson.hasOwnProperty(userID)) rankingJson[userID] = {}

    //Modificamos nombre y puntos
    rankingJson[userID].name = userName
    rankingJson[userID].points = (rankingJson[userID].points ?? 0) + points
    // rankingJson[userID].date = new Date()

    const dateado = JSON.stringify(rankingJson);
    fs.writeFileSync(jsonUrl, dateado);

}

//Retorna un item aleatorio del array
const singleWinner = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

//Retorna number items aleatorios del array, sin duplicar
const multipleWinners = (array, number) => {

    let winners = []

    //Creamos el array de ganadores, sin duplicados
    while (winners.length < number) {
        // winners.push(array[Math.floor(Math.random() * array.length)])
        winners.push(`<@${array[Math.floor(Math.random() * array.length)]}>`)
        //Eliminamos duplicados
        winners = [...new Set(winners)];
    }

    //En el último lo guardamos como "and + id"
    winners[winners.length - 1] = 'and ' + winners[winners.length - 1]

    return winners
}

const giveaway = (period) => {

    const participations = []

    //Almacenamos los IDs según su cantidad de participaciones
    for (el in rankingJson) {
        //el = id
        for (let index = 0; index < rankingJson[el].points; index++) {
            participations.push(el)
        }
    }

    // console.log(`The winner is ${rankingJson[winner(participations)].name}, with id ${winner(participations)}`);

    if (period === "weekly") {
        return multipleWinners(participations, winners_number)
    }

    else if (period === "monthly") {
        //Limpiamos json
        //TODO ACTIVAR ESTA LÍNEA
        fs.writeFileSync(jsonUrl, '{}');

        //Guardamos copia de seguridad del último
        fs.writeFileSync(jsonUrl_old, JSON.stringify(rankingJson));

        return singleWinner(participations)
    }
}

exports.rankingJson_creator = rankingJson_creator
exports.rankingPoints = rankingPoints
exports.giveaway = giveaway