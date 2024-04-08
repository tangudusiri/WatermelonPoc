/* eslint-disable no-undef */
import React from 'react';
import Styles from './styles';
import { View, Text, Image, } from 'react-native';
import styles from './styles';
import HR from '../HR';

export default Stepper = ({ activeStep, steps }) => {
  return (
    <View>
    <View style={Styles.StepperContainer}>
      <View style={Styles.StepperBody}>
        {steps.map((item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
              }}
              key={index}>
              <View>
                <View style={styles.StepIndicatorArea}>
                  {activeStep < index + 1 ? (
                    <View style={styles.inActiveStepSubContainer} >
                      <Text style={styles.inactiveText}>{index + 1}</Text>
                    </View>
                  ) : (
                    <View style={styles.activeStepSubContainer}>
                      {activeStep > index + 1 ?
                        <Image
                          source={activeStep > index + 1 ? require('../assets/tick.png') : ''}
                          style={activeStep > index + 1 ? styles.checkedIcon : null}
                        /> :
                        <View style={styles.stepIcon}>
                          <Text style={styles.inactiveText}>{index + 1}</Text>
                        </View>
                      }
                    </View>
                  )}
                </View>
                <Text style={[styles.stepTitle, activeStep <= index && { color: '#809397' }]}>
                  {item.title}
                </Text>
              </View>
              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.dashedLine,
                    // activeStep > index + 1 && {
                    //   borderStyle: 'solid',
                    //   borderColor: '#00C1BC',
                    // },
                  ]}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
      <HR/>
    </View>
  );
};
