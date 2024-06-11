import { axle } from "@/api/axle";
import { ref } from "vue";

export const useGet = () => {
    let loading = ref(false)
    let data = ref('')
    let code = ref(null)
    let headers = ref('')
    const sendGetRequest = async (url, params) => {
        loading.value = true
        try {
            const { data: response, code: responseCode, headers: header } = await axle.get(url, params)
            headers.value = header
            loading.value = false
            // if (responseCode === 0) {
            data.value = response
            code.value = responseCode
            // }
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
        sendGetRequest
    }
}