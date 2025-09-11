/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

export const panelLayer: React.CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: 0,

  display: 'flex',
  width: '100%',
  height: '100%',
  padding: '4px',
  boxSizing: 'border-box',
};

export const leftArea: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  flexGrow: 0,
  flexShrink: 1,
};

export const rightArea: React.CSSProperties = {
  height: '100%',
  flexGrow: 1,
  flexShrink: 0,
  minWidth: 0,

  display: 'flex',
  columnGap: '4px',
};

export const mainArea: React.CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
  flex: '0 1 0',
  width: '100%',
  height: '100%',
};

export const bottomArea: React.CSSProperties = {
  flex: '1 0 0',
  width: '100%',
};

export const floatPanelWrap: React.CSSProperties = {
  pointerEvents: 'auto',
  height: '100%',
  width: '100%',
};
