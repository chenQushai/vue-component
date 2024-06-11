
import { axle } from "@/api/axle";
import { ref, onBeforeMount } from "vue";

export const useGetPlus = (url, params) => {
    let loading = ref(false)
    let data = ref('')
    let code = ref(null)
    let headers = ref('')
    const sendGetRequest = async () => {
        loading.value = true
        try {
            const { data: response, code: responseCode, headers: header } = await axle.get(url, params)
            headers.value = header
            loading.value = false
            if (responseCode === 0) {
                data.value = response
                code.value = responseCode
            }
        }
        catch {
            loading.value = false
        }
    }

    onBeforeMount(() => {
        sendGetRequest()
    })

    return {
        loading,
        data,
        code,
        headers
    }
}