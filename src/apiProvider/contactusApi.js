import { ToastContainer, toast } from 'react-toastify';
import apiClient from "../network/apiClient";

class contactusApiProvider {
    async contactus(input) {
      try {
        const response = await apiClient.post("contact-us/add", input);
        console.log("response:",response)
        if (response.status == 200 || response.status == 201 && response) {
          toast(response.data?.message)
          return {
            status: response.status,
            response: response.data
          };
        } else {
          toast(response.data?.message)
          return {
            status :false,
            response: []
          };
        }
      } catch (error) {
        toast(error?.response?.data?.message)
        return {
          status :false,
          response: []
        };
      }
    }
}
const apiContactUs = new contactusApiProvider()
export default apiContactUs