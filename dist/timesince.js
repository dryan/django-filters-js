import { parseDate, avoidWrapping, translate } from "./_utils";
import { pluralize } from "./pluralize";
// from https://github.com/django/django/blob/7b31ba541f1dfb3a8e782b1319c25a24f9d86f8a/django/utils/timesince.py#L27
const _TIMESINCE_CHUNKS = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
];
const _isLeapYear = (year) => {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true;
            }
        }
        else {
            return true;
        }
    }
    return false;
};
const _getLeapDays = (year1, year2) => {
    if (year1 === year2) {
        return 0;
    }
    return Array.from(Array(Math.abs(year2 - year1)).keys())
        .map((_, i) => (_isLeapYear(year1 + i) ? (year2 >= year1 ? 1 : -1) : 0))
        .reduce((total, value) => (total + value));
};
const _timeSince = (d, now = undefined, reversed = false) => {
    d = parseDate(d);
    if (typeof now === "undefined") {
        now = new Date();
    }
    else {
        now = parseDate(now);
    }
    if (!(d instanceof Date) || !(now instanceof Date)) {
        return "";
    }
    if (reversed) {
        [d, now] = [now, d];
    }
    let since = Math.round((now.getTime() - d.getTime()) / 1000);
    let leapDays = _getLeapDays(d.getFullYear(), now.getFullYear());
    if (leapDays !== 0) {
        if (_isLeapYear(d.getFullYear())) {
            leapDays -= 1;
        }
        else if (_isLeapYear(now.getFullYear())) {
            leapDays += 1;
        }
    }
    since -= leapDays * 24 * 60 * 60;
    if (since <= 0) {
        // d is in the future compared to now, stop processing.
        return avoidWrapping(`0 ${pluralize(0, translate("timeunits", "minute")?.join(","))}`);
    }
    let count, seconds, name, index;
    for (index = 0; index < _TIMESINCE_CHUNKS.length; index++) {
        [seconds, name] = _TIMESINCE_CHUNKS[index];
        count = Math.floor(since / seconds);
        if (count !== 0) {
            break;
        }
    }
    let result = avoidWrapping(`${count} ${pluralize(count, translate("timeunits", name)?.join(","))}`);
    if (index + 1 < _TIMESINCE_CHUNKS.length) {
        const [seconds2, name2] = _TIMESINCE_CHUNKS[index + 1];
        const count2 = Math.floor((since - seconds * count) / seconds2);
        if (count2 !== 0) {
            result = [
                result,
                translate("timeunits", "separator"),
                avoidWrapping(`${count2} ${pluralize(count2, translate("timeunits", name2)?.join(","))}`),
            ].join("");
        }
    }
    return result;
};
export const timesince = (value, compareTo = undefined) => _timeSince(value, compareTo);
export const timeuntil = (value, compareTo = undefined) => _timeSince(value, compareTo, true);
export const timeSince = timesince;
export const timeUntil = timeuntil;
//# sourceMappingURL=timesince.js.map