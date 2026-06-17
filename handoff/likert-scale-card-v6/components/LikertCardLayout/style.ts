import { StyleSheet } from 'react-native';
import { Colors } from '../../../../theme/Colors';
import { Typography } from '../../../../theme/sizes';
import { Spacing } from '../../../../theme/sizes/spacing';
import { Radius } from '../../../../theme/sizes/radius';

/**
 * Reserved tap target on the right edge of each option card. Larger than the
 * visible (i) icon (14px) so thumbs can land anywhere in the strip; the icon
 * itself is the visual affordance.
 */
const INFO_ZONE_WIDTH = 44;

/**
 * Vertical thickness of the dividing line between card-blocks. Mirrors
 * the 1px DIP convention used in LikertScale/style.ts so QA doesn't see
 * dropped hairlines on high-density screens.
 */
const BORDER_WIDTH = 1;

export const styles = StyleSheet.create({
  cardBlock: {
    paddingBottom: Spacing.base,
    borderBottomWidth: BORDER_WIDTH,
    borderBottomColor: Colors.stroke.defaultLight,
    marginBottom: Spacing.base,
  },

  // Statement row — "1. {label} ⓘ"
  statementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.small,
  },
  statementText: {
    ...Typography.label.base,
    color: Colors.text.default,
    flex: 1,
  },
  statementNum: {
    // xsmall gap between "1." and the question text
    marginRight: Spacing.xsmall,
  },
  statementIconWrap: {
    // xsmall gap between the question's last word and the (i)
    marginLeft: Spacing.xsmall,
    marginTop: 4, // visual centering with first line of label
  },

  // Option grid
  optGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  // 2 columns (default)
  optGrid2: {
    // flexBasis on optCard handles the 2-col layout
  },
  // 3 columns
  optGrid3: {
    // flexBasis on optCard handles the 3-col layout via the
    // `optCard3Col` modifier passed by the parent (see optCard below).
  },

  optCard: {
    // Default 2-col basis; parent can override for 3-col via inline style.
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: Spacing.base,
    // Horizontal padding reserves layout space so the centered label
    // doesn't visually clip into the right-side info zone.
    paddingHorizontal: Spacing.large,
    backgroundColor: Colors.surface.secondarySubtle,
    borderWidth: BORDER_WIDTH,
    borderColor: Colors.stroke.default,
    borderRadius: Radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 0,
  },
  optCardSelected: {
    backgroundColor: Colors.surface.primary,
    borderColor: Colors.surface.primary,
  },
  optText: {
    ...Typography.body.base,
    color: Colors.text.default,
    textAlign: 'center',
  },
  optTextSelected: {
    color: Colors.text.defaultOnSurface,
  },

  optInfoZone: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: INFO_ZONE_WIDTH,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 6,
    paddingRight: 6,
  },

  // Comment field — same descriptionBox pattern as the matrix inline grid
  // (LikertScale/style.ts) for visual consistency.
  descriptionBox: {
    paddingTop: Spacing.small,
  },

  // Tooltip body text — same style key as LikertScale/style.ts uses for
  // its `tooltipText` so both layouts read identically inside the
  // shared <Tooltip variant="light">.
  tooltipText: {
    ...Typography.body.base,
    color: Colors.text.default,
  },
});
