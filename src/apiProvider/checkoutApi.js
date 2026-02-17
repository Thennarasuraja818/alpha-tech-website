import apiClient from "../network/apiClient";

class CheckoutApiProvider {
  async checkout(input) {
    try {
      const response = await apiClient.post("orders", input);
      if (response.status == 200 || response.status == 201 && response) {
        // notification.showAlertNotification(response.data.message, true);
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
      return {
        status: false,
        response: []
      };
    }
  }
  async paymentverify(input) {
    try {
      const response = await apiClient.post("cart-detail/nomodWebhook", input);
      if (response.status == 200 || response.status == 201 && response) {
        return {
          status: response.status,
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

  async verifyCheck(input) {
    console.log(input, "iiiii");

    try {
      const response = await apiClient.post("cart-detail/verify-check", input);
      if (response.status == 200 || response.status == 201 && response) {
        return {
          status: response.status,
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
const apiCheckout = new CheckoutApiProvider()
export default apiCheckout