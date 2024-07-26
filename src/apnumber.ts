import { translate } from "./_utils";

export const apnumber = (value: number): string => {
  return translate("apnumbers", value) || value.toString();
};

export const apNumber = apnumber;
