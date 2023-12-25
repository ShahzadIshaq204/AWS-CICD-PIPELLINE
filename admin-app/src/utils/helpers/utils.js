export function truncateString(str, num) {
  if (!str) return " --- ";

  if (str.length <= num) {
    return str;
  }

  return str.slice(0, num) + "...";
}

export function numberWithThousandSeparator(x) {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : x;
}

/* date helpers */
export function convertDate(inputFormat) {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
}
export function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function subtractDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function newDate(str) {
  if (str) {
    return new Date(str);
  }
  return null;
}

export const formatApiDate = date => {
  //2022-04-23T23:14:25.000000Z
  try {
    const [d, h] = date.split("T");
    return d + " " + h.split(".")[0];
  } catch {
    return null;
  }
};

export function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
