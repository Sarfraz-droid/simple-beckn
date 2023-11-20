# Simple Beckn - ODR Integration

>Only for development and testing purposes.



## How to run

Node Version tested: `v16.20.0`

#### Prerequisites

- Clone the repository
- Setup Configurations
  - Copy the `bpp.example.yaml` and rename to `bpp.yaml` if you are running the bpp
  - Copy the `bap.example.yaml` and rename to `bap.yaml` if you are running the bap
  - Update the **yaml** files with the correct values.
  - Either run your redis server at `localhost:6379` or add your REDIS_HOST & REDIS_PORT in .env file.

#### Exposing the port
- If you are running the bpp, expose the port `3000` and if you are running the bap, expose the port `3001`.
- Install localtunnel globally `npm install -g localtunnel`
- Run `lt --port 3000 --subdomain <your-local-tunnel-subdomain>`.
If you are running the bpp and `lt --port 3001 --subdomain <your-local-tunnel-subdomain>` if you are running the bap.

#### Installing and Running
- Run `npm install` or `yarn`
- To run the bap run `npm run dev:bap` or  and to run the bpp run `npm run dev:bpp`.
- Make sure that your local tunnel is running.


## How to test
Either you can run the bpp and bap and test the integration or you can use the postman collection to test the integration.

#### Postman Collection

- Import the postman collection from `ODR.postman_collection.json` file.



---

## Running the BAP

You can setup your postman collection from the `ODR.postman_collection.json` file.

You can find a list of all the endpoints in the BAP. You can use the postman collection to test the endpoints.

Update the body of the request with the correct values.

For example
```json
{
    "message": { // this is my message body for beckn request
        "intent": {
            "category": {
                "descriptor": {
                    "code": "arbitration-service"
                }
            }
        }
    },
    "bpp_id": "presolv360.pulse.bpp", // this is my context.bpp_id
    "bpp_uri": "https://pulse-nonprod.presolv360.com", // this is my context.bpp_uri 
    "transaction_id": "8d075ee4-72ae-40e7-abdf-ee620d78254c" // this is my context.transaction_id [Optional]
}
```

## Running the BPP

While running the BPP, you can copy and paste the mock responses of /on_search /on_select etc, at `sample/bpp/response.[action].json` files.