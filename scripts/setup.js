const yaml = require("yaml")
const fs = require("fs");
const path = require("path");

require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it is working



const config = {
    TYPE: process.env.type == "bap" ? "BAP" : "BPP",
    "domain": process.env.DOMAIN,
    "port": parseInt(process.env.PORT),
    "gateway": {
        "uri": "https://gateway.becknprotocol.io/bg",
        "registry_uri": "https://registry.becknprotocol.io/subscribers"
    },
    "app": {
        "id": process.env.APP_ID,
        "unique_id": process.env.APP_UNIQUE_ID,
        "uri": process.env.APP_URI,
        "ttl": "PT10M",
        "city": "std:080",
        "country": "IND",
        "public_key": process.env.APP_PUBLIC_KEY,
        "private_key": process.env.APP_PRIVATE_KEY,
    }
}



if(config.TYPE === "BAP") {
    const bap_path = path.resolve("config", "bap.yaml");
    fs.writeFileSync(bap_path, yaml.stringify(config));
}else{
    const bpp_path = path.resolve("config", "bpp.yaml");
    fs.writeFileSync(bpp_path, yaml.stringify(config));
}