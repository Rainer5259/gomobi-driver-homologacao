import Model from "react-native-models";

/**
 * Reference: https://www.npmjs.com/package/react-native-models
 */
export default class Types extends Model{

    /**
     * get Model's Name
     */
    static get className(){
        return "Types";
    }

    /**
     * Constructor passing the name of the variables with their respective default value
     * creating the SET and GET Methods.
     * @param {Number} id
     * @param {Categories} categories
     * @param {Number} base_distance
     * @param {Number} base_price
     * @param {Number} charge_provider_return
     * @param {String} color
     * @param {String} commission_rate
     * @param {String} commission_type
     * @param {String} currency
     * @param {Number} destination_visible
     * @param {String} gender_restriction
     * @param {String} icon
     * @param {String} icon_maps
     * @param {Number} is_default
     * @param {String} max_size
     * @param {Number} maximum_distance
     * @param {Number} min_fare
     * @param {String} min_price
     * @param {String} name
     * @param {Number} price_per_unit_distance
     * @param {Number} price_per_unit_time
     * @param {Number} sub_category_screen_visible
     * @param {String} unit
     */
    constructor(id = 0, categories = [], base_distance = 0, base_price = 0, charge_provider_return = 0, color = '', commission_rate = 0, commission_type = '',
      currency = '', destination_visible = 0, gender_restriction = '', icon = '', icon_maps = '', is_default = 0, max_size = '', maximum_distance = 0, min_fare = 0,
      min_price = 0, name = '', price_per_unit_distance = 0, price_per_unit_time = 0, sub_category_screen_visible = 0, unit = ''
     ){

        /**
         * Create the Model Variables with Set and Get methods
         */
        super({
            id: "Number", categories: "Array", base_distance: "Number", base_price: "Number", charge_provider_return: "Number", color: "String", commission_rate: "Number",
            commission_type: "String", currency: "String", destination_visible: "Number", gender_restriction: "String",
            icon: "String", icon_maps: "String", is_default: "Number", max_size: "String", maximum_distance: "Number", min_fare: "Number",
            min_price: "Number", name: "String", price_per_unit_distance: "Number", price_per_unit_time: "Number", sub_category_screen_visible: "Number", unit: "String"
        });

        this.initializeModel(id, categories, base_distance, base_price, charge_provider_return, color, commission_rate, commission_type,
          currency, destination_visible, gender_restriction, icon, icon_maps, is_default, max_size, maximum_distance, min_fare,
          min_price, name, price_per_unit_distance, price_per_unit_time, sub_category_screen_visible, unit);
    }

    /**
     * Initialize Model Variables with set and check if value is null
     * The set methods have the standart setVariable().
     * @param {Number} id
     * @param {Categories} categories
     * @param {Number} base_distance
     * @param {Number} base_price
     * @param {Number} charge_provider_return
     * @param {String} color
     * @param {String} commission_rate
     * @param {String} commission_type
     * @param {String} currency
     * @param {Number} destination_visible
     * @param {String} gender_restriction
     * @param {String} icon
     * @param {String} icon_maps
     * @param {Number} is_default
     * @param {String} max_size
     * @param {Number} maximum_distance
     * @param {Number} min_fare
     * @param {String} min_price
     * @param {String} name
     * @param {Number} price_per_unit_distance
     * @param {Number} price_per_unit_time
     * @param {Number} sub_category_screen_visible
     * @param {String} unit
     */
    initializeModel(id, categories, base_distance, base_price, charge_provider_return, color, commission_rate, commission_type,
      currency, destination_visible, gender_restriction, icon, icon_maps, is_default, max_size, maximum_distance, min_fare,
      min_price, name, price_per_unit_distance, price_per_unit_time, sub_category_screen_visible, unit) {

        if((id !== undefined) && (id !== null)){
            this.setId(id);
        }
        if((categories !== undefined) && (categories !== null)){
            this.setCategories(categories);
        }
        if((base_distance !== undefined) && (base_distance !== null)){
            this.setBase_distance(base_distance);
        }
        if((base_price !== undefined) && (base_price !== null)){
            this.setBase_price(base_price);
        }
        if((charge_provider_return !== undefined) && (charge_provider_return !== null)){
            this.setCharge_provider_return(charge_provider_return);
        }
        if((color !== undefined) && (color !== null)){
            this.setColor(color);
        }
        if((commission_rate !== undefined) && (commission_rate !== null)){
            this.setCommission_rate(commission_rate);
        }
        if((commission_type !== undefined) && (commission_type !== null)){
            this.setCommission_type(commission_type);
        }
        if((currency !== undefined) && (currency !== null)){
            this.setCurrency(currency);
        }
        if((destination_visible !== undefined) && (destination_visible !== null)){
            this.setDestination_visible(destination_visible);
        }
        if((gender_restriction !== undefined) && (gender_restriction !== null)){
            this.setGender_restriction(gender_restriction);
        }
        if((icon !== undefined) && (icon !== null)){
            this.setIcon(icon);
        }
        if((icon_maps !== undefined) && (icon_maps !== null)){
            this.setIcon_maps(icon_maps);
        }
        if((is_default !== undefined) && (is_default !== null)){
            this.setIs_default(is_default);
        }
        if((max_size !== undefined) && (max_size !== null)){
            this.setMax_size(max_size);
        }
        if((maximum_distance !== undefined) && (maximum_distance !== null)){
            this.setMaximum_distance(maximum_distance);
        }
        if((min_fare !== undefined) && (min_fare !== null)){
            this.setMin_fare(min_fare);
        }
        if((min_price !== undefined) && (min_price !== null)){
            this.setMin_price(min_price);
        }
        if((name !== undefined) && (name !== null)){
            this.setName(name);
        }
        if((price_per_unit_distance !== undefined) && (price_per_unit_distance !== null)){
            this.setPrice_per_unit_distance(price_per_unit_distance);
        }
        if((price_per_unit_time !== undefined) && (price_per_unit_time !== null)){
            this.setPrice_per_unit_time(price_per_unit_time);
        }
        if((sub_category_screen_visible !== undefined) && (sub_category_screen_visible !== null)){
            this.setSub_category_screen_visible(sub_category_screen_visible);
        }
        if((unit !== undefined) && (unit !== null)){
            this.setUnit(unit);
        }



    }

    /**
     * Clear all information of Model.
     */
    clearModel (){

        this.setId(0);
        this.setCategories([]);
        this.setBase_distance(0);
        this.setBase_price(0);
        this.setCharge_provider_return(0);
        this.setColor('');
        this.setCommission_rate(0);
        this.setCommission_type('');
        this.setCurrency('');
        this.setDestination_visible(0);
        this.setGender_restriction('');
        this.setIcon('');
        this.setIcon_maps('');
        this.setIs_default(0);
        this.setMax_size('');
        this.setMaximum_distance(0);
        this.setMin_fare(0);
        this.setMin_price(0);
        this.setName('');
        this.setPrice_per_unit_distance(0);
        this.setSub_category_screen_visible(0);
        this.setPrice_per_unit_time(0);
        this.setUnit('');
    
    }
}
