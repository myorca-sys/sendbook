import React from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { X, Save } from "lucide-react-native";
import { Theme } from "../../lib/theme";
import { PRESET_AVATARS } from "../../lib/constants/presetAvatars";
import { PRESET_BANNERS } from "../../lib/constants/presetBanners";
import { styles } from "./EditProfileModalStyles";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  editForm: { name: string; bio: string; avatar: string; banner: string };
  setEditForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      bio: string;
      avatar: string;
      banner: string;
    }>
  >;
  onSave: () => void;
}

export function EditProfileModal({
  visible,
  onClose,
  editForm,
  setEditForm,
  onSave,
}: EditProfileModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profil</Text>
            <Pressable onPress={onClose} style={styles.closeModalBtn}>
              <X size={24} color={Theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Nama Tampilan</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.name}
              onChangeText={(text) => setEditForm((prev) => ({ ...prev, name: text }))}
              placeholder="Masukkan nama"
              placeholderTextColor={Theme.colors.textDim}
            />

            <Text style={styles.inputLabel}>Bio Singkat</Text>
            <TextInput
              style={styles.textInput}
              value={editForm.bio}
              onChangeText={(text) => setEditForm((prev) => ({ ...prev, bio: text }))}
              placeholder="Tulis bio singkat..."
              placeholderTextColor={Theme.colors.textDim}
            />

            <Text style={styles.inputLabel}>Pilih Avatar</Text>
            <View style={styles.gridContainer}>
              {PRESET_AVATARS.map((url, i) => (
                <Pressable
                  key={i}
                  onPress={() => setEditForm((prev) => ({ ...prev, avatar: url }))}
                  style={[
                    styles.avatarOption,
                    editForm.avatar === url && styles.avatarOptionSelected,
                  ]}
                >
                  <Image source={{ uri: url }} style={StyleSheet.absoluteFill} contentFit="cover" />
                </Pressable>
              ))}
            </View>

            <Text style={styles.inputLabel}>Pilih Banner Profile</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={PRESET_BANNERS}
              keyExtractor={(_, index) => String(index)}
              style={styles.bannerScroll}
              contentContainerStyle={styles.bannerScrollContent}
              renderItem={({ item: banner }) => (
                <Pressable
                  onPress={() => setEditForm((prev) => ({ ...prev, banner: banner.url }))}
                  style={[
                    styles.bannerOption,
                    editForm.banner === banner.url && styles.bannerOptionSelected,
                  ]}
                >
                  <Image
                    source={{ uri: banner.url }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.bannerOptionLabel}>
                    <Text style={styles.bannerOptionText}>{banner.name}</Text>
                  </View>
                </Pressable>
              )}
            />
            <View style={{ height: 40 }} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable onPress={onSave} style={styles.saveButton}>
              <Save size={18} color={Theme.colors.background} />
              <Text style={styles.saveButtonText}>Simpan Profil</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
