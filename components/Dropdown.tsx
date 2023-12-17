import React, { FC, ReactElement, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Dropdown = ({ label, data, onSelect }: { label: string, data: any[], onSelect: (item: any) => void }) => {
  const DropdownButton = useRef<TouchableOpacity>();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      console.log(_fx, _fy, _w, h, _px, py);
      setDropdownTop(py + h);
      setDropdownWidth(_w);
      setDropdownLeft(_px);
    });
    setVisible(true);
  };

  const onItemPress = (item: any) => {
    setSelected(item);
    onSelect(item);
    setVisible(false);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop, width: dropdownWidth, left: dropdownLeft }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      ref={DropdownButton}
      style={[styles.button, { borderBottomRightRadius: visible ? 0 : 5, borderBottomLeftRadius: visible ? 0 : 5 }]}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={styles.buttonText} >
        {(!!selected && selected.label) || label}
      </Text>
      <Ionicons name="chevron-down" size={24} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0EEEE',
    height: 40,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});

export default Dropdown;