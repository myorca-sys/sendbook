import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, RefreshControl, Image } from 'react-native'
import { useAuth } from '../../lib/auth'
import { useToast } from '../../lib/toast'
import { apiWithToken, uploadImage } from '../../lib/api'
import { theme } from '../../lib/theme'
import * as ImagePicker from 'expo-image-picker'

export default function ProductsScreen() {
  const { token, store } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState<string[]>([])

  const load = async () => {
    if (!token || !store?.slug) return
    try {
      const p = await apiWithToken(`/api/stores/${store.slug}/products`, token)
      setProducts(p)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [token, store?.slug])

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false) }

  const openAdd = () => {
    setEditing(null); setName(''); setPrice(''); setDesc(''); setCategory(''); setImages([]); setModal(true)
  }

  const openEdit = (p: any) => {
    setEditing(p); setName(p.name); setPrice(String(p.price)); setDesc(p.description || ''); setCategory(p.category || ''); setImages(p.images || []); setModal(true)
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, quality: 0.8 })
    if (!result.canceled && result.assets[0] && token) {
      const { uri } = result.assets[0]
      const ext = uri.split('.').pop() || 'jpg'
      const file = { uri, name: `product.${ext}`, type: `image/${ext}` } as any
      const data = await uploadImage(token, file)
      setImages([data.url, ...images])
    }
  }

  const save = async () => {
    if (!name || !price) { showToast('Nama dan harga wajib diisi', 'error'); return }
    if (!store?.slug) { showToast('Toko tidak ditemukan', 'error'); return }
    const body = { name, price: parseInt(price), description: desc, category, images }
    try {
      if (editing) {
        await apiWithToken(`/api/products/${editing.id}`, token!, { method: 'PATCH', body: JSON.stringify(body) })
      } else {
        await apiWithToken(`/api/stores/${store.slug}/products`, token!, { method: 'POST', body: JSON.stringify(body) })
      }
      setModal(false)
      showToast(editing ? 'Produk diperbarui' : 'Produk ditambahkan', 'success')
      await load()
    } catch (e: any) { showToast(e.message, 'error') }
  }

  const deleteProduct = (id: string) => {
    Alert.alert('Hapus produk?', '', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
        try {
          await apiWithToken(`/api/products/${id}`, token!, { method: 'DELETE' })
          showToast('Produk dihapus', 'success')
          await load()
        } catch (e: any) { showToast(e.message, 'error') }
      }},
    ])
  }

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => openEdit(item)}>
      <View style={styles.itemLeft}>
        {item.images?.[0] ? (
          <Image source={{ uri: item.images[0] }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}><Text style={styles.thumbEmoji}>📦</Text></View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.itemPrice}>Rp{Number(item.price).toLocaleString('id-ID')}</Text>
          {item.category && <Text style={styles.itemCat}>{item.category}</Text>}
        </View>
      </View>
      <TouchableOpacity onPress={() => deleteProduct(item.id)}><Text style={styles.del}>✕</Text></TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produk</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={renderProduct}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada produk. Tap + untuk menambah.</Text>}
      />

      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Produk' : 'Tambah Produk'}</Text>
            <TouchableOpacity onPress={() => setModal(false)}><Text style={{ fontSize: 18, color: theme.textMuted }}>✕</Text></TouchableOpacity>
          </View>

          <Text style={styles.label}>Nama</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nasi Goreng" placeholderTextColor={theme.textMuted} />

          <Text style={styles.label}>Harga (Rp)</Text>
          <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="number-pad" placeholder="25000" placeholderTextColor={theme.textMuted} />

          <Text style={styles.label}>Deskripsi</Text>
          <TextInput style={[styles.input, { minHeight: 80 }]} value={desc} onChangeText={setDesc} multiline placeholder="Deskripsi produk..." placeholderTextColor={theme.textMuted} />

          <Text style={styles.label}>Kategori</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Makanan Berat" placeholderTextColor={theme.textMuted} />

          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>{images.length ? '📷 Ganti Foto' : '📷 Tambah Foto'}</Text>
          </TouchableOpacity>

          {!!images.length && <Image source={{ uri: images[0] }} style={styles.preview} />}

          <TouchableOpacity style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveBtnText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 12 },
  title: { fontSize: theme.fontSize['2xl'], fontWeight: '700', color: theme.text },
  addBtn: { backgroundColor: theme.primary, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '600', lineHeight: 26 },
  item: { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.sm, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  thumb: { width: 48, height: 48, borderRadius: 8 },
  thumbPlaceholder: { backgroundColor: theme.borderLight, alignItems: 'center', justifyContent: 'center' },
  thumbEmoji: { fontSize: 20 },
  itemName: { fontSize: theme.fontSize.md, fontWeight: '600', color: theme.text },
  itemPrice: { fontSize: theme.fontSize.sm, fontWeight: '700', color: theme.primary, marginTop: 2 },
  itemCat: { fontSize: theme.fontSize.xs, color: theme.textMuted, marginTop: 2 },
  del: { fontSize: 16, color: theme.red, paddingLeft: 12 },
  empty: { textAlign: 'center', color: theme.textDim, marginTop: 60 },
  modal: { flex: 1, backgroundColor: theme.bg, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 20 },
  modalTitle: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.text },
  label: { fontSize: theme.fontSize.sm, fontWeight: '500', color: theme.text, marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.sm, padding: 12, fontSize: theme.fontSize.md, backgroundColor: theme.surface, color: theme.text },
  imageBtn: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.sm, padding: 14, alignItems: 'center', marginTop: 16, borderStyle: 'dashed' },
  imageBtnText: { fontSize: theme.fontSize.md, color: theme.primary, fontWeight: '500' },
  preview: { width: 100, height: 100, borderRadius: theme.radius.sm, marginTop: 12, alignSelf: 'center' },
  saveBtn: { backgroundColor: theme.primary, paddingVertical: 14, borderRadius: theme.radius.sm, alignItems: 'center', marginTop: 24 },
  saveBtnText: { color: '#fff', fontSize: theme.fontSize.md, fontWeight: '600' },
})
