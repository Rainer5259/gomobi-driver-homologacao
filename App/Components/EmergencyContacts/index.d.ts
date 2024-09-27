// Modules
import React from 'react';

interface OptionProps {
  key: number;
  label: string;
}

interface EmergencyContactsProps {
  /**
   * @description current Locale
   * @default 'en'
   */
  language: string;

  /**
   * @description primary Color
   * @default 'green'
   */
  primaryColor: string;

  /**
   * @description base url to API requests
   */
  route?: string;

  /**
   * @description params to API requests
   */
  params?: object;


  /**
   * get options to share request
   */
  getOptionsToShareRequest?: (option: OptionProps) => {}
}

declare const EmergencyContacts = (props: EmergencyContactsProps): React.FC<
  EmergencyContactsProps> => { };

export default EmergencyContacts;
