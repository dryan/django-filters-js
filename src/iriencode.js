djangoFilters.iriencode = (value) => {
  value = value.toString();
  return djangoFilters._utils.urlquote(value, "/#%[]=:;$&()+,!?*@'~");
};
