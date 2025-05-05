import { DUMMY_STORE } from "./constants.js";
// Import all the e-store classes
import DummyStore from "../integration/E-stores/DummyStore.js";

/**
 * Creates a list of e-commerce store class objects based on the provided list of EcommerceIntegration objects.
 *
 * @param {Array} list_of_ecommerceIntegration_objects - Array of EcommerceIntegration objects from the database.
 * Each object should have a `title` field that matches a store title defined in constants.js.
 *
 * @returns {Array} - An array of instantiated e-store class objects corresponding to the titles.
 *
 * Example:
 * Input: [
 *   { title: "DUMMY_STORE", ...otherFields },
 *   { title: "ANOTHER_STORE", ...otherFields }
 * ]
 * Output: [
 *   DummyStore instance,
 *   AnotherStore instance
 * ]
 */
function createEStoreObjects(list_of_ecommerceIntegration_objects) {
    const eStoreObjects = [];
    try {
        list_of_ecommerceIntegration_objects.forEach((ecommerceIntegrationItem, ind) => {
            switch (ecommerceIntegrationItem.title) {
                case DUMMY_STORE:
                    eStoreObjects.push(new DummyStore(ecommerceIntegrationItem));
                    break;
                // Add more cases here for other e-store titles and their corresponding classes
                default:
                    console.warn(
                        `No matching e-store class found for title: ${ecommerceIntegrationItem.title}`
                    );
                    // throw error that this e-store service is not supported
                    throw new Error(
                        `E-store service ${ecommerceIntegrationItem.title} is not supported.`
                    );
            }
        });
    } catch (error) {
        console.error("Error creating e-store objects:", error);
        // Handle the error as needed, e.g., log it, rethrow it, etc.
        throw new Error(
            "Failed to create e-store objects. Please check the input data."
        );
    }

    return eStoreObjects;
}

export default createEStoreObjects;

// //// test the function
// // const testEcommerceIntegrationObjects = [
// //     { title: DUMMY_STORE, token: "dummy-token", email: "email1@gmail.com", apiEndpoint: "https://dummyapi.com" },
// //     { title: DUMMY_STORE, token: "another-token", email: "email2@gmail.com", apiEndpoint: "https://           anotherapi.com" },
// // ];
// // const eStoreObjects = createEStoreObjects(testEcommerceIntegrationObjects);
// // console.log("E-store objects created:", eStoreObjects);