import { ToastContainer, toast } from 'react-toastify';
import apiClient from "../network/apiClient";

class ApiProvider {


  async getCategory(input) {
    try {
      const response = await apiClient.get(`category/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async getCourse(input) {
    try {
      const response = await apiClient.get(`course/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async getCurriculam(input) {
    try {
      const response = await apiClient.get(`curriculam/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async getReview(input) {
    try {
      const response = await apiClient.get(`review/get`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async register(input) {
    try {
      const response = await apiClient.post("users/register", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        toast(message)
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        toast(message)
        // notification.showAlertNotification(message, false);/
        return {
          status: false,
          response: response
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: error
      }
    }
  }


  async login(input) {
    try {
      const response = await apiClient.post("users/login", input);
      console.log(response, "response");

      const message = response.data?.message ?? "Something went wrong";
      console.log(message, "message");

      if (response.status == 200 || response.status == 201 && response) {
        // notification.showAlertNotification(response.data.message, true);
        // toast(message)

        return {
          status: response.status,
          response: response.data
        };
      } else {
        console.log("enter else");
        toast(message)

        // notification.showAlertNotification(message, false);
        return {
          status: false,
          response: response
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: error
      };
    }
  }

  async getCarouselCourse(input) {
    try {
      const response = await apiClient.get(`course/course-carousel?limit=` + input);
      const message = response.data?.message ?? "Something went wrong"
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: true, response: response };
      } else {
        // notification.showAlertNotification(message, false);
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);

      return null;
    }
  }

  async getFacilitors(input) {
    try {
      const response = await apiClient.get("about-us/get-facilitors", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

  async getFacilitorDetail(input) {
    try {
      const response = await apiClient.get(`about-us/get-facilitor-details/${input}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

  async addAddress(input) {
    try {
      const response = await apiClient.post("address", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: error
      }
    }
  }


  async getAddress(userID, type) {
    try {
      const response = await apiClient.get(`address/${userID}`, {
        params: { type }
      });

      if (response.status === 200 || response.status === 201) {
        return { status: response.status, response: response.data };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  async getOrders() {
    try {

      const response = await apiClient.get('orders');

      if (response.status === 200 || response.status === 201) {
        return { status: response.status, response: response.data };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async orderDetails(id) {
    try {
      const response = await apiClient.get(`orders/${id}`);
      if (response.status === 200 || response.status === 201) {
        return { status: response.status, response: response.data };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateAddress(UserAddressId, input) {
    try {
      const response = await apiClient.patch(`address/${UserAddressId}`, input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: error
      }
    }
  }

  async deleteAddress(UserAddressId) {
    try {
      const response = await apiClient.delete(`address/${UserAddressId}`);

      if (response.status === 200 || response.status === 201) {
        return { status: response.status, response: response.data };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async emailverfiy(input) {
    try {
      const response = await apiClient.get(`users/verify/${input}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

  async getManagementTeams(input) {
    try {
      const response = await apiClient.get("about-us/get-management-team", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

  async getManagementTeamsDetail(input) {
    try {
      const response = await apiClient.get(`about-us/get-management-team-details/${input}`);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }


  async newsLetter(input) {
    try {
      const response = await apiClient.post("news-letter/add-newsletter", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        toast(message)
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        toast(message)
        // notification.showAlertNotification(message, false);/
        return {
          status: false,
          response: response
        };
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return {
        status: false,
        response: error
      }
    }
  }

  async requestForgetPasswordOtp(input) {
    try {
      const response = await apiClient.post("users/forget-password", input);
      console.log(response, "response");

      const message = response.data?.message ?? "Something went wrong";
      console.log(message, "message");

      if (response.status == 200 || response.status == 201 && response) {
        toast(message)
        return {
          status: response.status,
          response: response.data
        };
      } else {
        console.log("enter else");
        toast(message)
        return {
          status: false,
          response: response
        };
      }
    } catch (error) {
      return {
        status: false,
        response: error
      };
    }
  }

  async verifyForgetPasswordOtp(input) {
    try {
      const response = await apiClient.post("users/verify-forget-password-otp", input);
      console.log(response, "verify OTP response");

      const message = response.data?.message ?? "Something went wrong";

      if (response.status == 200 || response.status == 201) {
        toast.success(message);
        return {
          status: response.status,
          response: response.data
        };
      } else {
        toast.error(message);
        return {
          status: false,
          response: response
        };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "OTP verification failed";
      toast.error(errorMessage);
      return {
        status: false,
        response: error
      };
    }
  }

  async resetPassword(input) {
    try {
      const response = await apiClient.post("users/reset-password", input);
      console.log(response, "reset password response");

      const message = response.data?.message ?? "Something went wrong";

      if (response.status == 200 || response.status == 201) {
        toast.success(message);
        return {
          status: response.status,
          response: response.data
        };
      } else {
        toast.error(message);
        return {
          status: false,
          response: response
        };
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Password reset failed";
      toast.error(errorMessage);
      return {
        status: false,
        response: error
      };
    }
  }

  async getCourseCalender(input) {
    try {
      const response = await apiClient.get(`course/calander-get`, {
        params: { date: input }
      });
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }
  async getPaymentMethod(input) {
    try {
      const response = await apiClient.get("payment/get-paymentmethods", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

  async getCurrency(input) {
    try {
      const response = await apiClient.get("payment/get-currency", input);
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

  async certificateView(input) {
    try {
      const response = await apiClient.post("course/certificate-view", input, {
        responseType: 'blob',
      });
      const message = response.data?.message ?? "Something went wrong";
      if (response.status == 200 || response.status == 201) {
        // notification.showAlertNotification(response.data.message, true);
        return { status: response.status, response: response };
      } else {
        // notification.showAlertNotification(message, false);/
        return null;
      }
    } catch (error) {
      // notification.showAxiosErrorAlert(error);
      return null;
    }
  }

}

const apiProvider = new ApiProvider()
export default apiProvider