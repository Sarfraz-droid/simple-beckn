### Simple Beckn Implementation

Simplified version of Beckn Protocol for the purpose of understanding the protocol and its implementation.

Only for development and testing purposes.

Currently only supports `nic2004:60212` domain and the following endpoints.

- /search
- /select


> NOTE : Other endpoints are in development

### How to run

- Clone the repository
- Setup Configurations
  - Copy the `bpp.example.yaml` and rename to `bpp.yaml`
  - Copy the `bap.example.yaml` and rename to `bap.yaml`
  - Update the yaml files with the correct values
    - Follow the https://github.com/beckn/protocol-server/blob/v2-0.9.4-fix/setup.md to setup the configuration
- Port Tunneling is automatically defined using localtunnel. Specify the tunnel subdomain in the yaml files to specify your subdomain
- Run `npm install`
- To run the bap run `npm run dev:bap` and to run the bpp run `npm run dev:bpp`