/**
 * Expo Snack preview for GridCard + Upload (mobile design-system components).
 *
 * HOW TO USE:
 * 1. Go to https://snack.expo.dev/
 * 2. Paste this entire file into App.js (replace the default content)
 * 3. The right panel shows a live web preview. Switch the device dropdown to
 *    iPhone/Android to see mobile rendering.
 *
 * This is a SELF-CONTAINED preview. It inlines stub versions of SafeTapp's theme,
 * Button, Checkbox, ListItem, and the GridCard + Upload components. The production
 * (TypeScript) versions live at:
 *   - github.com/mikaelayeo/bis-design-work/tree/main/design-system/mobile/GridCard
 *   - github.com/mikaelayeo/bis-design-work/tree/main/design-system/mobile/Upload
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

// ============================================================================
// THEME STUBS (production: src/theme/*)
// ============================================================================

const Colors = {
  surface: {
    default: '#feffff',
    errorLightest: '#fff2f2',
    primaryLightest: '#f2fcff',
    secondaryLightest: '#f2f2f2',
    secondaryLightestAlt: '#f8f8f9',
  },
  stroke: {
    defaultLight: '#e2e2e3',
  },
  text: {
    default: '#191919',
    secondary: '#666666',
    defaultOnSurface: '#feffff',
  },
  icon: {
    default: '#191919',
    defaultInverse: '#feffff',
    error: '#e02020',
    primary: '#0078b3',
  },
};

const Spacing = { none: 0, xxsmall: 4, xsmall: 6, small: 8, base: 12, medium: 16, large: 24 };
const Radius = { none: 0, base: 4, medium: 8, rounded: 80 };
const Icons = { small: 12, base: 16, medium: 20, large: 24, xlarge: 28 };

// ============================================================================
// MINIMAL PRIMITIVES (production: src/components/Common/Foundation/*)
// ============================================================================

function Button({ label, iconLeading, onPress, disabled, testID }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && { opacity: 0.7 },
        disabled && { opacity: 0.5 },
      ]}
    >
      {iconLeading && iconLeading.show && iconLeading.name && (
        <FontAwesome6 name={iconLeading.name} size={14} color={Colors.text.default} />
      )}
      {label && <Text style={styles.buttonLabel}>{label}</Text>}
    </Pressable>
  );
}

function Checkbox({ state, onStateChange, testID }) {
  const isChecked = state === 'selected';
  return (
    <Pressable
      onPress={() => onStateChange && onStateChange(isChecked ? 'unselected' : 'selected')}
      testID={testID}
      style={[
        styles.checkbox,
        {
          borderColor: isChecked ? Colors.icon.primary : Colors.stroke.defaultLight,
          backgroundColor: isChecked ? Colors.icon.primary : 'transparent',
        },
      ]}
    >
      {isChecked && <FontAwesome6 name="check" size={9} color={Colors.icon.defaultInverse} />}
    </Pressable>
  );
}

/**
 * Simplified ListItem with the planned `trailingContent.statusIcon` extension applied.
 * In production this extension hasn't shipped yet — it's flagged in the Upload README.
 */
function ListItem({ label, paragraph, leadingContent, trailingContent, divider, testID }) {
  return (
    <View>
      <View style={styles.listRow}>
        {leadingContent && leadingContent.iconName && (
          <FontAwesome6
            name={leadingContent.iconName}
            size={Icons.base}
            color={leadingContent.iconColor || Colors.icon.default}
            style={{ marginRight: Spacing.base }}
          />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.listLabel} numberOfLines={1}>{label}</Text>
          {paragraph && <Text style={styles.listParagraph} numberOfLines={1}>{paragraph}</Text>}
        </View>
        {trailingContent && (
          <View style={styles.listTrailing}>
            {trailingContent.statusIcon && trailingContent.statusIcon.type === 'loading' && (
              <ActivityIndicator size="small" color={Colors.icon.primary} />
            )}
            {trailingContent.statusIcon && trailingContent.statusIcon.type === 'error' && (
              <FontAwesome6 name="circle-exclamation" size={Icons.base} color={Colors.icon.error} />
            )}
            {trailingContent.type === 'iconButtons' &&
              trailingContent.buttons &&
              trailingContent.buttons.map((btn, i) => (
                <Pressable key={i} onPress={btn.onPress} testID={btn.testID} hitSlop={8}>
                  <FontAwesome6 name={btn.iconName} size={Icons.base} color={Colors.icon.default} />
                </Pressable>
              ))}
          </View>
        )}
      </View>
      {divider && divider.type === 'full' && <View style={styles.listDivider} />}
    </View>
  );
}

// ============================================================================
// GridCard (adapted from production)
// ============================================================================

function OfflineStatusIcon({ variant, available }) {
  const isDark = variant === 'dark';
  return (
    <View
      style={[
        styles.offlinePill,
        {
          backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : Colors.surface.default,
          borderColor: isDark ? 'transparent' : Colors.stroke.defaultLight,
        },
      ]}
    >
      <FontAwesome6
        name="cloud-arrow-down"
        size={10}
        color={isDark ? Colors.icon.defaultInverse : Colors.icon.default}
      />
    </View>
  );
}

function GridCard({
  type = 'default',
  size = 'base',
  isLoading,
  isSkeleton,
  selectionMode,
  isSelected,
  onSelectionChange,
  name,
  body,
  offlineStatus,
  onDismiss,
  onMore,
  onPress,
  onLongPress,
  disabled,
  testID,
}) {
  const dims = size === 'large' ? { width: 177, height: 150 } : { width: 115, height: 115 };

  const isPhoto = type === 'photo';
  const isError = type === 'error';

  const bgColor = isError
    ? Colors.surface.errorLightest
    : isSelected && selectionMode
    ? Colors.surface.primaryLightest
    : Colors.surface.default;

  const cloudVariant = isPhoto ? 'dark' : 'light';

  const renderHeader = () => {
    if (isLoading) return <View style={{ height: 18, width: '100%' }} />;
    return (
      <View style={styles.gcHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {offlineStatus && (
            <OfflineStatusIcon variant={cloudVariant} available={offlineStatus === 'available'} />
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.small }}>
          {isSkeleton ? (
            <>
              {onDismiss && <View style={styles.gcActionPillSkeleton} />}
              {onMore && <View style={styles.gcActionPillSkeleton} />}
            </>
          ) : selectionMode ? (
            <Checkbox
              state={isSelected ? 'selected' : 'unselected'}
              onStateChange={() => onSelectionChange && onSelectionChange(!isSelected, 'press')}
            />
          ) : (
            <>
              {onDismiss && (
                <Pressable onPress={onDismiss} style={styles.gcActionPill} hitSlop={6}>
                  <FontAwesome6 name="xmark" size={8} color={Colors.icon.default} />
                </Pressable>
              )}
              {onMore && (
                <Pressable onPress={onMore} style={styles.gcActionPill} hitSlop={6}>
                  <FontAwesome6 name="ellipsis-vertical" size={12} color={Colors.icon.default} />
                </Pressable>
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
        <View style={styles.gcBody}>
          <ActivityIndicator size="large" color={Colors.icon.primary} />
        </View>
      );
    }
    if (isSkeleton) {
      return (
        <View style={styles.gcBody}>
          <View style={styles.gcSkeletonBodyRect} />
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.gcBody}>
          <FontAwesome6 name="circle-exclamation" size={Icons.xlarge} color={Colors.icon.error} />
        </View>
      );
    }
    if (isPhoto) return <View style={styles.gcBody} />;
    if (body && body.kind === 'icon' && body.iconName) {
      return (
        <View style={styles.gcBody}>
          <FontAwesome6 name={body.iconName} size={Icons.xlarge} color={Colors.icon.default} />
        </View>
      );
    }
    return <View style={styles.gcBody} />;
  };

  const renderFooter = () => {
    if (isLoading) return <View style={{ height: 20, width: '100%' }} />;
    if (isSkeleton) {
      return (
        <View style={styles.gcFooter}>
          <View style={styles.gcSkeletonFooterRect} />
        </View>
      );
    }
    if (!name) return null;
    const captionStyle = isPhoto ? styles.gcCaptionOverlay : styles.gcCaption;
    return (
      <View style={isPhoto ? styles.gcFooterOverlay : styles.gcFooter}>
        <Text style={captionStyle} numberOfLines={1} ellipsizeMode="middle">{name}</Text>
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => [
        styles.gcContainer,
        { backgroundColor: bgColor, width: dims.width, height: dims.height, opacity: disabled ? 0.5 : 1 },
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      {isPhoto && body && body.kind === 'image' && (
        <>
          <Image source={{ uri: body.uri }} style={styles.gcPhotoFill} resizeMode="cover" />
          <View style={styles.gcPhotoTopScrim} />
          <View style={styles.gcPhotoBottomScrim} />
        </>
      )}
      {renderHeader()}
      {renderBody()}
      {renderFooter()}
    </Pressable>
  );
}

// ============================================================================
// Upload (adapted from production)
// ============================================================================

const CTA_BY_ACCEPT = {
  any: { iconName: 'upload', label: 'Upload' },
  image: { iconName: 'image', label: 'Upload Image' },
  video: { iconName: 'video', label: 'Upload Video' },
  file: { iconName: 'file-lines', label: 'Upload File' },
};

const FILE_TYPE_ICON = {
  image: 'image',
  video: 'video',
  file: 'file-lines',
};

function Upload({ variant, files, multiple = true, accept = 'any', description, onUploadPress, onRemoveFile, disabled, testID }) {
  const isEmpty = files.length === 0;
  const isSingle = !multiple && files.length === 1;
  const showCTA = !isSingle;
  const ctaProps = CTA_BY_ACCEPT[accept];

  const renderCTA = () => (
    <View style={styles.upCtaCard}>
      <Button
        label={ctaProps.label}
        iconLeading={{ show: true, name: ctaProps.iconName }}
        onPress={onUploadPress}
        disabled={disabled}
      />
      {description && <Text style={styles.upDescription}>{description}</Text>}
    </View>
  );

  const renderListRow = (file) => {
    const iconName = FILE_TYPE_ICON[file.type || 'file'];
    let statusIcon;
    if (file.status === 'loading') statusIcon = { type: 'loading' };
    else if (file.status === 'error') statusIcon = { type: 'error' };

    return (
      <ListItem
        key={file.id}
        label={file.name}
        paragraph={file.description}
        leadingContent={{ type: 'icon', iconName, iconColor: Colors.icon.default }}
        trailingContent={{
          type: 'iconButtons',
          buttons: [{ iconName: 'xmark', onPress: () => onRemoveFile(file.id) }],
          statusIcon,
        }}
        divider={{ type: 'full' }}
      />
    );
  };

  const renderGridTile = (file) => {
    const onDismiss = disabled ? undefined : () => onRemoveFile(file.id);
    if (file.status === 'loading') {
      return (
        <GridCard
          key={file.id}
          isLoading
          name={file.name}
          onDismiss={onDismiss}
          offlineStatus={file.offlineStatus}
        />
      );
    }
    if (file.status === 'error') {
      return (
        <GridCard
          key={file.id}
          type="error"
          name={file.name}
          onDismiss={onDismiss}
          offlineStatus={file.offlineStatus}
        />
      );
    }
    if (file.previewUri) {
      return (
        <GridCard
          key={file.id}
          type="photo"
          name={file.name}
          body={{ kind: 'image', uri: file.previewUri }}
          onDismiss={onDismiss}
          offlineStatus={file.offlineStatus}
        />
      );
    }
    return (
      <GridCard
        key={file.id}
        type="default"
        name={file.name}
        body={{ kind: 'icon', iconName: FILE_TYPE_ICON[file.type || 'file'] }}
        onDismiss={onDismiss}
        offlineStatus={file.offlineStatus}
      />
    );
  };

  return (
    <View style={[styles.upContainer, !isEmpty && styles.upContainerPopulated]}>
      {showCTA && renderCTA()}
      {!isEmpty && (
        <View style={variant === 'grid' ? styles.upGridArea : styles.upListArea}>
          {variant === 'list' ? files.map(renderListRow) : files.map(renderGridTile)}
        </View>
      )}
    </View>
  );
}

// ============================================================================
// DEMO APP
// ============================================================================

const PHOTO_A = 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400';
const PHOTO_B = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400';

export default function App() {
  const [listFiles, setListFiles] = useState([
    { id: 'l1', name: 'Daily safety report.pdf', type: 'file', description: '2.4 MB' },
    { id: 'l2', name: 'site-inspection.jpg', type: 'image', status: 'loading' },
    { id: 'l3', name: 'training-video.mp4', type: 'video', status: 'error', description: 'Upload failed' },
  ]);
  const [gridFiles, setGridFiles] = useState([
    { id: 'g1', name: 'WHMIS-symbols.jpg', type: 'image', previewUri: PHOTO_A, offlineStatus: 'available' },
    { id: 'g2', name: 'uploading.jpg', type: 'image', status: 'loading' },
    { id: 'g3', name: 'failed.pdf', type: 'file', status: 'error' },
    { id: 'g4', name: 'site-photo.jpg', type: 'image', previewUri: PHOTO_B },
  ]);
  const [singleFile, setSingleFile] = useState([
    { id: 's1', name: 'signature.jpg', type: 'image', previewUri: PHOTO_A },
  ]);

  const removeFromList = (id) => setListFiles((fs) => fs.filter((f) => f.id !== id));
  const removeFromGrid = (id) => setGridFiles((fs) => fs.filter((f) => f.id !== id));

  const Section = ({ title, children }) => (
    <View style={{ gap: Spacing.base }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <Text style={styles.pageTitle}>GridCard + Upload — live preview</Text>
      <Text style={styles.pageSubtitle}>Standalone demo of both mobile components. Production code lives in mikaelayeo/bis-design-work.</Text>

      <Section title="GridCard · all types (Base 115×115)">
        <View style={styles.cardRow}>
          <GridCard type="default" name="folder.pdf" body={{ kind: 'icon', iconName: 'folder' }} onDismiss={() => {}} onMore={() => {}} offlineStatus="available" />
          <GridCard type="photo" name="site.jpg" body={{ kind: 'image', uri: PHOTO_A }} onDismiss={() => {}} onMore={() => {}} offlineStatus="available" />
          <GridCard type="error" name="failed.pdf" onDismiss={() => {}} onMore={() => {}} />
        </View>
        <View style={styles.cardRow}>
          <GridCard isLoading name="uploading" onDismiss={() => {}} />
          <GridCard isSkeleton onDismiss={() => {}} onMore={() => {}} />
          <GridCard selectionMode name="task.pdf" body={{ kind: 'icon', iconName: 'folder' }} onSelectionChange={() => {}} onDismiss={() => {}} />
        </View>
        <View style={styles.cardRow}>
          <GridCard selectionMode isSelected name="task.pdf" body={{ kind: 'icon', iconName: 'folder' }} onSelectionChange={() => {}} onDismiss={() => {}} />
        </View>
      </Section>

      <Section title="GridCard · Large size (177×150)">
        <View style={styles.cardRow}>
          <GridCard size="large" type="default" name="big-folder.pdf" body={{ kind: 'icon', iconName: 'folder' }} onDismiss={() => {}} onMore={() => {}} offlineStatus="available" />
          <GridCard size="large" type="photo" name="big-photo.jpg" body={{ kind: 'image', uri: PHOTO_B }} onDismiss={() => {}} onMore={() => {}} />
        </View>
      </Section>

      <Section title="Upload · list mode (populated, with loading + error)">
        <Upload
          variant="list"
          files={listFiles}
          description="Tap or drop. PDF, images, or video."
          onUploadPress={() => {}}
          onRemoveFile={removeFromList}
        />
      </Section>

      <Section title="Upload · grid mode (image + uploading + errored)">
        <Upload
          variant="grid"
          files={gridFiles}
          accept="image"
          description="Tap or drop. Images only."
          onUploadPress={() => {}}
          onRemoveFile={removeFromGrid}
        />
      </Section>

      <Section title="Upload · empty state">
        <Upload
          variant="list"
          files={[]}
          description="No files yet — tap to upload."
          onUploadPress={() => {}}
          onRemoveFile={() => {}}
        />
      </Section>

      <Section title="Upload · single-file mode (no CTA when populated)">
        <Upload
          variant="grid"
          multiple={false}
          files={singleFile}
          accept="image"
          onUploadPress={() => {}}
          onRemoveFile={() => setSingleFile([])}
        />
      </Section>
    </ScrollView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f3f4f6' },
  screenContent: { padding: Spacing.medium, gap: Spacing.large, paddingBottom: 80 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.text.default },
  pageSubtitle: { fontSize: 13, color: Colors.text.secondary, marginBottom: Spacing.base },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: Colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.small },

  // Button
  button: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surface.secondaryLightest,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.base,
  },
  buttonLabel: { fontSize: 14, fontWeight: '600', color: Colors.text.default },

  // Checkbox
  checkbox: {
    width: 14, height: 14, borderRadius: 3, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },

  // ListItem
  listRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.small },
  listLabel: { fontSize: 16, lineHeight: 24, color: Colors.text.default },
  listParagraph: { fontSize: 14, lineHeight: 20, color: Colors.text.secondary },
  listTrailing: { flexDirection: 'row', alignItems: 'center', gap: Spacing.medium },
  listDivider: { height: 1, backgroundColor: Colors.stroke.defaultLight },

  // GridCard
  gcContainer: {
    borderRadius: Radius.medium, padding: Spacing.xsmall, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  },
  gcHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  gcBody: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', overflow: 'hidden' },
  gcFooter: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', width: '100%', overflow: 'hidden' },
  gcFooterOverlay: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', width: '100%', overflow: 'hidden' },
  gcCaption: { fontSize: 14, lineHeight: 20, color: Colors.text.secondary, textAlign: 'center' },
  gcCaptionOverlay: { fontSize: 14, lineHeight: 18, fontWeight: '600', color: Colors.text.defaultOnSurface, textAlign: 'center' },
  gcActionPill: {
    width: 18, height: 18, borderRadius: Radius.rounded, backgroundColor: Colors.surface.secondaryLightest,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  gcActionPillSkeleton: { width: 18, height: 18, borderRadius: Radius.rounded, backgroundColor: Colors.surface.secondaryLightest },
  gcSkeletonBodyRect: { width: 35, height: 35, borderRadius: Radius.base, backgroundColor: Colors.surface.secondaryLightest },
  gcSkeletonFooterRect: { flex: 1, height: 14, borderRadius: Radius.base, backgroundColor: Colors.surface.secondaryLightest },
  gcPhotoFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: Radius.medium },
  gcPhotoTopScrim: { position: 'absolute', top: 0, left: 0, right: 0, height: 36, backgroundColor: 'rgba(25,25,25,0.3)', borderTopLeftRadius: Radius.medium, borderTopRightRadius: Radius.medium },
  gcPhotoBottomScrim: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, backgroundColor: 'rgba(25,25,25,0.4)', borderBottomLeftRadius: Radius.medium, borderBottomRightRadius: Radius.medium },

  // Offline pill
  offlinePill: { width: 18, height: 18, borderRadius: Radius.rounded, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },

  // Upload
  upContainer: { width: '100%' },
  upContainerPopulated: {
    backgroundColor: Colors.surface.default, borderColor: Colors.stroke.defaultLight,
    borderWidth: 1, borderRadius: Radius.base, overflow: 'hidden',
  },
  upCtaCard: {
    width: '100%', backgroundColor: Colors.surface.secondaryLightestAlt, borderRadius: Radius.base,
    paddingVertical: Spacing.medium, paddingHorizontal: Spacing.medium,
    alignItems: 'center', justifyContent: 'center', gap: Spacing.xsmall,
  },
  upDescription: { fontSize: 14, lineHeight: 20, color: Colors.text.secondary, textAlign: 'center' },
  upListArea: { paddingVertical: Spacing.xsmall },
  upGridArea: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.small, padding: Spacing.small },
});
