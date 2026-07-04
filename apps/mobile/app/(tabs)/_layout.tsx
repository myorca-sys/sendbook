import { Tabs } from "expo-router";
import { House, Calendar, Bookmark, CircleUser } from "lucide-react-native";
import { useAuth } from "../../lib/auth";
import { Theme } from "../../lib/theme";
import { TabIcon } from "../../components/ui/TabIcon";

export default function TabLayout() {
  const { user } = useAuth();
  const userImg =
    user?.image || user?.picture || user?.avatarUrl || user?.avatar;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Theme.colors.background,
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: Theme.layout.tabBar.height,
          paddingBottom: Theme.layout.tabBar.paddingBottom,
        },
        tabBarActiveTintColor: Theme.colors.text,
        tabBarInactiveTintColor: Theme.colors.text,
        tabBarLabelStyle: {
          fontSize: Theme.layout.tabBar.fontSize,
          fontWeight: Theme.layout.tabBar.fontWeight,
          marginTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={House} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Jadwal",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Calendar} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "Koleksi",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Bookmark} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              IconComponent={CircleUser}
              color={color}
              focused={focused}
              isProfile={true}
              userImg={userImg}
            />
          ),
        }}
      />
    </Tabs>
  );
}
