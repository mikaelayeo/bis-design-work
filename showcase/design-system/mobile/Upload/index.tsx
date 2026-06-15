import React from 'react';
import { View, Text } from 'react-native';

import { Colors } from '../../../../../theme/Colors';

import Button from '../../Buttons/Button';
import ListItem from '../../ContentDisplay/ListItem';
import GridCard from '../../ContentDisplay/GridCard';

import styles from './style';

export type UploadAcceptType = 'any' | 'image' | 'video' | 'file';
export type UploadFileStatus = 'idle' | 'loading' | 'error';
export type UploadFileType = 'image' | 'video' | 'file';

export interface UploadFile {
  /**
   * Stable unique identifier — used as React key and passed to `onRemoveFile`.
   */
  id: string;

  /**
   * File name shown as the row/tile label.
   */
  name: string;

  /**
   * Optional secondary text — appears as the paragraph on list rows.
   */
  description?: string;

  /**
   * Upload status. Drives the trailing indicator on list rows and the GridCard state on tiles.
   * @default 'idle'
   */
  status?: UploadFileStatus;

  /**
   * Local or remote URI for image/video preview. When set, grid mode renders the tile as `type='photo'`.
   */
  previewUri?: string;

  /**
   * File kind. Drives the file icon on list rows and on grid tiles when no `previewUri` is available.
   * @default 'file'
   */
  type?: UploadFileType;

  /**
   * Offline availability indicator forwarded to GridCard (grid mode only).
   */
  offlineStatus?: 'available' | 'unavailable';
}

export interface UploadProps {
  /**
   * Display mode. `list` renders file rows via ListItem; `grid` renders tiles via GridCard.
   */
  variant: 'list' | 'grid';

  /**
   * The current file set. Empty array shows the empty CTA state; populated array shows files.
   */
  files: UploadFile[];

  /**
   * Allow multiple files. When `false`, the component switches to single-file mode:
   * the CTA card is hidden once a file is present.
   * @default true
   */
  multiple?: boolean;

  /**
   * Constrains the upload button's icon and label.
   * - `any` → "Upload"
   * - `image` → "Upload Image"
   * - `video` → "Upload Video"
   * - `file` → "Upload File"
   * @default 'any'
   */
  accept?: UploadAcceptType;

  /**
   * Optional helper text shown under the CTA button (e.g. "Tap or drop. PDF or images.").
   */
  description?: string;

  /**
   * Called when the user taps the upload CTA. Parent should open a picker or action sheet
   * (camera / choose files), then push the resulting file(s) into `files`.
   */
  onUploadPress: () => void;

  /**
   * Called when the user dismisses a file row/tile.
   */
  onRemoveFile: (id: string) => void;

  /**
   * Disables the CTA and all dismiss actions.
   * @default false
   */
  disabled?: boolean;

  /**
   * Test identifier. Sub-elements derive `${testID}-cta`, `${testID}-row-<id>`, `${testID}-tile-<id>`.
   */
  testID?: string;
}

// Maps `accept` → CTA Button props
const CTA_BY_ACCEPT: Record<
  UploadAcceptType,
  { iconName: string; label: string }
> = {
  any: { iconName: 'upload', label: 'Upload' },
  image: { iconName: 'image', label: 'Upload Image' },
  video: { iconName: 'video', label: 'Upload Video' },
  file: { iconName: 'file-lines', label: 'Upload File' },
};

// Maps file type → FontAwesome icon name (for list rows + non-photo grid tiles)
const FILE_TYPE_ICON: Record<UploadFileType, string> = {
  image: 'image',
  video: 'video',
  file: 'file-lines',
};

/**
 * Upload Component — File uploader with list or grid display
 *
 * Composes `Button`, `ListItem`, and `GridCard` into a complete file-upload affordance.
 * Empty/uploaded/single states are derived from `files.length` and `multiple` — no explicit state prop.
 *
 * ## 📐 States
 *
 * | Condition                                | Render                                  |
 * |------------------------------------------|------------------------------------------|
 * | `files.length === 0`                     | CTA card only (empty state)              |
 * | `multiple` && `files.length > 0`         | CTA card on top + file rows/tiles below  |
 * | `!multiple` && `files.length === 1`      | Just the row/tile, no CTA (single mode)  |
 *
 * ## 🎨 Variant Mapping
 *
 * **List mode** — each file → `<ListItem>` with:
 * - `leadingContent`: file type icon (image / video / file-lines)
 * - `label`: file name
 * - `paragraph`: optional description
 * - `trailingContent`: close X + status indicator (loading spinner / error icon)
 *
 * **Grid mode** — each file → `<GridCard>` mapped by status + previewUri:
 *
 * | File state                  | GridCard props                                    |
 * |-----------------------------|---------------------------------------------------|
 * | `status === 'loading'`      | `isLoading`                                       |
 * | `status === 'error'`        | `type='error'`                                    |
 * | has `previewUri`            | `type='photo'`, `body={kind:'image',uri}`         |
 * | otherwise                   | `type='default'`, `body={kind:'icon',iconName}`   |
 *
 * All grid tiles get `onDismiss` wired to `onRemoveFile`.
 *
 * ## 🎯 Accept types
 *
 * The `accept` prop sets the CTA button:
 *
 * | Accept    | Icon         | Label           |
 * |-----------|--------------|------------------|
 * | `any`     | upload       | Upload           |
 * | `image`   | image        | Upload Image     |
 * | `video`   | video        | Upload Video     |
 * | `file`    | file-lines   | Upload File      |
 *
 * The component does NOT enforce the file type — the parent's picker is responsible for filtering.
 *
 * @example Multi-file list upload
 * ```tsx
 * <Upload
 *   variant="list"
 *   files={attachments}
 *   accept="any"
 *   description="Tap or drop. PDF, images, or video."
 *   onUploadPress={openActionSheet}
 *   onRemoveFile={removeAttachment}
 * />
 * ```
 *
 * @example Single-file image upload
 * ```tsx
 * <Upload
 *   variant="grid"
 *   files={signaturePhoto ? [signaturePhoto] : []}
 *   multiple={false}
 *   accept="image"
 *   onUploadPress={openCamera}
 *   onRemoveFile={() => setSignaturePhoto(null)}
 * />
 * ```
 *
 * @example Photo grid with mid-upload + errored files
 * ```tsx
 * <Upload
 *   variant="grid"
 *   files={[
 *     { id: '1', name: 'site.jpg', previewUri: photoUri, type: 'image' },
 *     { id: '2', name: 'uploading.jpg', status: 'loading', type: 'image' },
 *     { id: '3', name: 'failed.pdf', status: 'error', type: 'file' },
 *   ]}
 *   accept="image"
 *   onUploadPress={pickImages}
 *   onRemoveFile={cancelOrRemove}
 * />
 * ```
 *
 * ## 💡 Best Practices
 *
 * - Parent owns the picker/action-sheet UX — `onUploadPress` just signals "open the picker"
 * - Parent owns upload lifecycle — push `status='loading'` while uploading, then `'idle'` on success
 * - For errored uploads, keep them in `files` with `status='error'` so the user can dismiss them
 * - Always provide `testID` for automated testing
 */
const Upload: React.FC<UploadProps> = ({
  variant,
  files,
  multiple = true,
  accept = 'any',
  description,
  onUploadPress,
  onRemoveFile,
  disabled = false,
  testID,
}) => {
  const screenStyles = styles();

  const isEmpty = files.length === 0;
  const isSingle = !multiple && files.length === 1;
  // CTA hidden only when there's exactly one file in single-file mode
  const showCTA = !isSingle;

  const ctaProps = CTA_BY_ACCEPT[accept];

  const renderCTA = () => (
    <View style={screenStyles.ctaCard} testID={testID ? `${testID}-cta` : undefined}>
      <Button
        variant="secondary"
        size="small"
        label={ctaProps.label}
        iconLeading={{ show: true, name: ctaProps.iconName }}
        onPress={onUploadPress}
        disabled={disabled}
        testID={testID ? `${testID}-cta-button` : undefined}
      />
      {description && (
        <Text style={screenStyles.descriptionText}>{description}</Text>
      )}
    </View>
  );

  const renderListRow = (file: UploadFile) => {
    const iconName = FILE_TYPE_ICON[file.type ?? 'file'];

    /**
     * NOTE for dev review: this uses a planned extension to ListItem's `trailingContent`.
     * We need a `statusIcon` field that renders BEFORE the trailing element
     * (e.g., loading spinner or error icon shown alongside the close X).
     * See README for the proposed shape.
     */
    const statusIcon =
      file.status === 'loading'
        ? ({ type: 'loading' } as const)
        : file.status === 'error'
        ? ({ type: 'error' } as const)
        : undefined;

    return (
      <ListItem
        key={file.id}
        label={file.name}
        paragraph={file.description}
        leadingContent={{
          type: 'icon',
          iconName,
          size: 'base',
          iconColor: Colors.icon.default,
        }}
        trailingContent={{
          type: 'iconButtons',
          buttons: [
            {
              iconName: 'xmark',
              onPress: () => onRemoveFile(file.id),
              testID: testID ? `${testID}-row-${file.id}-dismiss` : undefined,
            },
          ],
          // @ts-expect-error — pending ListItem extension; the dev will add `statusIcon` to trailingContent
          statusIcon,
        }}
        showDivider
        divider={{ type: 'full' }}
        disabled={disabled}
        testID={testID ? `${testID}-row-${file.id}` : undefined}
      />
    );
  };

  const renderGridTile = (file: UploadFile) => {
    const tileTestID = testID ? `${testID}-tile-${file.id}` : undefined;
    const onDismiss = disabled ? undefined : () => onRemoveFile(file.id);

    // Loading wins over everything else
    if (file.status === 'loading') {
      return (
        <GridCard
          key={file.id}
          isLoading
          name={file.name}
          onDismiss={onDismiss}
          offlineStatus={file.offlineStatus}
          testID={tileTestID}
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
          testID={tileTestID}
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
          testID={tileTestID}
        />
      );
    }

    return (
      <GridCard
        key={file.id}
        type="default"
        name={file.name}
        body={{
          kind: 'icon',
          iconName: FILE_TYPE_ICON[file.type ?? 'file'],
        }}
        onDismiss={onDismiss}
        offlineStatus={file.offlineStatus}
        testID={tileTestID}
      />
    );
  };

  return (
    <View
      style={[
        screenStyles.container,
        // In empty state, the only thing rendered is the CTA card (no surrounding card)
        isEmpty ? screenStyles.containerEmpty : screenStyles.containerPopulated,
      ]}
      testID={testID}
    >
      {showCTA && renderCTA()}

      {!isEmpty && (
        <View
          style={
            variant === 'grid' ? screenStyles.gridArea : screenStyles.listArea
          }
        >
          {variant === 'list'
            ? files.map(renderListRow)
            : files.map(renderGridTile)}
        </View>
      )}
    </View>
  );
};

export default Upload;
