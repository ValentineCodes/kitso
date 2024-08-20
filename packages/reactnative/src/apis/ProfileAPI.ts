import axios from "axios";

import { domain } from ".";

interface ProfileCreationDataType {
    lsp3DataValue: {
        verification: {
            method: string;
            data: string;
        },
        url: string;
    };
    mainController: string;
    universalReceiverAddress: string;
}

interface ProfileCreationResponse {
    universalProfileAddress: string;
    keyManagerAddress: string;
}

class ProfileAPI {
    async createProfile(body: ProfileCreationDataType): Promise<ProfileCreationResponse>{
        const {data} = await axios.post(`${domain}/auth/create_profile`, body, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        return data
    }
}

export default new ProfileAPI()