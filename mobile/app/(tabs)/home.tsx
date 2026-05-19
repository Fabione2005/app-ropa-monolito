import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Colors from '../../constants/Colors';

// ─── Datos placeholder ────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: '1', emoji: '👚', label: 'Blusas' },
  { id: '2', emoji: '👖', label: 'Pantalones' },
  { id: '3', emoji: '👗', label: 'Vestidos' },
  { id: '4', emoji: '🩱', label: 'Faldas' },
  { id: '5', emoji: '👕', label: 'Poleras' },
];

const SELLERS = [
  { id: '1', initials: 'LL', name: 'LauraLopez',    bg: '#E91E63' },
  { id: '2', initials: 'LO', name: 'LeilaOrcando',  bg: '#9C27B0' },
  { id: '3', initials: 'MJ', name: 'MariaJose12',   bg: '#3F51B5' },
];

type Product = {
  id: string;
  name: string;
  size: string;
  price: number;
  salePrice?: number;
};

const PRODUCTS: Product[] = [
  { id: '1', name: 'Zapatos negros',   size: '37', price: 10000 },
  { id: '2', name: 'Falda de cuadros', size: 'M',  price: 10000, salePrice: 7000 },
  { id: '3', name: 'Vestido de cuero', size: 'L',  price: 12000 },
  { id: '4', name: 'Blusa floral',     size: 'S',  price: 8000 },
];

const clp = (n: number) => `$${n.toLocaleString('es-CL')} CLP`;

// ─── Componente ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [search, setSearch]   = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'profile'>('home');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── Contenido scrollable ── */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.logo}>
            <Text style={styles.logoLetter}>F</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.headerIconText}>🤍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Text style={styles.headerIconText}>🛍️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BANNER */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>¡Ofertas especiales para ti! ✨</Text>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Text style={styles.searchLupa}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar"
              placeholderTextColor={Colors.placeholder}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.helpBtn}>
            <Text style={styles.helpText}>?</Text>
          </TouchableOpacity>
        </View>

        {/* CATEGORÍAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catsContent}
          style={styles.catsScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View style={styles.catCircle}>
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SECCIÓN PRODUCTOS DESTACADOS */}
        <View style={styles.featured}>
          <Text style={styles.featuredTitle}>PRODUCTOS DESTACADOS</Text>

          {/* Vendedoras */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sellersContent}
          >
            {SELLERS.map(s => (
              <TouchableOpacity key={s.id} style={styles.sellerItem}>
                <View style={[styles.sellerAvatar, { backgroundColor: s.bg }]}>
                  <Text style={styles.sellerInitials}>{s.initials}</Text>
                </View>
                <Text style={styles.sellerName} numberOfLines={1}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Grid 2 columnas */}
          <View style={styles.grid}>
            {PRODUCTS.map((p, i) => (
              <TouchableOpacity
                key={p.id}
                style={[styles.card, i % 2 === 0 ? styles.cardLeft : styles.cardRight]}
              >
                {/* Foto placeholder */}
                <View style={styles.cardImg}>
                  {p.salePrice && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>REBAJAS</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.cardHeart}>
                    <Text style={styles.cardHeartIcon}>🤍</Text>
                  </TouchableOpacity>
                </View>

                {/* Info */}
                <Text style={styles.cardName} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.cardSize}>TALLA {p.size}</Text>

                {p.salePrice ? (
                  <>
                    <Text style={styles.priceSlash}>{clp(p.price)}</Text>
                    <Text style={styles.priceSale}>{clp(p.salePrice)}</Text>
                  </>
                ) : (
                  <Text style={styles.price}>{clp(p.price)}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Espacio para el tab bar */}
        <View style={{ height: 72 }} />
      </ScrollView>

      {/* ── TAB BAR CUSTOM ── */}
      <View style={styles.tabBar}>
        {(
          [
            { key: 'home',    emoji: '🏠', label: 'Home' },
            { key: 'chat',    emoji: '💬', label: 'Chat' },
            { key: 'profile', emoji: '👤', label: 'Perfil' },
          ] as const
        ).map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabEmoji}>{tab.emoji}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconBtn: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 22,
    color: Colors.text,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconText: {
    fontSize: 22,
  },

  // Banner
  banner: {
    height: 80,
    backgroundColor: '#6C47FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Búsqueda
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchLupa: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  helpBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.placeholder,
  },

  // Categorías
  catsScroll: {
    marginBottom: 20,
  },
  catsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  catItem: {
    alignItems: 'center',
    width: 68,
  },
  catCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catEmoji: {
    fontSize: 26,
  },
  catLabel: {
    fontSize: 11,
    color: Colors.text,
    textAlign: 'center',
  },

  // Productos destacados
  featured: {
    paddingHorizontal: 16,
  },
  featuredTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E53935',
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  // Vendedoras
  sellersContent: {
    gap: 16,
    marginBottom: 18,
  },
  sellerItem: {
    alignItems: 'center',
    width: 62,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  sellerInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sellerName: {
    fontSize: 10,
    color: Colors.text,
    textAlign: 'center',
  },

  // Grid productos
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '50%',
    marginBottom: 18,
  },
  cardLeft: {
    paddingRight: 8,
  },
  cardRight: {
    paddingLeft: 8,
  },
  cardImg: {
    height: 160,
    backgroundColor: '#E8E8E8',
    borderRadius: 10,
    marginBottom: 8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E53935',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  cardHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  cardHeartIcon: {
    fontSize: 18,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  cardSize: {
    fontSize: 11,
    color: Colors.placeholder,
    marginBottom: 3,
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text,
  },
  priceSlash: {
    fontSize: 11,
    color: Colors.placeholder,
    textDecorationLine: 'line-through',
  },
  priceSale: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E53935',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    paddingTop: 10,
    paddingBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabEmoji: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.placeholder,
  },
  tabLabelActive: {
    color: Colors.text,
    fontWeight: 'bold',
  },
});
