(function () {
  // from https://github.com/django/django/blob/7b31ba541f1dfb3a8e782b1319c25a24f9d86f8a/django/utils/timesince.py#L27
  const TIMESINCE_CHUNKS = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  const isLeapYear = (year) => {
    if (year % 4 === 0) {
      if (year % 100 === 0) {
        if (year % 400 === 0) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };
  const getLeapDays = (year1, year2) => {
    if (year1 === year2) {
      return 0;
    }
    return Array.from(Array(Math.abs(year2 - year1)).keys())
      .map((v, i) => (isLeapYear(year1 + i) ? (year2 >= year1 ? 1 : -1) : 0))
      .reduce((total, value) => total + value);
  };
  const timeSince = (d, now, reversed) => {
    d = djangoFilters._utils.parseDate(d);
    if (typeof now === "undefined") {
      now = new Date();
    } else {
      now = djangoFilters._utils.parseDate(now);
    }
    if (!(d instanceof Date) || !(now instanceof Date)) {
      return "";
    }
    if (reversed) {
      [d, now] = [now, d];
    }
    let since = Math.round((now - d) / 1000);
    let leapDays = getLeapDays(d.getFullYear(), now.getFullYear());
    if (leapDays !== 0) {
      if (isLeapYear(d.getFullYear())) {
        leapDays -= 1;
      } else if (isLeapYear(now.getFullYear())) {
        leapDays += 1;
      }
    }
    since -= leapDays * 24 * 60 * 60;
    if (since <= 0) {
      // d is in the future compared to now, stop processing.
      return djangoFilters._utils.avoidWrapping(
        `0 ${djangoFilters.pluralize(
          0,
          djangoFilters._utils.translate("timeunits", "minute").join(",")
        )}`
      );
    }
    let count, seconds, name, index;
    for (index = 0; index < TIMESINCE_CHUNKS.length; index++) {
      [seconds, name] = TIMESINCE_CHUNKS[index];
      count = Math.floor(since / seconds);
      if (count !== 0) {
        break;
      }
    }
    let result = djangoFilters._utils.avoidWrapping(
      `${count} ${djangoFilters.pluralize(
        count,
        djangoFilters._utils.translate("timeunits", name).join(",")
      )}`
    );
    if (index + 1 < TIMESINCE_CHUNKS.length) {
      const [seconds2, name2] = TIMESINCE_CHUNKS[index + 1];
      const count2 = Math.floor((since - seconds * count) / seconds2);
      if (count2 !== 0) {
        result = [
          result,
          djangoFilters._utils.translate("timeunits", "separator"),
          djangoFilters._utils.avoidWrapping(
            `${count2} ${djangoFilters.pluralize(
              count2,
              djangoFilters._utils.translate("timeunits", name2).join(",")
            )}`
          ),
        ].join("");
      }
    }
    return result;
  };
  djangoFilters.timesince = (value, compareTo) => timeSince(value, compareTo);
  djangoFilters.timeuntil = (value, compareTo) =>
    timeSince(value, compareTo, true);
})();
