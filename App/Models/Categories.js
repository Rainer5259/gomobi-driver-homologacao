import Model from "react-native-models";

/**
 * Reference: https://www.npmjs.com/package/react-native-models
 */
export default class Categories extends Model{

    /**
     * get Model's Name
     */
    static get className(){
        return "Categories";
    }

    /**
     * Constructor passing the name of the variables with their respective default value
     * creating the SET and GET Methods.
     * @param {Number} id
     * @param {Number} category_id
     * @param {Number} base_distance
     * @param {Number} base_price
     * @param {Number} base_price_provider
     * @param {Number} base_price_user
     * @param {Number} base_time
     * @param {Number} commission_rate
     * @param {Number} distance_unit
     * @param {Number} time_unit
     * @param {Number} type_id
     * @param {String} icon
     * @param {String} icon_maps
     * @param {String} name
     * @param {String} min_price
     * @param {String} price_per_unit_distance
     * @param {String} price_per_unit_time
     */
    constructor(id = 0, category_id = 0, base_distance = '', base_price = 0, base_price_provider = '', base_price_user = '', base_time = '', commission_rate = 0,
      distance_unit = '', time_unit = '', type_id = 0, icon = '', icon_maps = '', name = '', min_price = 0, price_per_unit_distance = '', price_per_unit_time = ''
     ){

        /**
         * Create the Model Variables with Set and Get methods
         */
        super({
            id: "Number", category_id: "Number", base_distance: "String", base_price: "String", base_price_provider: "String", base_price_user: "String", base_time: "String",
            commission_rate: "String", distance_unit: "String", time_unit: "String", type_id: "Number",
            icon: "String", icon_maps: "String", name: "String", min_price: "String", price_per_unit_distance: "String", price_per_unit_time: "String"
        });

        this.initializeModel(id, category_id, base_distance, base_price, base_price_provider, base_price_user, base_time, commission_rate,
          distance_unit, time_unit, type_id, icon, icon_maps, name, min_price, price_per_unit_distance, price_per_unit_time);
    }

    /**
     * Initialize Model Variables with set and check if value is null
     * The set methods have the standart setVariable().
     * @param {Number} id
     * @param {Number} category_id
     * @param {String} base_distance
     * @param {String} base_price
     * @param {String} base_price_provider
     * @param {String} base_price_user
     * @param {String} base_time
     * @param {String} commission_rate
     * @param {String} distance_unit
     * @param {String} time_unit
     * @param {Number} type_id
     * @param {String} icon
     * @param {String} icon_maps
     * @param {String} name
     * @param {String} min_price
     * @param {String} price_per_unit_distance
     * @param {String} price_per_unit_time
     */
    initializeModel(id, category_id, base_distance, base_price, base_price_provider, base_price_user, base_time, commission_rate,
      distance_unit, time_unit, type_id, icon, icon_maps, name, min_price, price_per_unit_distance, price_per_unit_time) {

        if((id !== undefined) && (id !== null)){
            this.setId(id);
        }
        if((category_id !== undefined) && (category_id !== null)){
            this.setCategory_id(category_id);
        }
        if((base_distance !== undefined) && (base_distance !== null)){
            this.setBase_distance(base_distance);
        }
        if((base_price !== undefined) && (base_price !== null)){
            this.setBase_price(JSON.stringify(base_price));
        }
        if((base_price_provider !== undefined) && (base_price_provider !== null)){
            this.setBase_price_provider(base_price_provider);
        }
        if((base_price_user !== undefined) && (base_price_user !== null)){
            this.setBase_price_user(base_price_user);
        }
        if((base_time !== undefined) && (base_time !== null)){
            this.setBase_time(base_time);
        }
        if((commission_rate !== undefined) && (commission_rate !== null)){
            this.setCommission_rate(JSON.stringify(commission_rate));
        }
        if((distance_unit !== undefined) && (distance_unit !== null)){
            this.setDistance_unit(distance_unit);
        }
        if((time_unit !== undefined) && (time_unit !== null)){
            this.setTime_unit(time_unit);
        }
        if((type_id !== undefined) && (type_id !== null)){
            this.setType_id(type_id);
        }
        if((icon !== undefined) && (icon !== null)){
            this.setIcon(icon);
        }
        if((icon_maps !== undefined) && (icon_maps !== null)){
            this.setIcon_maps(icon_maps);
        }
        if((name !== undefined) && (name !== null)){
            this.setName(name);
        }
        if((min_price !== undefined) && (min_price !== null)){
            this.setMin_price(JSON.stringify(min_price));
        }
        if((price_per_unit_distance !== undefined) && (price_per_unit_distance !== null)){
            this.setPrice_per_unit_distance(price_per_unit_distance);
        }
        if((price_per_unit_time !== undefined) && (price_per_unit_time !== null)){
            this.setPrice_per_unit_time(price_per_unit_time);
        }



    }

    /**
     * Clear all information of Model.
     */
    clearModel (){

        this.setId(0);
        this.setCategory_id(0);
        this.setBase_distance('');
        this.setBase_price('');
        this.setBase_price_provider('');
        this.setBase_price_user('');
        this.setBase_time('');
        this.setCommission_rate('');
        this.setDistance_unit('');
        this.setTime_unit('');
        this.setType_id(0);
        this.setIcon('');
        this.setIcon_maps('');
        this.setName('');
        this.setMin_price('');
        this.setPrice_per_unit_distance('');
        this.setPrice_per_unit_time('');

    }
}
