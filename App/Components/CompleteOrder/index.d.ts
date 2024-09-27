// Modules
import React from 'react';

interface Service {
  base_price: string;
  category_id: number;
  distance: string;
  estimated_price: string;
  icon: string;
  icon_maps: string;
  is_clicked: boolean;
  min_price: string;
  name: string;
  price_per_unit_distance: string;
  price_per_unit_time: string;
  time: string;
  type_id: number;
}

interface GetClickedVehicleParams {

  /**
   * service list index
   */
  index: number;

  /**
   * service item
   */
  service_item: Service;

  /**
   * services list
   */
  service: Service[];
}

interface CompleteOrderProps {
  /**
   * services list
   */
  service: Service[],

  /**
   * function to get clicked Vehicle
   */
  getClickedVehicle: ({ index, service_item, service }: GetClickedVehicleParams) => {},
}

declare const CompleteOrder: (props: CompleteOrderProps) => React.FC<CompleteOrderProps>;

export default CompleteOrder;

