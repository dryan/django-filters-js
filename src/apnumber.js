djangoFilters.apnumber = (value) => {
  return djangoFilters._utils.translate("apnumbers", value) || value.toString();
};
