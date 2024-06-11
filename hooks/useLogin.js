import { axle } from '@/api/axle'
import { ref } from 'vue'
const { axios } = axle
export const usePostFormData = () => {

    let loading = ref(false)
    let data = ref(null)
    let code = ref(null)
    let headers = ref('')
    const sendRequest = async (url, params) => {

        try {
            loading.value = true
            const { data: response, code: responseCode, headers: header } = await axle.post(url, params)
            loading.value = false
            headers.value = header
            if (responseCode === 0) {
                code.value = responseCode
                data.value = response
            }
        }
        catch {
            loading.value = false
        }
    }
    return {
        loading,
        data,
        code,
        headers,
        sendRequest
    }
}