import { StyleSheet } from 'react-native';

import { Colors } from '../../../../../theme/Colors';
import { Spacing } from '../../../../../theme/sizes/spacing';
import { Radius } from '../../../../../theme/sizes/radius';
import { Typography } from '../../../../../theme/sizes/typography';

const styles = () =>
  StyleSheet.create({
    // Outer container
    container: {
      width: '100%',
    },
    containerEmpty: {
      // Empty state shows the CTA card alone — no outer wrapper needed
    },
    containerPopulated: {
      // Populated states sit inside a white card with a light border
      backgroundColor: Colors.surface.default,
      borderColor: Colors.stroke.defaultLight,
      borderWidth: 1,
      borderRadius: Radius.base,
      overflow: 'hidden',
    },

    // CTA card (Upload button + description)
    // Renders rounded standalone (empty state); the wrapper's overflow:hidden
    // clips the bottom corners when nested in populated state.
    ctaCard: {
      width: '100%',
      backgroundColor: Colors.surface.secondaryLightestAlt,
      // ^ Figma uses color/surface/secondary-lightest-2 (#f8f8f9). If the theme
      // doesn't have this token, fall back to Colors.surface.secondaryLightest.
      borderRadius: Radius.base,
      paddingVertical: Spacing.medium,
      paddingHorizontal: Spacing.medium,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xsmall,
    },
    descriptionText: {
      fontSize: Typography.body.small.fontSize,
      lineHeight: Typography.body.small.lineHeight,
      fontFamily: Typography.body.small.fontFamily,
      fontWeight: Typography.body.small.fontWeight,
      color: Colors.text.secondary,
      textAlign: 'center',
    },

    // List mode — file rows area
    listArea: {
      paddingVertical: Spacing.xsmall,
    },

    // Grid mode — file tiles area (flex-wrap row of GridCards)
    gridArea: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.small,
      padding: Spacing.small,
    },
  });

export default styles;
