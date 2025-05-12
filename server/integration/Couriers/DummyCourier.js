//TODO: implement/override the methods required based in the services defined in "../../../dummy-services/Couriers"

import ParentCourier from "./ParentCourier.js";
import { DUMMY_COURIER } from "../../utils/constants.js";
import CourierIntegration from "../../models/CourierIntegration.js";

class DummyCourier extends ParentCourier {

    constructor(courierIntegration) {

        super();

        if (courierIntegration.constructor !== CourierIntegration) {
            console.log("courierIntegration.constructor",
                        courierIntegration.constructor,
                        "pass a CourierIntegration object in constructor of DummyCourier.");
            throw new Error("Invalid courier integration object");
        }
        this.token = courierIntegration.token;
        this.associatedEmail = courierIntegration.emailOrCredential;
        this.baseUrl = courierIntegration.apiEndpoint;
        this.title = DUMMY_COURIER;
    }

    // Implement the required methods from ParentCourier here
    
    /**
     * Dispatches an order using the courier service
     * @param {Object} order - The order object to dispatch
     * @returns {Promise<Object>} - Response from the courier service
     */
    async dispatch(order) {
        // TODO: Implement order dispatch functionality for the dummy courier service
        // This should communicate with the courier API to arrange pickup and delivery
        console.log(`Attempting to dispatch order ${order._id} via ${this.title}`);
        return { success: true, message: "Order dispatched successfully" };
    }
}

export default DummyCourier;