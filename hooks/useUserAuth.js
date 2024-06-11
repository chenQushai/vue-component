import { axle } from '@/api/axle'
import { getUserPageFeature } from '@/api/user.js'
import { ref } from 'vue'
export const useUserAuth = () => {

    let pageBtn = ref([])
    const getUserPageBtn = async (routeId) => {
        const { data } = await axle.get(getUserPageFeature, {
            nbpId: routeId
        })
        pageBtn.value = data
    }

    return {
        getUserPageBtn
    }
}