import {AppDataSource} from "./data-source";
import {CountryData} from "./entity/CountryData";

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
export const helloPubSub = (event, context) => {
    console.log(typeof event)
    AppDataSource.manager.find(CountryData).then(res => console.log(res));
};
