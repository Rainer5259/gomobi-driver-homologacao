export function validatePhoneNumber(value) {
  value = value.replace('(', '');
  value = value.replace(')', '');
  value = value.replace('-', '');
  value = value.replace(/ /g, '');


  if (value === '0000000000') {
    return false;
  }
  if (value === '00000000000') {
    return false;
  }
  if (
    [
      '00',
      '01',
      '02',
      '03',
      ,
      '04',
      ,
      '05',
      ,
      '06',
      ,
      '07',
      ,
      '08',
      '09',
      '10',
    ].indexOf(value.substring(0, 2)) !== -1
  ) {
    return false;
  }
  if (value.length < 10 || value.length > 11) {
    return false;
  }
  if (['6', '7', '8', '9'].indexOf(value.substring(2, 3)) === -1) {
    return false;
  }
  return true;
}
