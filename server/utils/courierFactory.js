import courierIntegration from "../models/CourierIntegration.js";
import { DUMMY_COURIER } from "./constants.js";
import DummyCourier from "../integration/Couriers/DummyCourier.js";

/**
 * Creates a list of courier class objects based on the provided list of CourierIntegration objects.
 *
 * @param {Array} list_of_couriers_from_database - Array of CourierIntegration objects from the database.
 * Each object should have a `title` field that matches a courier title defined in constants.js.
 *
 * @returns {Array} - An array of instantiated courier class objects corresponding to the titles.
 *
 * Example:
 * Input: [
 *   { title: "DUMMY_COURIER", ...otherFields },
 *   { title: "ANOTHER_COURIER", ...otherFields }
 * ]
 * Output: [
 *   DummyCourier instance,
 *   AnotherCourier instance
 * ]
 */
function createCourierObjects(list_of_couriers_from_database) {
    const courierObjects = [];
    try {
        list_of_couriers_from_database.forEach((courierIntegrationItem) => {
            switch (courierIntegrationItem.title) {
                case DUMMY_COURIER:
                    courierObjects.push(new DummyCourier(courierIntegrationItem));
                    break;
                // Add more cases here for other courier titles and their corresponding classes
                default:
                    console.warn(
                        `No matching courier class found for title: ${courierIntegrationItem.title}`
                    );
                    // throw error that this courier service is not supported
                    throw new Error(
                        `Courier service ${courierIntegrationItem.title} is not supported.`
                    );
            }
        });
    } catch (error) {
        console.error("Error creating courier objects:", error);
        // Handle the error as needed, e.g., log it, rethrow it, etc.
        throw new Error(
            "Failed to create courier objects. Please check the input data."
        );
    }

    return courierObjects;
}

export default createCourierObjects;
