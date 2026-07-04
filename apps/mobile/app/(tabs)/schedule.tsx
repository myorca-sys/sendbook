import React, { useRef, useCallback } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../../lib/auth";
import { Theme } from "../../lib/theme";

import { useScheduleData } from "../../components/schedule/hooks/useScheduleData";
import { DayPage } from "../../components/schedule/ui/DayPage";
import { ScheduleHeader } from "../../components/schedule/ui/ScheduleHeader";
import { ScheduleSkeleton } from "../../components/schedule/ui/ScheduleSkeleton";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

export default function ScheduleScreen() {
  const { user } = useAuth();
  const { activeDay, setActiveDay, weekDates, allDaysData, isLoading, schedData } =
    useScheduleData();
  const flatListRef = useRef<any>(null);

  const handleDayPress = useCallback(
    (index: number, dayName: string) => {
      setActiveDay(dayName);
      flatListRef.current?.scrollToIndex({ index, animated: true });
    },
    [setActiveDay],
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const newDay = viewableItems[0].item.fullDay;
      if (newDay) setActiveDay(newDay);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const renderDayPage = useCallback(
    ({ item }: { item: any }) => <DayPage dayPage={item} user={user} />,
    [user],
  );

  return (
    <View style={styles.container}>
      <ScheduleHeader
        activeDay={activeDay}
        setActiveDay={setActiveDay}
        weekDates={weekDates}
        handleDayPress={handleDayPress}
      />

      {!!isLoading && Object.keys(schedData).length === 0 ? (
        <ScheduleSkeleton />
      ) : (
        <FlatList<any>
          ref={flatListRef}
          data={allDaysData}
          keyExtractor={(item) => item.fullDay}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: WINDOW_WIDTH,
            offset: WINDOW_WIDTH * index,
            index,
          })}
          renderItem={renderDayPage}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
});
