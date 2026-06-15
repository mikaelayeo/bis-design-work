import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';

import FontAwesomeIcon from '@react-native-vector-icons/fontawesome6-pro';

import { Colors } from '../../../../../theme/Colors';
import { Spacing } from '../../../../../theme/sizes/spacing';
import { Radius } from '../../../../../theme/sizes/radius';
import { Typography } from '../../../../../theme/sizes/typography';
import { Icons } from '../../../../../theme/sizes';
import { useScreenContext } from '../../../../../services/Context/ScreenContext';

import CircleSpinner from '../../Indicators/CircleSpinner';
import Checkbox from '../../InputFields/Checkbox';
import CustomIcon from '../../CustomIcon';
import useSelectionInteractionGuard from '../../hooks/useSelectionInteractionGuard';

import styles from './style';

export interface GridCardProps {
  /**
   * Visual flavor of the card.
   * - `default`: white surface, custom body icon (e.g. folder, file)
   * - `photo`: full-bleed image fill, caption overlays the bottom
   * - `error`: pink surface, red exclamation icon body
   * @default 'default'
   */
  type?: 'default' | 'photo' | 'error';

  /**
   * Card dimensions. `base` is 115×115, `large` is 177×150. Tablet scaling (1.25x) applies on top.
   * @default 'base'
   */
  size?: 'base' | 'large';

  /**
   * The item is mid-processing (e.g. file uploading). Body shows a spinner; header and footer are hidden.
   * @default false
   */
  isLoading?: boolean;

  /**
   * The card is a ghost placeholder while real data is loading. All content is replaced with grey shapes.
   * @default false
   */
  isSkeleton?: boolean;

  /**
   * Selection mode is active. The top-right `more` action is replaced with a checkbox; `dismiss` is hidden.
   * @default false
   */
  selectionMode?: boolean;

  /**
   * Whether this card is currently selected. Only meaningful when `selectionMode` is true.
   * Adds a pale blue background tint (unless `type='error'`, which keeps the pink).
   * @default false
   */
  isSelected?: boolean;

  /**
   * Selection change callback.
   * - `trigger: 'longPress'` always requests `selected = true`
   * - `trigger: 'press'` requests toggle behavior using `isSelected`
   */
  onSelectionChange?: (
    selected: boolean,
    trigger: 'press' | 'longPress',
  ) => void;

  /**
   * File or folder name shown in the caption row. Truncated mid-string if too long.
   */
  name?: string;

  /**
   * Body content. Ignored when `type='error'` (always shows the exclamation icon)
   * or when `isLoading`/`isSkeleton` is true.
   */
  body?:
    | {
        kind: 'icon';
        iconName?: string;
        iconSolid?: boolean;
        customIcon?: {
          path: string | string[];
          viewBox?: string;
          size?: number;
          color?: string;
        };
      }
    | { kind: 'image'; uri: string };

  /**
   * Offline availability indicator (top-left).
   * Omit to hide entirely. Renders a light cloud icon by default, dark cloud on `type='photo'`.
   */
  offlineStatus?: 'available' | 'unavailable';

  /**
   * Top-right dismiss/close action. Pill is rendered when this callback is provided.
   * Hidden during `selectionMode`.
   */
  onDismiss?: () => void;

  /**
   * Top-right overflow menu action. Pill is rendered when this callback is provided.
   * Replaced by a checkbox during `selectionMode`.
   */
  onMore?: () => void;

  /**
   * Card press callback. Routes through `onSelectionChange` when `selectionMode` is true.
   */
  onPress?: () => void;

  /**
   * Long-press callback. Fires before `onSelectionChange(true, 'longPress')`.
   */
  onLongPress?: () => void;

  /**
   * Disabled state. Reduces opacity and blocks press handlers.
   * @default false
   */
  disabled?: boolean;

  /**
   * Test identifier for automated testing. Sub-elements derive `${testID}-dismiss`, `${testID}-more`, etc.
   */
  testID?: string;
}

const OFFLINE_ICON_NAME = 'cloud-arrow-down';

/**
 * Light/dark cloud status pill shown top-left. Internal subcomponent — not exported.
 * `available=true` shows the icon at full opacity; `available=false` dims it.
 */
function OfflineStatusIcon({
  variant,
  available,
}: {
  variant: 'light' | 'dark';
  available: boolean;
}) {
  const isDark = variant === 'dark';
  return (
    <View
      style={[
        gridStyles.offlinePill,
        {
          backgroundColor: isDark
            ? 'rgba(0, 0, 0, 0.35)'
            : Colors.surface.default,
          borderColor: isDark ? 'transparent' : Colors.stroke.defaultLight,
        },
      ]}
    >
      <FontAwesomeIcon
        name={OFFLINE_ICON_NAME as any}
        iconStyle={available ? 'solid' : 'regular'}
        size={10}
        color={isDark ? Colors.icon.defaultInverse : Colors.icon.default}
      />
    </View>
  );
}

/**
 * GridCard Component — Versatile grid tile for files, folders, photos, and uploads
 *
 * A flexible card designed for grid layouts. Composes an icon/image body, a caption,
 * a top-left status indicator, and 0–2 top-right action pills. Matches the design system's
 * `M-GridCard` Figma component (Type × Size variants).
 *
 * ## 📐 Structure
 *
 * ```
 * ┌─────────────────┐
 * │ ☁         ⊗  ⋮  │  header: offline status (L) · dismiss + more (R)
 * │      📁         │  body:   icon | image | error icon | spinner | skeleton
 * │   filename.pdf  │  footer: caption (overlays body for photo, below for others)
 * └─────────────────┘
 *    Base 115×115 · Large 177×150 · +25% on tablet
 * ```
 *
 * ## 🎨 Type Variants
 *
 * | Type      | Background           | Body              | Caption position |
 * |-----------|----------------------|-------------------|------------------|
 * | `default` | White surface        | Custom icon       | Below body       |
 * | `photo`   | Image fill + scrim   | (image is body)   | Overlay bottom   |
 * | `error`   | Pink (error-lightest)| Red exclamation   | Below body       |
 *
 * ## 📏 Sizes
 *
 * | Size    | Phone     | Tablet (×1.25) |
 * |---------|-----------|----------------|
 * | `base`  | 115 × 115 | 143.75 × 143.75|
 * | `large` | 177 × 150 | 221.25 × 187.5 |
 *
 * ## ⚡ States
 *
 * - **Default**: interactive, all chrome visible
 * - **Loading**: spinner replaces body; header and footer hidden (item is processing)
 * - **Skeleton**: grey placeholder shapes; chrome props still respected as ghosts
 * - **Selection mode**: `more` replaced with checkbox; `dismiss` hidden
 * - **Selected**: pale blue background (unless `type='error'` — pink wins)
 * - **Disabled**: reduced opacity, press handlers blocked
 *
 * ## ☁ Offline Status
 *
 * Pass `offlineStatus='available' | 'unavailable'` to show the top-left cloud pill.
 * The pill auto-switches to a dark variant on `type='photo'` for legibility on imagery.
 *
 * ## ✅ Selection Mode
 *
 * - `selectionMode=true` shows a checkbox in place of the `more` action
 * - `isSelected` controls the checkbox state and the background tint
 * - Long-press anywhere on the card requests `onSelectionChange(true, 'longPress')`
 * - `dismiss` is intentionally hidden during selection — selection takes priority
 *
 * @example File picker grid
 * ```tsx
 * <GridCard
 *   type="default"
 *   name="Report Q3.pdf"
 *   body={{ kind: 'icon', iconName: 'file-pdf' }}
 *   onMore={() => openMenu(file)}
 *   onPress={() => openFile(file)}
 * />
 * ```
 *
 * @example Photo with offline status
 * ```tsx
 * <GridCard
 *   type="photo"
 *   name="Site inspection.jpg"
 *   body={{ kind: 'image', uri: photo.uri }}
 *   offlineStatus="available"
 *   onDismiss={() => removePhoto(photo.id)}
 * />
 * ```
 *
 * @example Upload tile with progress
 * ```tsx
 * <GridCard
 *   type="default"
 *   isLoading={upload.status === 'uploading'}
 *   name={upload.fileName}
 *   onDismiss={() => cancelUpload(upload.id)}
 * />
 * ```
 *
 * @example Errored upload
 * ```tsx
 * <GridCard
 *   type="error"
 *   name="hazard-sheet.pdf"
 *   onDismiss={() => removeFailedUpload(upload.id)}
 *   onMore={() => retryUpload(upload.id)}
 * />
 * ```
 *
 * @example Multi-select with long-press entry
 * ```tsx
 * <GridCard
 *   type="default"
 *   name={file.name}
 *   body={{ kind: 'icon', iconName: 'folder' }}
 *   selectionMode={selectionMode}
 *   isSelected={selectedIds.has(file.id)}
 *   onLongPress={() => setSelectionMode(true)}
 *   onSelectionChange={(selected, trigger) => {
 *     if (trigger === 'longPress') setSelectionMode(true);
 *     toggleSelection(file.id, selected);
 *   }}
 * />
 * ```
 *
 * @example Skeleton placeholder while loading
 * ```tsx
 * <GridCard isSkeleton onDismiss={() => {}} onMore={() => {}} />
 * ```
 *
 * ## 💡 Best Practices
 *
 * - Use `default` for files/folders, `photo` for images, `error` for failed states
 * - Use `isLoading` for in-flight operations (upload, transcode); `isSkeleton` for data fetches
 * - Keep `name` short — it truncates mid-string at one line
 * - Always provide `testID` for automated testing
 * - For grid layouts, wrap GridCards in a `<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>`
 */
const GridCard: React.FC<GridCardProps> = ({
  type = 'default',
  size = 'base',
  isLoading = false,
  isSkeleton = false,
  selectionMode = false,
  isSelected = false,
  onSelectionChange,
  name,
  body,
  offlineStatus,
  onDismiss,
  onMore,
  onPress,
  onLongPress,
  disabled = false,
  testID,
}) => {
  const screenContext = useScreenContext();
  const screenStyles = styles();

  const tabletScale = screenContext?.isTypeTablet ? 1.25 : 1;
  const baseDims =
    size === 'large' ? { width: 177, height: 150 } : { width: 115, height: 115 };
  const dims = {
    width: baseDims.width * tabletScale,
    height: baseDims.height * tabletScale,
  };

  const {
    handlePress,
    handleLongPress,
    handleSelectionCheckboxChange,
  } = useSelectionInteractionGuard({
    selectionMode,
    isSelected,
    disabled,
    onPress,
    onLongPress,
    onSelectionChange,
  });

  const isPhoto = type === 'photo';
  const isError = type === 'error';
  const cloudVariant: 'light' | 'dark' = isPhoto ? 'dark' : 'light';

  // Background precedence: error > selected > default
  const getBackgroundColor = () => {
    if (isError) {
      return Colors.surface.errorLightest;
    }
    if (isSelected && selectionMode) {
      return Colors.surface.primaryLightest;
    }
    return Colors.surface.default;
  };

  const renderActionPill = (
    iconName: string,
    iconSize: number,
    onPressFn: () => void,
    pillTestID?: string,
  ) => (
    <Pressable
      onPress={onPressFn}
      style={screenStyles.actionPill}
      testID={pillTestID}
      hitSlop={Spacing.small}
    >
      <FontAwesomeIcon
        name={iconName as any}
        iconStyle="solid"
        size={iconSize}
        color={Colors.icon.default}
      />
    </Pressable>
  );

  const renderHeader = () => {
    // Loading hides the entire header
    if (isLoading) {
      return <View style={screenStyles.headerEmpty} />;
    }

    return (
      <View style={screenStyles.header}>
        {/* Left: offline status */}
        <View style={screenStyles.headerLeft}>
          {offlineStatus !== undefined && (
            <OfflineStatusIcon
              variant={cloudVariant}
              available={offlineStatus === 'available'}
            />
          )}
        </View>

        {/* Right: actions or checkbox */}
        <View style={screenStyles.headerRight}>
          {isSkeleton ? (
            <>
              {onDismiss !== undefined && (
                <View style={screenStyles.actionPillSkeleton} />
              )}
              {onMore !== undefined && (
                <View style={screenStyles.actionPillSkeleton} />
              )}
            </>
          ) : selectionMode ? (
            <Checkbox
              state={isSelected ? 'selected' : 'unselected'}
              onStateChange={handleSelectionCheckboxChange}
              testID={testID ? `${testID}-selection-checkbox` : undefined}
            />
          ) : (
            <>
              {onDismiss !== undefined &&
                renderActionPill(
                  'xmark',
                  8,
                  onDismiss,
                  testID ? `${testID}-dismiss` : undefined,
                )}
              {onMore !== undefined &&
                renderActionPill(
                  'ellipsis-vertical',
                  12,
                  onMore,
                  testID ? `${testID}-more` : undefined,
                )}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={screenStyles.body}>
          <CircleSpinner size="medium" color={Colors.icon.primary} />
        </View>
      );
    }

    if (isSkeleton) {
      return (
        <View style={screenStyles.body}>
          <View style={screenStyles.skeletonBodyRect} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={screenStyles.body}>
          <FontAwesomeIcon
            name={'circle-exclamation' as any}
            iconStyle="solid"
            size={Icons.xlarge}
            color={Colors.icon.error}
          />
        </View>
      );
    }

    if (isPhoto) {
      // Image is rendered as an absolute fill on the container — body slot stays empty for layout
      return <View style={screenStyles.body} />;
    }

    if (body?.kind === 'icon') {
      if (body.customIcon) {
        return (
          <View style={screenStyles.body}>
            <CustomIcon
              path={body.customIcon.path}
              size={body.customIcon.size ?? Icons.xlarge}
              color={body.customIcon.color ?? Colors.icon.default}
              viewBox={body.customIcon.viewBox}
              testID={testID ? `${testID}-body-icon` : undefined}
            />
          </View>
        );
      }
      if (body.iconName) {
        return (
          <View style={screenStyles.body}>
            <FontAwesomeIcon
              name={body.iconName as any}
              iconStyle={body.iconSolid ? 'solid' : 'regular'}
              size={Icons.xlarge}
              color={Colors.icon.default}
            />
          </View>
        );
      }
    }

    return <View style={screenStyles.body} />;
  };

  const renderFooter = () => {
    if (isLoading) {
      return <View style={screenStyles.footerEmpty} />;
    }

    if (isSkeleton) {
      return (
        <View style={screenStyles.footer}>
          <View style={screenStyles.skeletonFooterRect} />
        </View>
      );
    }

    if (!name) {
      return null;
    }

    const captionTextStyle = isPhoto
      ? {
          fontSize: Typography.label.small.fontSize,
          lineHeight: Typography.label.small.lineHeight,
          fontFamily: Typography.label.small.fontFamily,
          fontWeight: Typography.label.small.fontWeight,
          color: Colors.text.defaultOnSurface,
        }
      : {
          fontSize: Typography.body.small.fontSize,
          lineHeight: Typography.body.small.lineHeight,
          fontFamily: Typography.body.small.fontFamily,
          fontWeight: Typography.body.small.fontWeight,
          color: Colors.text.secondary,
        };

    return (
      <View style={isPhoto ? screenStyles.footerOverlay : screenStyles.footer}>
        <Text
          style={[captionTextStyle, screenStyles.captionText]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {name}
        </Text>
      </View>
    );
  };

  const isInteractive = onPress !== undefined || onLongPress !== undefined;

  return (
    <Pressable
      testID={testID}
      onPress={isInteractive || selectionMode ? handlePress : undefined}
      onLongPress={isInteractive || selectionMode ? handleLongPress : undefined}
      disabled={
        disabled ||
        (selectionMode
          ? onSelectionChange === undefined
          : !onPress && !onLongPress)
      }
      style={({ pressed }) => [
        screenStyles.container,
        {
          backgroundColor: getBackgroundColor(),
          width: dims.width,
          height: dims.height,
          opacity: disabled ? 0.5 : 1,
        },
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      {/* Photo fill — sits beneath the header/body/footer */}
      {isPhoto && body?.kind === 'image' && (
        <>
          <Image
            source={{ uri: body.uri }}
            style={screenStyles.photoFill}
            resizeMode="cover"
          />
          {/* Solid scrim strips for status/action and caption legibility.
              TODO: swap for a linear gradient if/when the dev adds a gradient lib. */}
          <View style={screenStyles.photoTopScrim} />
          <View style={screenStyles.photoBottomScrim} />
        </>
      )}

      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </Pressable>
  );
};

// Internal styles for OfflineStatusIcon (kept inline so it stays co-located).
const gridStyles = StyleSheet.create({
  offlinePill: {
    width: 18,
    height: 18,
    borderRadius: Radius.rounded,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default GridCard;
