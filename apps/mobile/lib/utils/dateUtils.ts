export function formatHistoryDate(dateStr: string): string {
  try {
    const safeStr =
      typeof dateStr === "string" && !dateStr.endsWith("Z")
        ? `${dateStr}Z`
        : dateStr;
    const d = new Date(safeStr);
    if (isNaN(d.getTime())) return "Waktu tidak diketahui";
    const wTime = new Date(d.getTime() + 7 * 3600000);
    const day = wTime.getUTCDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Ags",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const month = months[wTime.getUTCMonth()];
    const year = wTime.getUTCFullYear();
    const hh = String(wTime.getUTCHours()).padStart(2, "0");
    const mm = String(wTime.getUTCMinutes()).padStart(2, "0");
    return `${day} ${month} ${year} • ${hh}:${mm} WIB`;
  } catch (e) {
    return "Waktu tidak diketahui";
  }
}

export function getWeekDates() {
  const realNow = new Date();
  const utc = realNow.getTime() + realNow.getTimezoneOffset() * 60000;
  const today = new Date(utc + 7 * 3600000);

  const currentDay = today.getDay();
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const week = [];
  const daysArr = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  const shortDaysArr = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  let initialActive = "Senin";

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isToday =
      d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
    if (isToday) {
      initialActive = daysArr[i];
    }
    week.push({
      fullDay: daysArr[i],
      shortDay: shortDaysArr[i],
      dateNum: d.getDate(),
      isToday,
      isPast: d.getTime() < todayStart.getTime(),
    });
  }

  return { week, initialActive };
}
