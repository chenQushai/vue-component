
import { axle } from '@/api/axle'
import { ref } from 'vue'
export const useModal = () => {

    let visible = ref(false)
    let formNode = ref(null)
    let loading = ref(false)
    const cancel = () => {
        formNode.value?.resetFields()
        visible.value = false
    }

    const submitForm = async ({ url, params, callback }) => {
        console.log(url)
        if (!url) {
            return
        }
        try {
            await formNode.value.validateFields()
            loading.value = true
            const { data: response, code } = await axle.postUrlEncode(url, params)
            loading.value = false
            if (code === 0) {
                cancel()
                callback()
            }
        }
        catch {
            loading.value = false
        }



    }
    return {
        formNode,
        visible,
        loading,
        cancel,
        submitForm
    }
}