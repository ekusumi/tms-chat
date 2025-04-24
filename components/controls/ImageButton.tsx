import { View, Pressable, Image } from "react-native";

const ImageButton = ({
  image,
  styles,
  onClick,
  selected,
  selectedStyles,
}: {
  image: any;
  styles: any;
  onClick: any;
  selected?: any;
  selectedStyles?: any;
}) => {
  return (
    <View style={selected ? selectedStyles.background : styles.background}>
      <Pressable style={styles.button} onPress={onClick}>
        <Image source={image} style={styles.image} />
      </Pressable>
    </View>
  );
};

export default ImageButton;
