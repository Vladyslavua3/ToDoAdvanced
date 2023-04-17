import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '100d0932-3043-4bc6-924b-e072bdf31f60'
    }
}
export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})