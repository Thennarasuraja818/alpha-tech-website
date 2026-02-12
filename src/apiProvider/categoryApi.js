import apiClient from "../network/apiClient";
import { ToastContainer, toast } from 'react-toastify';


const withTranslation = (apiFunction, translateFn) => {
    return async (...args) => {
        const result = await apiFunction(...args);
        if (result.status && translateFn) {
            return {
                ...result,
                response: await translateResponse(result.response, translateFn)
            };
        }
        return result;
    };
};

const translateResponse = async (data, translateFn) => {
    if (data.data && Array.isArray(data.data)) {
        const translatedItems = await Promise.all(
            data.data.map(async item => ({
                ...item,
                name: await translateFn(item.name)
            }))
        );
        return { ...data, data: translatedItems };
    }
    return data;
};

class CategoryProvider {
    getTranslatedCategoryList = (translateFn) => {
        return withTranslation(this.getCategoryList.bind(this), translateFn);
    };
    async getCategoryList(input) {
        try {
            const response = await apiClient.get(`category/get`);
            console.log("@@@@@@", response)
            const message = response.data?.message ?? "Something went wrong";
            if ((response.status == 200 || response.status == 201) && response) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                return { status: false, response: [] };
            }
        } catch (error) {
            return { status: false, response: [] };
        }
    }

    async getCategoryDet(id) {
        try {
            const response = await apiClient.get(`course/get-course-list/` + id);
            if ((response.status == 200 || response.status == 201) && response) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                return {
                    status: false,
                    response: []
                };
            }
        } catch (error) {
            return {
                status: false,
                response: []
            };
        }
    }

    async getCourseDet(id) {
        try {
            const response = await apiClient.get(`course/get-course/` + id);
            if ((response.status == 200 || response.status == 201) && response) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                return {
                    status: false,
                    response: []
                };
            }
        } catch (error) {
            return {
                status: false,
                response: []
            };
        }
    }
    async getCourseDet(id) {
        try {
            const response = await apiClient.get(`course/get-course/` + id);
            if ((response.status == 200 || response.status == 201) && response) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                return {
                    status: false,
                    response: []
                };
            }
        } catch (error) {
            return {
                status: false,
                response: []
            };
        }
    }



    async getReviewDet(id) {
        try {
            const response = await apiClient.get(`review/get-review/` + id);
            if ((response.status == 200 || response.status == 201) && response) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                return {
                    status: false,
                    response: []
                };
            }
        } catch (error) {
            return {
                status: false,
                response: []
            };
        }
    }





    async addReview(input) {
        try {
            const response = await apiClient.post("review/add", input);
            const message = response.data?.message ?? "Something went wrong";
            if (response.status == 200 || response.status == 201 && response) {
                // notification.showAlertNotification(response.data.message, true);
                toast(message);

                return {
                    status: response.status,
                    response: response.data
                };
            } else {
                // notification.showAlertNotification(message, false);

                return {
                    status: false,
                    response: []
                };
            }

        } catch (error) {
            // notification.showAxiosErrorAlert(error);
            toast.error("Something went wrong! Please try again.");
            return {
                status: false,
                response: []
            };
        }
    }

    async getCourseCategoryList(id) {
        try {
            const response = await apiClient.get(`course/get-category-list/` + id);
            if ((response.status == 200 || response.status == 201) && response) {
                return {
                    status: true,
                    response: response.data
                };
            } else {
                return {
                    status: false,
                    response: []
                };
            }
        } catch (error) {
            return {
                status: false,
                response: []
            };
        }
    }
}
const apiCategory = new CategoryProvider()
export default apiCategory