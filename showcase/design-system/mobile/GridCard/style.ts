import { StyleSheet } from 'react-native';

import { Colors } from '../../../../../theme/Colors';
import { Spacing } from '../../../../../theme/sizes/spacing';
import { Radius } from '../../../../../theme/sizes/radius';

const styles = () =>
  StyleSheet.create({
    container: {
      borderRadius: Radius.medium,
      padding: Spacing.xsmall,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Header row (top): offline status left, actions/checkbox right
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    headerEmpty: {
      height: 18,
      width: '100%',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.small,
    },

    // Action pill (X dismiss / overflow more)
    actionPill: {
      width: 18,
      height: 18,
      borderRadius: Radius.rounded,
      backgroundColor: Colors.surface.secondaryLightest,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    actionPillSkeleton: {
      width: 18,
      height: 18,
      borderRadius: Radius.rounded,
      backgroundColor: Colors.surface.secondaryLightest,
    },

    // Body (middle): icon / image / spinner / skeleton rect
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      overflow: 'hidden',
    },
    skeletonBodyRect: {
      width: 35,
      height: 35,
      borderRadius: Radius.base,
      backgroundColor: Colors.surface.secondaryLightest,
    },

    // Footer (bottom): caption text
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      overflow: 'hidden',
    },
    footerEmpty: {
      height: 20,
      width: '100%',
    },
    footerOverlay: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '100%',
      overflow: 'hidden',
    },
    captionText: {
      textAlign: 'center',
    },
    skeletonFooterRect: {
      flex: 1,
      height: 14,
      borderRadius: Radius.base,
      backgroundColor: Colors.surface.secondaryLightest,
    },

    // Photo type — image fill + scrims
    photoFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: Radius.medium,
    },
    photoTopScrim: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 36,
      backgroundColor: 'rgba(25, 25, 25, 0.3)',
      borderTopLeftRadius: Radius.medium,
      borderTopRightRadius: Radius.medium,
    },
    photoBottomScrim: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 28,
      backgroundColor: 'rgba(25, 25, 25, 0.4)',
      borderBottomLeftRadius: Radius.medium,
      borderBottomRightRadius: Radius.medium,
    },
  });

export default styles;
