/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { PanelFactory, PanelConfig } from '../types';

export interface PanelManagerConfig {
  factories: PanelFactory<any>[];
  right: PanelConfig;
  bottom: PanelConfig;
}

export const PanelManagerConfig = Symbol('PanelManagerConfig');

export const defineConfig = (config: Partial<PanelManagerConfig>) => {
  const defaultConfig: PanelManagerConfig = {
    right: {
      max: 1,
    },
    bottom: {
      max: 1,
    },
    factories: [],
  };
  return {
    ...defaultConfig,
    ...config,
  };
};
