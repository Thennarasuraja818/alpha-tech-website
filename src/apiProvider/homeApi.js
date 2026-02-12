import apiClient from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';

class homeApi {

    async bannerList(input) {
        // const params = {
        //     page: input.page || 0,
        //     limit: input.limit || 100,
        //     search: input.search || "",
        // };
        try {
            const response = await apiClient.get('/banner')

            if (response.status == 200 || response.status == 201) {
                return {
                    response: response.data,
                    status: true
                }
            } else {
                toast(response.data?.message)
                return {
                    status: false,
                    response: []
                }
            }
        } catch (error) {
            console.log("error :", error);
            toast(error?.response?.data?.message)
            return {
                response: [],
                status: false
            }
        }
    }

    async categoryList(input) {
        try {
            const response = await apiClient.get('/categories')

            if (response.status == 200 || response.status == 201) {
                return {
                    response: response.data,
                    status: true
                }
            } else {
                toast(response.data?.message)
                return {
                    status: false,
                    response: []
                }
            }
        } catch (error) {
            console.log("error :", error);
            toast(error?.response?.data?.message)
            return {
                response: [],
                status: false
            }
        }
    }

    async subCategoryList(input) {
        try {
            const response = await apiClient.get('/subcategories')

            if (response.status == 200 || response.status == 201) {
                return {
                    response: response.data,
                    status: true
                }
            } else {
                toast(response.data?.message)
                return {
                    status: false,
                    response: []
                }
            }
        } catch (error) {
            console.log("error :", error);
            toast(error?.response?.data?.message)
            return {
                response: [],
                status: false
            }
        }
    }

    async childCategoryList(params) {
        try {

            const response = await apiClient.get('/child-categories', { params })

            if (response.status == 200 || response.status == 201) {
                return {
                    response: response.data,
                    status: true
                }
            } else {
                toast(response.data?.message)
                return {
                    status: false,
                    response: []
                }
            }
        } catch (error) {
            console.log("error :", error);
            toast(error?.response?.data?.message)
            return {
                response: [],
                status: false
            }
        }
    }


    async ProductList(input) {
        try {
            const response = await apiClient.get('/product/list/dtls/', {
                params: input
            })

            if (response.status == 200 || response.status == 201) {
                return {
                    response: response.data,
                    status: true
                }
            } else {
                toast(response.data?.message)
                return {
                    status: false,
                    response: []
                }
            }
        } catch (error) {
            console.log("error :", error);
            toast(error?.response?.data?.message)
            return {
                response: [],
                status: false
            }
        }
    }

}

const HomeApi = new homeApi()
export default HomeApi
