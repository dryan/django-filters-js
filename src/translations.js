// setup up the translations and add the US English variants
djangoFilters.translations = djangoFilters.translations || {};
(function () {
  const addTranslation = (languageCode, group, strings) => {
    djangoFilters.translations[languageCode] =
      djangoFilters.translations[languageCode] || {};
    djangoFilters.translations[languageCode][group] = Object.assign(
      strings,
      djangoFilters.translations[languageCode][group] || {}
    );
  };

  addTranslation("en-us", "apnumbers", {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  });

  addTranslation("en-us", "days:long", {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  });

  addTranslation("en-us", "days:short", {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  });

  addTranslation("en-us", "filesizeformat", {
    byte: "byte",
    bytes: "bytes",
    KB: "KB",
    MB: "MB",
    GB: "GB",
    TB: "TB",
    PB: "PB",
  });

  addTranslation("en-us", "meridians", {
    am: "AM",
    pm: "PM",
    0: "midnight",
    12: "noon",
  });

  addTranslation("en-us", "meridians:ap", {
    am: "a.m.",
    pm: "p.m.",
  });

  addTranslation("en-us", "months:long", {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  });

  addTranslation("en-us", "months:short", {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  });

  addTranslation("en-us", "months:ap", {
    0: "Jan.",
    1: "Feb.",
    2: "March",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug.",
    8: "Sept.",
    9: "Oct.",
    10: "Nov.",
    11: "Dec.",
  });

  addTranslation("en-us", "ordinals", {
    0: "th",
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th",
    6: "th",
    7: "th",
    8: "th",
    9: "th",
    "11-13": "th",
  });

  addTranslation("en-us", "timeunits", {
    year: ["year", "years"],
    month: ["month", "months"],
    week: ["week", "weeks"],
    day: ["day", "days"],
    hour: ["hour", "hours"],
    minute: ["minute", "minutes"],
    separator: ", ",
  });
})();

// set default language fallbacks for when there's no country code
djangoFilters.translations.en = djangoFilters.translations["en-us"];
djangoFilters.translations["en-en"] = djangoFilters.translations["en-us"];
