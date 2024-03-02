import axios from 'axios'
import md5 from 'md5'
import moment from 'moment'

export const instanceAxios = axios.create({
        baseURL: import.meta.env.VITE_APP_API_URL,
        headers: {
            'X-Auth': md5(`${import.meta.env.VITE_APP_API_KEY}_${moment().utc().format('YYYY-MM-DD').split('-').join('')}`),
            'content-type': 'application/json'
        }
    }
)
