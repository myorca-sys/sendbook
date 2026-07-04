import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../../lib/config";
import { fetcher } from "../../../lib/fetcher";

export function useScheduleData() {
  const [activeDay, setActiveDay] = useState<string>("Senin");
  const [weekDates, setWeekDates] = useState<any[]>([]);

  const { data: swrData, isLoading } = useQuery({
    queryKey: ["schedule", "v5"],
    queryFn: () => fetcher(`${API_URL}/api/v1/schedule`),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  useEffect(() => {
    const realNow = new Date();
    const today = new Date(realNow.getTime() + realNow.getTimezoneOffset() * 60000 + 7 * 3600000);
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const week = [];
    const daysArr = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const shortDaysArr = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    let initialActive = "Senin";

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
      if (isToday) initialActive = daysArr[i];
      week.push({
        fullDay: daysArr[i],
        shortDay: shortDaysArr[i],
        dateNum: d.getDate(),
        isToday,
        isPast: d.getTime() < todayStart.getTime(),
      });
    }
    setWeekDates(week);
    setActiveDay(initialActive);
  }, []);

  const schedData = swrData?.data || {};

  const allDaysData = useMemo(() => {
    return weekDates.map((dayObj) => {
      let items = Array.isArray(schedData[dayObj.fullDay]) ? schedData[dayObj.fullDay] : [];
      const sorted = [...items].sort((a, b) => {
        const timeA = a?.airingTime ? String(a.airingTime) : "";
        const timeB = b?.airingTime ? String(b.airingTime) : "";
        return timeA.localeCompare(timeB);
      });
      return { ...dayObj, data: sorted };
    });
  }, [schedData, weekDates]);

  return {
    activeDay,
    setActiveDay,
    weekDates,
    allDaysData,
    isLoading,
    schedData,
  };
}
