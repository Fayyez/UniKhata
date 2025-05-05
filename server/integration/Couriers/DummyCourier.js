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
}

export default DummyCourier;


// testing
// create a dummy courier integration object
// const dummyCourierIntegration = new CourierIntegration({
//     store: "dummyStoreId",
//     title: "Dummy Courier",
//     courierName: "xyz",
//     emailOrCredential: "dummyEmail",
//     apiEndpoint: "https://dummyapi.com",
//     token: "dummyToken"
// });

// // create a DummyCourier object
// const dummyCourier = new DummyCourier(dummyCourierIntegration);
// console.log(dummyCourier); // should log the DummyCourier object with the properties set from the dummyCourierIntegration object