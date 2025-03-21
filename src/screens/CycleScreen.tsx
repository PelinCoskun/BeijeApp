import React, { useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const CycleScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.data);
  const insights = useSelector((state: RootState) => state.insights.data?.insights || []);
  const menstruationNotes = useSelector((state: RootState) => state.menstruation.menstruationDays || []);
 
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    month: 'long',
    day: 'numeric',
  });
  
  const bottomSheetTranslateY = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ['25%', '50%', '68%'], []);
  const [selectedDay, setSelectedDay] = useState<number | null>(1);

  const cycleDays = 28;
  const bleedingDays = [1, 2, 3, 4];
  const fertilityDays = [13, 14, 15];
  const ovulationDay = 14;
  
  const dotScale = useRef(new Animated.Value(1)).current;

  const animateDots = (isOpening: boolean) => {
    Animated.timing(dotScale, {
      toValue: isOpening ? 1.5 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderDots = () => {
    const dots: JSX.Element[] = [];
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    const angleStep = isBottomSheetOpen ? 160 / (bleedingDays.length + fertilityDays.length) : 180 / (cycleDays / 2);
    const arcStartAngle = isBottomSheetOpen ? 200 : 180;
  
    const bigDays = isBottomSheetOpen ? [...bleedingDays, ...fertilityDays] : Array.from({ length: cycleDays }, (_, i) => i + 1);
  
    bigDays.forEach((day, index) => {
      const angle = arcStartAngle + index * angleStep;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
  
      let backgroundColor = '#ccc';
      let size = isBottomSheetOpen ? 30 : 20;
      let borderWidth = 0;
      let borderColor = 'transparent';
  
      if (bleedingDays.includes(day)) {
        backgroundColor = '#f7957b';
      } else if (fertilityDays.includes(day)) {
        backgroundColor = '#a8e6cf';
      }
      if (day === ovulationDay) {
        backgroundColor = '#388e3c';
      }
  
     
      if (selectedDay === day) {
        size = 35;
        borderWidth = 4; 
        borderColor = '#cdcfd1'; 
      }
  
      dots.push(
        <TouchableOpacity
          key={day}
          onPress={() => handleDotPress(day)}
          activeOpacity={0.7}
          style={{
            position: 'absolute',
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth,
            borderColor,
          }}
        >
          
          {selectedDay === day && (
            <View style={{
              width: size / 2,
              height: size / 2,
              borderRadius: size / 4,
              backgroundColor: '#cdcfd1',
            }} />
          )}
        </TouchableOpacity>
      );
    });
  
    
    if (!isBottomSheetOpen && selectedDay) {
      dots.push(
        <Text
          key="selectedDayText"
          style={{
            position: 'absolute',
            top: centerY - 10,
            left: centerX - 20,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {`${selectedDay}. Gün`}
        </Text>
      );
    }
  
    return dots;
  };
  
  

  const animateBottomSheet = (index: number) => {
    Animated.timing(bottomSheetTranslateY, {
      toValue: index > 0 ? -100 : 0, 
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const handleBottomSheetChange = (index: number) => {
    setIsBottomSheetOpen(index > 0);
    animateBottomSheet(index);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]; 
  };
  
  const handleDotPress = (day: number) => {
    setSelectedDay(day);
    bottomSheetRef.current?.expand();
  };
  
  
  const getMenstruationNoteForDay = (day: number) => {
    const today = new Date();
    today.setDate(day);
    const formattedDate = formatDate(today);
  
    const dayData = menstruationNotes.find((entry) => entry.date === formattedDate);
    return dayData ? dayData.note : null;
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <LinearGradient colors={['#fcebe4', '#ffffff']} style={styles.gradientBackground}>
      <View style={styles.container}>
        {/* Current date */}
        <View style={styles.dateContainer}>
  <Text style={styles.dateText}>
    {`${currentDate} `}
    <Text style={{ fontWeight: 'normal' }}>Bugün</Text>
  </Text>
</View>

        {/* Arc or Main Circle image */}
        <View style={[styles.arcContainer, isBottomSheetOpen && { top: 100 }]}>
  <Image
    source={require('../../assets/images/arc.png')}
    style={styles.arcImage}
  />
  {renderDots()}
</View>



        {/* Initial Circle (First letter of profile name) */}
        <View style={styles.initialCircle}>
          <Text style={styles.initialText}>
            {profile?.profileInfo?.firstName?.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Notification Button */}
        <TouchableOpacity style={styles.notificationButton}>
          <Image
            source={require('../../assets/images/bell-02-orange.png')}
            style={styles.notificationImage}
          />
        </TouchableOpacity>

        {/* Bottom Sheet */}
        <BottomSheet
  ref={bottomSheetRef}
  index={0} 
  snapPoints={snapPoints}
  animateOnMount={true}
  enableDynamicSizing={false}
  onChange={handleBottomSheetChange}
>
  <View style={styles.contentContainer}>
    <Text style={styles.bottomSheetTitle}>
      {selectedDay ? `${selectedDay}. Gün` : 'Gün Seçilmedi'}
    </Text>
<Text style={{
      fontWeight: 'bold',
      marginTop: 20,
    }}>Bugünkü Öne Çıkanlar</Text>
    {/* Seçili gün varsa menstrüasyon notlarını göster */}
    {selectedDay && getMenstruationNoteForDay(selectedDay) && (
      <View>
        <Text>{getMenstruationNoteForDay(selectedDay)}</Text>
      </View>
    )}

    {/* Insights verilerini göster */}
    <Text style={{ fontWeight: 'bold' }}></Text>
    {insights.length > 0 ? (
      insights.map((insight) => (
        <Text key={insight._id}>{insight.title}</Text>
      ))
    ) : (
      <Text>Henüz insight yok.</Text>
    )}
  </View>
</BottomSheet>


        {/* Bottom Bar with Buttons */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Image
              source={require('../../assets/images/icon1.png')}
              style={[styles.icon, { tintColor: '#f7957b' }]}
            />
            <Text style={[styles.bottomBarText, { color: '#000' }]}>Döngü</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Image
              source={require('../../assets/images/icon2.png')}
              style={[styles.icon, { tintColor: '#ccc' }]}
            />
            <Text style={[styles.bottomBarText, { color: '#ccc' }]}>Takvim</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Image
              source={require('../../assets/images/icon3.png')}
              style={[styles.icon, { tintColor: '#ccc' }]}
            />
            <Text style={[styles.bottomBarText, { color: '#ccc' }]}>Analiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Image
              source={require('../../assets/images/icon4.png')}
              style={[styles.icon, { tintColor: '#ccc' }]}
            />
            <Text style={[styles.bottomBarText, { color: '#ccc' }]}>Rehber</Text>
          </TouchableOpacity>
        </View>
      </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default CycleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'linear-gradient(180deg, #fcebe4, #ffffff)',
  },
  gradientBackground: {
    flex: 1, 
  },
  
  dateContainer: {
    alignItems: 'center',
    marginTop: 30,
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
    tintColor: '#f7957b',
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
    position: 'absolute',
    top: 100, 
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
  contentContainer: {
    backgroundColor: '#fff',
    padding: 20,
    height: 300,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
});
