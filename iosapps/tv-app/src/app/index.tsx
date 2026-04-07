import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable, Linking } from 'react-native';
import dealsData from '../assets/deals.json';

type Deal = {
  id: string;
  model: string;
  currentPrice: number;
  originalPrice: number;
  discountPct: number;
  retailerLink: string;
  imageUrl: string;
};

const DealCard = ({ deal }: { deal: Deal }) => (
  <View style={styles.card}>
    <Text style={styles.model}>{deal.model}</Text>
    <View style={styles.priceContainer}>
      <Text style={styles.currentPrice}>${deal.currentPrice.toFixed(2)}</Text>
      <Text style={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</Text>
      <Text style={styles.discount}>{deal.discountPct}% OFF</Text>
    </View>
    <Pressable 
      style={styles.button} 
      onPress={() => Linking.openURL(deal.retailerLink)}
    >
      <Text style={styles.buttonText}>View Deal</Text>
    </Pressable>
  </View>
);

export default function DealsFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest Deals</Text>
      <FlatList
        data={dealsData.deals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DealCard deal={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  listContent: { gap: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  model: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  currentPrice: { fontSize: 16, fontWeight: 'bold', color: '#e53935' },
  originalPrice: { fontSize: 14, color: '#9e9e9e', textDecorationLine: 'line-through' },
  discount: { fontSize: 14, fontWeight: 'bold', color: '#43a047' },
  button: { backgroundColor: '#2196f3', padding: 10, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
