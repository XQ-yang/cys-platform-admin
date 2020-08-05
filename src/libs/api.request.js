import HttpRequest from '@/libs/axios'
const axios = new HttpRequest(process.env.VUE_APP_BASE_API_URL)
export default axios
