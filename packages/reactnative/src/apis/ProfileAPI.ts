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

class ProfileAPI {
    async createProfile(body: ProfileCreationDataType){
        const {data} = await axios.post(`${domain}/create_profile`, body)

        return data
    }
}

export default new ProfileAPI()