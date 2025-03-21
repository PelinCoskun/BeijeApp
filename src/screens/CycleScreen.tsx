import React, { useRef ,useMemo} from 'react';
import { View, Text, StyleSheet,Button, Image, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux'; // Redux'tan veri almak için useSelector
import { RootState } from '../redux/store'; // Redux store tipi
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CycleScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.data); 

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);


  const cycleDays = 28; // Döngüdeki toplam gün sayısı
  const bleedingDays = [1, 2, 3, 4]; // Kanama günleri
  const fertilityDays = [12, 13, 14, 15]; // Doğurganlık günleri
  const ovulationDay = 14; // Ovulasyon günü

  const renderDots = () => {
    const dots = [];
    const radius = 120; // Yayın yarıçapı
    const centerX = 150; // Yayın merkezi X
    const centerY = 150; // Yayın merkezi Y
    const angleStep = (360 / cycleDays); // Her nokta arasındaki açı

    for (let i = 0; i < cycleDays; i++) {
      const angle = i * angleStep;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

      let backgroundColor = '#ccc'; // Varsayılan gri renk
      if (bleedingDays.includes(i + 1)) {
        backgroundColor = '#f7957b'; // Kanama günleri için turuncu
      } else if (fertilityDays.includes(i + 1)) {
        backgroundColor = '#a8e6cf'; // Doğurganlık günleri için açık yeşil
      }
      if (i + 1 === ovulationDay) {
        backgroundColor = '#388e3c'; // Ovulasyon günü için koyu yeşil
      }

      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor,
              left: x - 10,
              top: y - 10,
            },
          ]}
        />
      );
    }

    return dots;
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* Mevcut gün */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

      {/* Yay görüntüsü */}
      <View style={styles.arcContainer}>
        <Image
          source={require('../../assets/images/arc.png')}
          style={styles.arcImage}
        />
        {renderDots()}
      </View>

      {/* Sol üst köşede ilk harf */}
      <View style={styles.initialCircle}>
        <Text style={styles.initialText}>
          {profile?.profileInfo?.firstName?.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Sağ üst köşede bildirim butonu */}
      <TouchableOpacity style={styles.notificationButton}>
        <Image
          source={require('../../assets/images/bell-02-orange.png')}
          style={styles.notificationImage}
        />
      </TouchableOpacity>
 {/* Bottom Sheet */}
 <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          animateOnMount={true}
          enableDynamicSizing={false}
        >
          <View style={styles.contentContainer}>
            <Text>Bottom Sheet Content</Text>
          </View>
        </BottomSheet>

<View style={styles.bottomBar}>
  {/* Döngü Butonu (Seçili) */}
  <TouchableOpacity style={styles.bottomBarButton}>
    <Image
      source={require('../../assets/images/icon1.png')}
      style={[styles.icon, { tintColor: '#f7957b' }]} // Seçili renk
    />
    <Text style={[styles.bottomBarText, { color: '#000' }]}>Döngü</Text> {/* Yazı rengi siyah */}
  </TouchableOpacity>

  {/* Takvim Butonu */}
  <TouchableOpacity style={styles.bottomBarButton}>
    <Image
      source={require('../../assets/images/icon2.png')}
      style={[styles.icon, { tintColor: '#ccc' }]} // Varsayılan renk
    />
    <Text style={[styles.bottomBarText, { color: '#ccc' }]}>Takvim</Text>
  </TouchableOpacity>

  {/* Analiz Butonu */}
  <TouchableOpacity style={styles.bottomBarButton}>
    <Image
      source={require('../../assets/images/icon3.png')}
      style={[styles.icon, { tintColor: '#ccc' }]} // Varsayılan renk
    />
    <Text style={[styles.bottomBarText, { color: '#ccc' }]}>Analiz</Text>
  </TouchableOpacity>

  {/* Rehber Butonu */}
  <TouchableOpacity style={styles.bottomBarButton}>
    <Image
      source={require('../../assets/images/icon4.png')}
      style={[styles.icon, { tintColor: '#ccc' }]} // Varsayılan renk
    />
    <Text style={[styles.bottomBarText, { color: '#ccc' }]}>Rehber</Text>
  </TouchableOpacity>
</View>
    </View>
    </GestureHandlerRootView>
  );
};

export default CycleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  bottomBarButton: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#f7957b', // İkon rengini ayarlayabilirsin
  },
  bottomBarText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  arcContainer: {
    position: 'relative',
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  dot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  initialCircle: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f7957b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    padding: 20,
    height: 300,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  insightItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  insightText: {
    fontSize: 16,
    color: '#333',
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    height: 300,
  },
});