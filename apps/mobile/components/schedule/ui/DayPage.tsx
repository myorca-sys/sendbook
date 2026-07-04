import React, { memo, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { ScheduleCard } from "./ScheduleCard";
import { Theme } from "../../../lib/theme";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

interface DayPageProps {
  dayPage: any;
  user: any;
}

export const DayPage = memo(({ dayPage, user }: DayPageProps) => {
  const isToday = dayPage.isToday;
  const isPast = dayPage.isPast;

  const renderItemFn = useCallback(
    ({ item, index }: any) => {
      return (
        <ScheduleCard
          item={item}
          idx={index}
          isToday={isToday}
          isPast={isPast}
          user={user}
        />
      );
    },
    [isToday, isPast, user],
  );

  return (
    <View style={{ width: WINDOW_WIDTH }}>
      {dayPage.data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tidak ada rilis pada hari ini.</Text>
        </View>
      ) : (
        <FlatList<any>
          showsVerticalScrollIndicator={false}
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          data={dayPage.data}
          keyExtractor={(item: any, index: number) =>
            String(item.anilistId || item.id || "") + "-" + index
          }
          renderItem={renderItemFn}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 120,
    paddingTop: 10,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Theme.colors.textDim,
    fontSize: 16,
    fontWeight: "500",
  },
});
