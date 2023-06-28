import fs from 'fs'
import YAML from 'yaml'
const args = process.argv;

export const config = YAML.parse(fs.readFileSync(`./config/${args[2]}.yaml`, 'utf8'))
export const mode = args[2]