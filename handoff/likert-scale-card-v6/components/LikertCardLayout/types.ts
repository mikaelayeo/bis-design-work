/**
 * Type extensions for the LikertCardLayout.
 *
 * Re-exports existing Likert types so consumers of LikertCardLayout don't
 * need to import from two places. Extends `ILikertOption` with the optional
 * `tooltipinfo` field that powers the new per-option (i) icon.
 *
 * Recommended integration: move `tooltipinfo` into the canonical
 * `Forms/Widgets/LikertScale/types.ts` so the matrix layout can also opt in
 * to per-option tooltips later. Until then, this extension lives here.
 */

export type {
  ILikertStatement,
  ILikertCommentConfig,
  ILikertBlockData,
  ILikertDefinedEntry,
  IFormDataLikert,
  LikertOptionValue,
  LikertCommentValue,
} from '../../../Forms/Widgets/LikertScale/types';

import type { ILikertOption as BaseLikertOption } from '../../../Forms/Widgets/LikertScale/types';

export interface ILikertOption extends BaseLikertOption {
  /**
   * Optional help text shown in a Tooltip when the option's (i) icon is
   * tapped. The tooltip uses the shared `<Tooltip variant="light">` from
   * Common/Foundation/Messaging/Tooltip.
   *
   * Set per response option in form configuration. If omitted, no (i) icon
   * renders and the card is a plain selection target.
   */
  tooltipinfo?: string;
}
