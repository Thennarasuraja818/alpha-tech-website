import apiClient from "../network/apiClient";

class CartApiProvider {
    async addToCart(input) {
      try {
        const response = await apiClient.post("cart-detail/add", input);
        const message = response.data?.message ?? "Something went wrong";
        if (response.status == 200 || response.status == 201 && response) {
          // notification.showAlertNotification(response.data.message, true);
          return {
            status: response.status,
            response: response.data
          };
        } else {
          // notification.showAlertNotification(message, false);
          return {
            status :false,
            response: []
          };
        }
      } catch (error) {
        // notification.showAxiosErrorAlert(error);
        return {
          status :false,
          response: []
        };
      }
    }
    async getCart(input) {
      try {
        const response = await apiClient.get("cart-detail/get-user");
        const message = response.data?.message ?? "Something went wrong";
        if (response.status == 200 || response.status == 201 && response) {
          // notification.showAlertNotification(response.data.message, true);
          return {
            status: response.status,
            response: response.data
          };
        } else {
          // notification.showAlertNotification(message, false);
          return {
            status :false,
            response: []
          };
        }
      } catch (error) {
        // notification.showAxiosErrorAlert(error);
        return {
          status :false,
          response: []
        };
      }
    }

    async removeToCart(id) {
      try {
        const response = await apiClient.delete(`cart-detail/remove-item/${id}`);
        const message = response.data?.message ?? "Something went wrong";
        if (response.status == 200 || response.status == 201 && response) {
          // notification.showAlertNotification(response.data.message, true);
          return {
            status: response.status,
            response: response.data
          };
        } else {
          // notification.showAlertNotification(message, false);
          return {
            status :false,
            response: []
          };
        }
      } catch (error) {
        // notification.showAxiosErrorAlert(error);
        return {
          status :false,
          response: []
        };
      }
    }
    async getUserDetails(input) {
      try {
        const response = await apiClient.get("cart-detail/get-user-details");
        const message = response.data?.message ?? "Something went wrong";
        if (response.status == 200 || response.status == 201 && response) {
          // notification.showAlertNotification(response.data.message, true);
          return {
            status: response.status,
            response: response.data
          };
        } else {
          // notification.showAlertNotification(message, false);
          return {
            status :false,
            response: []
          };
        }
      } catch (error) {
        // notification.showAxiosErrorAlert(error);
        return {
          status :false,
          response: []
        };
      }
    }
}
const apiCart = new CartApiProvider()
export default apiCart