import React, { useRef, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CycleScreen = () => {
  const profile = useSelector((state: RootState) => state.profile.data);
  const insights = useSelector((state: RootState) => state.insights.data?.insights || []);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const snapPoints = useMemo(() => ['25%', '50%', '68%'], []);

  const cycleDays = 28;
  const bleedingDays = [1, 2, 3, 4];
  const fertilityDays = [12, 13, 14, 15];
  const ovulationDay = 14;
  
  const renderDots = () => {
    const dots = [];
    const radius = 120; // Arc radius
    const centerX = 150; // Arc center X
    const centerY = isBottomSheetOpen ? 140 : 150; // Arc center Y, BottomSheet açıkken yukarı kaydır
    
    const angleStep = 180 / (cycleDays / 2); // Half arc, so we divide by half of the total days
    const arcStartAngle = 180; // Start angle for half arc (bottom half)
  
    for (let i = 0; i < cycleDays; i++) {
      // Adjust angle to fit the bottom half of the circle
      const angle = arcStartAngle + (i * angleStep);
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
  
      let backgroundColor = '#ccc'; // Default gray color
      let size = isBottomSheetOpen ? 10 : 20; // Default dot size
  
      if (!isBottomSheetOpen) {
        if (bleedingDays.includes(i + 1)) {
          backgroundColor = '#f7957b';
        } else if (i + 1 === ovulationDay) {
          backgroundColor = '#388e3c';
        }
        size = 20;
      } else {
        if (bleedingDays.includes(i + 1)) {
          backgroundColor = '#f7957b';
          size = 35;
        } else if (fertilityDays.includes(i + 1)) {
          backgroundColor = '#a8e6cf';
          size = 35;
        }
        if (i + 1 === ovulationDay) {
          backgroundColor = '#388e3c';
          size = 35;
        }
      }
  
      const isDotVisible =
        !isBottomSheetOpen || bleedingDays.includes(i + 1) || i + 1 === ovulationDay || fertilityDays.includes(i + 1);
  
      if (isDotVisible) {
        dots.push(
          <View
            key={i}
            style={[styles.dot, { 
              backgroundColor, 
              left: x - size / 2, 
              top: y - size / 2, 
              width: size, 
              height: size,
              borderRadius: size / 2 
            }]}
          />
        );
      }
    }
  
    return dots;
  };
  
  const handleBottomSheetChange = (index: number) => {
    if (index > 0) {
      setIsBottomSheetOpen(true); 
    } else {
      setIsBottomSheetOpen(false); 
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Current date */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{currentDate}</Text>
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
          index={0} // Initially closed
          snapPoints={snapPoints}
          animateOnMount={true}
          enableDynamicSizing={false}
          onChange={handleBottomSheetChange}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.bottomSheetTitle}>Insights</Text>
            {insights && insights.length > 0 ? (
              insights.map((insight) => (
                <View key={insight._id} style={styles.insightItem}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightText}>{insight.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.insightText}>No insights available.</Text>
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
    top: 100, // Normalde aşağıda
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
