import { axle } from '@/api/axle'
import { ref } from 'vue'
const { axios } = axle
export const usePost = (requestFormat = 'postUrlEncode') => {

    let loading = ref(false)
    let data = ref(null)
    let code = ref(null)
    let message = ref(null)
    const sendRequest = async (url, params, callBack) => {
        try {
            loading.value = true
            const { data: response, code: responseCode, message: responseMessage } = await axle[requestFormat](url, params)

            code.value = responseCode
            if (responseCode === 0) {
                data.value = response
                message.value = responseMessage
            }
            loading.value = false
        }
        catch {
            loading.value = false
            callBack && callBack()
        }



    }
    return {
        loading,
        data,
        code,
        message,
        sendRequest
    }
}