import { strings } from '../../../../../../Locales/i18n';

export default useVehicleTexts = function (editScreen) {

  const labelLoader = strings(editScreen ? 'register.updating' : 'register.creating-provider');
  const labelTitle = strings('register_vehicle_step.vehicle_data');
  const labelConfirm = strings(editScreen ? 'register.save' : 'register.next_step');

  return { labelLoader, labelTitle, labelConfirm };
}