import fs from 'fs'
import YAML from 'yaml'
import path from "path"
const args = process.env.NODE_ENV == "production" ? process.env.type : process.argv[2];

const configPath = path.resolve('config', `${args}.yaml`);
console.log(`Loading config for ${args} at ${configPath}`)



export const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))
export const mode = args