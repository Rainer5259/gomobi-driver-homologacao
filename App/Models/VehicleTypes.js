import Model from "react-native-models";

import Types from '../Models/Types';
import Categories from '../Models/Categories';

/**
 * Reference: https://www.npmjs.com/package/react-native-models
 */
export default class VehicleTypes extends Model {

    /**
     * get Model's Name
     */
    static get className() {
        return "VehicleTypes";
    }

    /**
     * Use all the prepares to restore VehicleTypes information.
     */
    static prepareRestore() {
        VehicleTypes.require(VehicleTypes);
        Types.require(Types);
        Categories.require(Categories);
    }

    /**
     * Constructor passing the name of the variables with their respective default value
     * creating the SET and GET Methods.
     * @param {Number} id
     * @param {Boolean} is_location_registered
     * @param {Number} max_cancel_time
     * @param {Types} types
     * @param {Array} request_event_types
     */
    constructor(id = 0, is_location_registered = false, max_cancel_time = 0, types = [], request_event_types = []) {

        /**
         * Create the Model Variables with Set and Get methods
         */
        super({
            id: "Number", is_location_registered: "Boolean", max_cancel_time: "Number", types: "Array",
            request_event_types: "Array"
        });

        this.initializeModel(id, is_location_registered, max_cancel_time, types, request_event_types);
    }

    /**
     * Initialize Model Variables with set and check if value is null
     * The set methods have the standart setVariable().
     * @param {Number} id
     * @param {Boolean} is_location_registered
     * @param {Number} max_cancel_time
     * @param {Types} types
     * @param {Array} request_event_types
     */
    initializeModel(id, is_location_registered, max_cancel_time, types, request_event_types) {

        if ((id !== undefined) && (id !== null)) {
            this.setId(id);
        }
        if ((is_location_registered !== undefined) && (is_location_registered !== null)) {
            this.setIs_location_registered(is_location_registered);
        }
        if ((max_cancel_time !== undefined) && (max_cancel_time !== null)) {
            this.setMax_cancel_time(max_cancel_time);
        }
        if ((types !== undefined) && (types !== null)) {
            this.setTypes(types);
        }
        if ((request_event_types !== undefined) && (request_event_types !== null)) {
            this.setRequest_event_types(request_event_types);
        }


    }

    /**
     * Return the Information basead on ID.
     * @param {number} id
     */
    getTypesInformation(id) {
        types = this.getTypes();

        for (let i = 0; i < types.length; i++) {
            if (types[i].getId() == id) {
                return types[i];
            }
        }

        return null;
    }

    /**
     * Clear all information of Model.
     */
    clearModel() {

        this.setId(0);
        this.setIs_location_registered(false);
        this.setMax_cancel_time(0);
        this.setTypes([]);
        this.setRequest_event_types([]);

    }
}
