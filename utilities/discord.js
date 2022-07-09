const axios = require('axios');
require('dotenv').config()

//Webhook private
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const DISCORD_WEBHOOK_RARITY = process.env.DISCORD_WEBHOOK_RARITY



const discordNotification = (collectionName, collectionURL, imgURL, itemNumber) => {

    axios.post(
        DISCORD_WEBHOOK_URL,
        JSON.stringify(
            {
                // the username to be displayed
                username: 'XXXXXXXX Tools',
                // the avatar to be displayed
                avatar_url:
                    'https://i.ibb.co/5WsCVxZ/Leviatan.png',

                // embeds to be sent
                embeds: [
                    {
                        timestamp: new Date(),
                        // decimal number colour of the side of the embed
                        color: 9181340,
                        // author: {
                        //     name: 'Nombre autor'
                        // },
                        // embed title
                        // - link on 2nd row
                        title: `"${collectionName}" rarity obtained!`,
                        url: collectionURL,

                        thumbnail: {
                            url:
                                imgURL || "Failed to get imgURL",
                        },

                        fields: [
                            {
                                name: 'Number of items',
                                value: itemNumber || "Failed to get number of items",
                                inline: true
                            },
                            //     {
                            //         name: 'Price',
                            //         value: price || "Failed to get price",
                            //         inline: true
                            //     },
                        ],

                        // footer
                        // - icon next to text at bottom
                        footer: {
                            text: 'XXXXXXXX Tools',
                            icon_url:
                                'https://i.ibb.co/5WsCVxZ/Leviatan.png',
                        },
                    },
                ],
            }
        ),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }

    )

}


const discord_rarityID = (nftname, nft_url, token_id, image_url, fieldCollection) => {

    axios.post(
        DISCORD_WEBHOOK_RARITY,
        JSON.stringify(
            {
                // the username to be displayed
                username: 'XXXXXXXX Tools Rarity Checker',
                // the avatar to be displayed
                avatar_url:
                    'https://i.ibb.co/5WsCVxZ/Leviatan.png',

                // embeds to be sent
                embeds: [
                    {
                        timestamp: new Date(),
                        // decimal number colour of the side of the embed
                        color: 15637248,
                        // author: {
                        //     name: 'Nombre autor'
                        // },
                        // embed title
                        // - link on 2nd row
                        title: `${nftname}`,
                        description: '`ID: ' + token_id + '`',
                        url: nft_url,

                        thumbnail: {
                            url:
                                image_url || "Failed to get imgURL",
                        },

                        fields:
                            fieldCollection

                        //     {
                        //         name: 'Price',
                        //         value: price || "Failed to get price",
                        //         inline: true
                        //     },
                        ,

                        // footer
                        // - icon next to text at bottom
                        footer: {
                            text: 'XXXXXXXX Tools Rarity Checker',
                            icon_url:
                                'https://i.ibb.co/5WsCVxZ/Leviatan.png',
                        },
                        // image: {
                        //     url: image_url,
                        // }
                    },
                ],
            }
        ),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}

const discordScriptRunning = () => {
    axios.post(
        DISCORD_WEBHOOK_URL,
        JSON.stringify(
            {
                // the username to be displayed
                username: 'XXXXXXXX Tools',
                // the avatar to be displayed
                avatar_url:
                    'https://i.ibb.co/5WsCVxZ/Leviatan.png',

                // embeds to be sent
                embeds: [
                    {
                        timestamp: new Date(),
                        // decimal number colour of the side of the embed
                        color: 65413,
                        // author: {
                        //     name: 'Nombre autor'
                        // },
                        // embed title
                        // - link on 2nd row
                        title: "Script running",
                        description: "discord-tools/index.js 🟢",
                        // url:
                        // 'https://blablabla',

                        // thumbnail: {
                        //     url:
                        //         imgURL || "Failed to get imgURL",
                        // },

                        fields: [
                            //     {
                            //         name: 'Site',
                            //         value: site,
                            //         inline: true
                            //     },
                            //     {
                            //         name: 'NFT name',
                            //         value: nftname || "Failed to get name",
                            //         inline: true
                            //     },
                            //     {
                            //         name: 'Price',
                            //         value: price || "Failed to get price",
                            //         inline: true
                            //     },
                        ],

                        // footer
                        // - icon next to text at bottom
                        footer: {
                            text: 'XXXXXXXX Tools ',
                            icon_url:
                                'https://i.ibb.co/5WsCVxZ/Leviatan.png',
                        },
                    },
                ],
            }
        ),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
};


// discord_rarityID(collectionData)

exports.discord_rarityID = discord_rarityID
exports.discordScriptRunning = discordScriptRunning
// exports.sleep = sleep
// exports.msToMinAndSecs = msToMinAndSecs
// exports.msToTime = msToTime
