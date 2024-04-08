import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  StepperContainer: {
    flexDirection: 'column',
    width: '100%',
    padding: 10
  },
  StepperBody: {
    width: '100%',
    flexDirection: 'row',
    // marginBottom: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StepIndicatorArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    width: width * 0.06,
    height: width * 0.06,
    margin: 0,
    backgroundColor: '#005195',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkedIcon: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'cover',
    margin: 0,
  },
  stepTitle: {
    color: '#01272F',
    fontSize: 10,
    padding: 5,
    alignSelf: 'center',
    fontFamily: 'Gordita-Medium',
  },
  dashedLine: {
    width: width * 0.04,
    borderWidth: 0.5,
    borderStyle: 'solid',
    alignSelf: 'center',
    borderColor: '#9B9B9B',
    marginHorizontal: width * 0.008,
  },
  activeStepSubContainer: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: (width * 0.06) / 2,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: '#00C1BC',
    borderColor: '#005195',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inActiveStepSubContainer: {
    width: width * 0.06,
    height: width * 0.06,
    borderRadius: (width * 0.06) / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#9B9B9B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#9B9B9B"
  },
  inactiveText: {
    // textAlign: 'center',
    fontSize: 12,
    lineHeight: 12,
    color: '#FFFFFF',
  }
});
