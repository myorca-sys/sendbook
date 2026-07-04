import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Theme } from "../../../lib/theme";

export function ScheduleHeader({
  activeDay,
  setActiveDay,
  weekDates,
  handleDayPress,
}: any) {
  return (
    <View style={styles.header}>
      <Text style={styles.titleText}>Jadwal Rilis</Text>
      <View style={styles.pickerContainer}>
        {weekDates.map((dayObj: any, index: number) => {
          const isActive = activeDay === dayObj.fullDay;
          return (
            <Pressable
              key={dayObj.fullDay}
              onPress={() => handleDayPress(index, dayObj.fullDay)}
              style={({ pressed }) => [
                styles.dayButton,
                isActive ? styles.dayButtonActive : styles.dayButtonInactive,
                pressed && !isActive && styles.dayButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  isActive
                    ? styles.dayButtonTextActive
                    : styles.dayButtonTextInactive,
                ]}
              >
                {dayObj.shortDay}
              </Text>
              <Text
                style={[
                  styles.dateNumberText,
                  isActive
                    ? styles.dateNumberTextActive
                    : styles.dateNumberTextInactive,
                ]}
              >
                {dayObj.dateNum}
              </Text>
              {!!dayObj.isToday && (
                <View
                  style={[
                    styles.todayIndicator,
                    isActive
                      ? styles.todayIndicatorActive
                      : styles.todayIndicatorInactive,
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "500",
    color: Theme.colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    paddingVertical: 6,
  },
  dayButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    position: "relative",
  },
  dayButtonActive: { backgroundColor: "white" },
  dayButtonInactive: { backgroundColor: "transparent" },
  dayButtonPressed: { backgroundColor: "rgba(255,255,255,0.1)" },
  dayButtonText: { fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  dayButtonTextActive: { color: Theme.colors.background },
  dayButtonTextInactive: { color: Theme.colors.textDim },
  dateNumberText: { fontSize: 15, fontWeight: "900" },
  dateNumberTextActive: { color: Theme.colors.background },
  dateNumberTextInactive: { color: Theme.colors.text },
  todayIndicator: {
    position: "absolute",
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  todayIndicatorActive: { backgroundColor: Theme.colors.primary },
  todayIndicatorInactive: { backgroundColor: Theme.colors.success },
});
