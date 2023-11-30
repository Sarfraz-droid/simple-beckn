import path from "path";
import { config } from "@/config";
import axios from "axios";
import { BECKN_PROVIDER } from "@/utils/constant";
import { recordNREvent } from "@/logger/relic";

export const subscriberLookup = async () => {
    try {
        console.log("Looking up for subscribers")
        const url = path.join(config.gateway.registry_uri, "lookup");
        
        const body = {
            "type": config.TYPE == BECKN_PROVIDER.BAP ? BECKN_PROVIDER.BPP : BECKN_PROVIDER.BAP,
            "domain": config.domain
        }
        
        recordNREvent("subscriberLookup", {
            ...body,
            url            
        })

        const response = await axios.post(url, body);

        console.log("Subscribers found: ", response.data.length);

        return response.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};
