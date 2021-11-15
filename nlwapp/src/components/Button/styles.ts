import { FONTS } from './../../theme/fonts';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    height: 48,
    width: '100%',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center'
    
  },
  title:{
    fontSize: 14,
    fontFamily: FONTS.BOLD
  },
  icon:{
    marginRight: 12
  }
  
});