import { translate, padStart, padEnd } from "./_utils";
import { ordinal } from "./ordinal";
export function date(value, format = date.defaultFormats.date) {
    /*
      To escape a character, use '%'; to print a literal '%', use '%%'.
      Otherwise, formatting follows https://docs.djangoproject.com/en/5.0/ref/templates/builtins/#date.
  
      @format can be one of the Django-defined shortcuts or a string combining any of them.
    */
    if (!value ||
        (value.toString && value.toString().toLowerCase() === "invalid date")) {
        return null;
    }
    const jan1 = new Date(value.getFullYear(), 0, 1);
    const normalize12Hours = (hours) => {
        if (hours > 12) {
            hours = hours - 12;
        }
        else if (hours === 0) {
            hours = 12;
        }
        return hours;
    };
    const formats = {
        a: value.getHours() < 12
            ? translate("meridians:ap", "am")
            : translate("meridians:ap", "pm"),
        A: value.getHours() < 12
            ? translate("meridians", "am")
            : translate("meridians", "pm"),
        b: translate("months:short", value.getMonth()).toLowerCase(),
        d: padStart(value.getDate().toString(), 2, 0),
        D: translate("days:short", value.getDay()),
        E: translate("months:long", value.getMonth()),
        f: ((v) => {
            const ret = [normalize12Hours(v.getHours())];
            if (v.getMinutes() !== 0) {
                ret.push(":");
                ret.push(padStart(v.getMinutes().toString(), 2, 0));
            }
            return ret.map((p) => p.toString()).join("");
        })(value),
        F: translate("months:long", value.getMonth()),
        g: normalize12Hours(value.getHours()).toString(),
        G: value.getHours().toString(),
        h: padStart(normalize12Hours(value.getHours()).toString(), 2, 0),
        H: padStart(value.getHours().toString(), 2, 0),
        i: padStart(value.getMinutes().toString(), 2, 0),
        j: value.getDate().toString(),
        l: translate("days:long", value.getDay()),
        L: Boolean(new Date(value.getFullYear(), 1, 29).getDate() === 29),
        m: padStart((value.getMonth() + 1).toString(), 2, 0),
        M: translate("months:short", value.getMonth()),
        n: (value.getMonth() + 1).toString(),
        N: translate("months:ap", value.getMonth()),
        O: ((v) => {
            const offsetHours = Math.ceil(v.getTimezoneOffset() / 60), offsetMinutes = Math.abs(v.getTimezoneOffset() % 60);
            return ((offsetHours <= 0 ? "+" : "-") +
                padStart(Math.abs(offsetHours).toString(), 2, 0) +
                padStart(offsetMinutes.toString(), 2, 0));
        })(value),
        P: ((v) => {
            if ((v.getHours() === 0 || v.getHours() === 12) && v.getMinutes() === 0) {
                return translate("meridians", v.getHours());
            }
            const ret = [normalize12Hours(v.getHours())];
            if (v.getMinutes() !== 0) {
                ret.push(":");
                ret.push(padStart(v.getMinutes().toString(), 2, 0));
            }
            ret.push(" ");
            ret.push(v.getHours() < 12
                ? translate("meridians:ap", "am")
                : translate("meridians:ap", "pm"));
            return ret.map((p) => p.toString()).join("");
        })(value),
        s: padStart(value.getSeconds().toString(), 2, 0),
        S: ordinal(value.getDate()).replace(value.getDate().toString(), ""),
        t: (32 - new Date(value.getFullYear(), value.getMonth(), 32).getDate()).toString(),
        T: ((v) => v
            .toLocaleTimeString(navigator?.language ?? "en-US", {
            timeZoneName: "short",
        })
            .split(" ")[2])(value),
        u: (value.getMilliseconds() * 1000).toString(),
        U: Math.floor(value.getTime() / 1000).toString(),
        w: value.getDay().toString(),
        W: ((v) => {
            // from https://stackoverflow.com/a/6117889/2918278
            const d = new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7).toString();
        })(value),
        y: value.getFullYear().toString().slice(2, 4),
        Y: value.getFullYear().toString(),
        z: Math.ceil((value.getTime() - jan1.getTime()) / 86400000).toString(),
        Z: ((v) => {
            const offsetSeconds = v.getTimezoneOffset() * 60 * -1;
            return ((offsetSeconds < 0 ? "-" : "") +
                padEnd(Math.abs(offsetSeconds).toString(), 5, 0));
        })(value),
    };
    // special cases
    // ISO 8601
    // YYYY, MM, DD, HH, MM, SS, mmmmmm
    formats.c = [
        formats.Y,
        "-",
        formats.m,
        "-",
        formats.d,
        "T",
        formats.H,
        ":",
        formats.i,
        ":",
        formats.s,
        ".",
        padStart(formats.u, 6, 0),
    ].join("");
    // RFC 2822
    //Short Day, Date, Short Month, Year, HH, MM, SS, Timezone Offset
    formats.r = [
        formats.D,
        ", ",
        formats.j,
        " ",
        formats.M,
        " ",
        formats.Y,
        " ",
        formats.H,
        ":",
        formats.i,
        ":",
        formats.s,
        " ",
        formats.O,
    ].join("");
    const ret = [];
    format.match(/(\\?.)/g).forEach((f) => {
        if (f.match(/^\\/)) {
            ret.push(f.replace(/^\\/, ""));
        }
        else {
            ret.push(f in formats ? formats[f] : f);
        }
    });
    if (ret.length === 1 && typeof ret[0] === "boolean") {
        return ret[0];
    }
    return ret.join("");
}
date.defaultFormats = {
    date: "N j, Y",
    time: "P",
};
//# sourceMappingURL=date.js.map