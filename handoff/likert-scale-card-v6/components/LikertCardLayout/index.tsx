/**
 * LikertCardLayout
 *
 * Phone-portrait card layout for the Likert scale widget. Renders each
 * statement as a vertical card-block; options are presented as tappable
 * cards in a 2- or 3-column grid (no horizontal scroll).
 *
 * Architecture mirrors the existing matrix tooltip pattern: a single shared
 * `<Tooltip>` instance, with `targetRef` swapped to whichever icon is
 * currently active.
 *
 * Intended to live at: src/components/Forms/Widgets/LikertScale/LikertCardLayout/
 * (or as a sibling under Forms/Widgets/, depending on team preference).
 *
 * STATUS: handoff skeleton — wire into LikertScale/index.tsx by adding a
 * `useCardLayout` branch alongside the existing `useInlineGrid` path.
 */

import React, { useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome';
import Tooltip from '../../../Common/Foundation/Messaging/Tooltip';
import { Colors } from '../../../../theme/Colors';
import MultilineInputField from '../../../Common/Foundation/InputFields/MultilineInputField';
import I18n from '../../../../handler/Language';
import { styles } from './style';
import type {
  ILikertStatement,
  ILikertCommentConfig,
  LikertOptionValue,
  LikertCommentValue,
} from '../types';
import type { ILikertOption } from './types';

interface LikertCardLayoutProps {
  statements: ILikertStatement[];
  options: ILikertOption[]; // already filtered to visible (id !== 0)
  optionValue: LikertOptionValue;
  commentValue: LikertCommentValue;
  comments?: Record<string, ILikertCommentConfig>;
  disabled?: boolean;
  /** 2 (default) or 3. Surface as a config later if needed. */
  cols?: 2 | 3;
  onSelect: (optionDbid: number, columnDbid: number) => void;
  onCommentChange?: (text: string, columnDbid: number) => void;
  onCommentBlur?: () => void;
  /** For per-question testID consistency with the matrix. */
  blockId: number;
}

const LikertCardLayout: React.FC<LikertCardLayoutProps> = ({
  statements,
  options,
  optionValue,
  commentValue,
  comments,
  disabled = false,
  cols = 2,
  onSelect,
  onCommentChange,
  onCommentBlur,
  blockId,
}) => {
  // Single shared tooltip, same pattern as the matrix's `openTooltipKey`.
  const [openTipKey, setOpenTipKey] = useState<string | null>(null);
  const [openTipText, setOpenTipText] = useState('');
  const anchorRefs = useRef<Record<string, View | null>>({});
  const activeAnchorRef = useRef<View | null>(null);

  const showTooltip = (key: string, text: string) => {
    if (openTipKey === key) {
      dismissTooltip();
      return;
    }
    activeAnchorRef.current = anchorRefs.current[key] ?? null;
    setOpenTipKey(key);
    setOpenTipText(String(text ?? ''));
  };

  const dismissTooltip = () => {
    activeAnchorRef.current = null;
    setOpenTipKey(null);
    setOpenTipText('');
  };

  return (
    <View>
      {statements.map((statement, idx) => {
        const stmtKey = `stmt-${statement.dbid}`;
        const selectedOptionDbid = optionValue[statement.dbid];
        const selectedKey = selectedOptionDbid
          ? `${statement.dbid}-${selectedOptionDbid}`
          : '';
        const commentConfig = selectedKey ? comments?.[selectedKey] : undefined;
        const showComment = !!commentConfig?.showcommentbox;

        return (
          <View key={statement.id.toString()} style={styles.cardBlock}>
            {/* Statement — "1. {label} ⓘ" */}
            <View style={styles.statementRow}>
              <Text style={styles.statementText}>
                <Text style={styles.statementNum}>{idx + 1}.</Text>{' '}
                {statement.label}
                {statement.tooltipinfo ? ' ' : null}
              </Text>
              {statement.tooltipinfo ? (
                <View
                  ref={el => {
                    anchorRefs.current[stmtKey] = el;
                  }}
                  collapsable={false}
                  style={styles.statementIconWrap}
                >
                  <Icon
                    name="info-circle"
                    size={15}
                    color={Colors.icon.primary}
                    onPress={() =>
                      showTooltip(stmtKey, statement.tooltipinfo as string)
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`More information about ${statement.label ?? ''}`}
                  />
                </View>
              ) : null}
            </View>

            {/* Option grid */}
            <View
              style={[
                styles.optGrid,
                cols === 3 ? styles.optGrid3 : styles.optGrid2,
              ]}
            >
              {options.map(option => {
                const isSelected = selectedOptionDbid === option.dbid;
                const cardKey = `opt-${statement.dbid}-${option.dbid}`;

                return (
                  <Pressable
                    key={option.dbid}
                    onPress={() => onSelect(option.dbid, statement.dbid)}
                    disabled={disabled}
                    style={[
                      styles.optCard,
                      isSelected && styles.optCardSelected,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected, disabled }}
                    accessibilityLabel={option.label}
                    testID={`${blockId}-${statement.dbid}-${option.dbid}`}
                  >
                    <Text
                      style={[
                        styles.optText,
                        isSelected && styles.optTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {option.label}
                    </Text>

                    {/* Right-side 44px info zone — combined select + tooltip */}
                    {option.tooltipinfo ? (
                      <Pressable
                        style={styles.optInfoZone}
                        onPress={() => {
                          // If not yet selected, select this option first
                          // (matches the prototype's combined affordance).
                          if (!isSelected) {
                            onSelect(option.dbid, statement.dbid);
                          }
                          showTooltip(cardKey, option.tooltipinfo as string);
                        }}
                        disabled={disabled}
                        accessibilityRole="button"
                        accessibilityLabel={`More information about ${option.label ?? ''}`}
                        hitSlop={8}
                      >
                        <View
                          ref={el => {
                            anchorRefs.current[cardKey] = el;
                          }}
                          collapsable={false}
                          pointerEvents="none"
                        >
                          <Icon
                            name="info-circle"
                            size={14}
                            color={
                              isSelected
                                ? Colors.icon.defaultAlt
                                : Colors.icon.primary
                            }
                          />
                        </View>
                      </Pressable>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {/* Comment-on-select — same config as the matrix uses today */}
            {showComment ? (
              <View style={styles.descriptionBox}>
                <MultilineInputField
                  modalLabel={I18n.t('SafeTappV2_Forms.lblComment')}
                  testID={`${blockId}-${statement.dbid}-comment`}
                  onChange={text =>
                    onCommentChange?.(text, statement.dbid)
                  }
                  customOnBlur={() => onCommentBlur?.()}
                  defaultValue={String(commentValue?.[statement.dbid] ?? '')}
                  placeholder={commentConfig?.placeholder}
                  isEditable={!disabled}
                />
              </View>
            ) : null}
          </View>
        );
      })}

      {/* Single shared tooltip — same pattern as renderInlineGrid */}
      <Tooltip
        visible={openTipKey !== null}
        targetRef={activeAnchorRef}
        onDismiss={dismissTooltip}
        variant="light"
      >
        <Text style={styles.tooltipText}>{openTipText}</Text>
      </Tooltip>
    </View>
  );
};

export default LikertCardLayout;
