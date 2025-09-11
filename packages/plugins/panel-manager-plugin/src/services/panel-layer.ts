/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createElement } from 'react';

import { injectable } from 'inversify';
import { domUtils } from '@flowgram.ai/utils';
import { Layer } from '@flowgram.ai/core';

import { PanelLayer as PanelLayerComp } from '../components/panel-layer';

@injectable()
export class PanelLayer extends Layer {
  node = domUtils.createDivWithClass('gedit-flow-panel-layer');

  layout: JSX.Element | null = null;

  onReady(): void {
    const commonStyle = {
      pointerEvents: 'none',
      zIndex: 11,
    };
    domUtils.setStyle(this.node, commonStyle);
    this.config.onDataChange(() => {
      const { width, height, scrollX, scrollY } = this.config.config;
      domUtils.setStyle(this.node, {
        ...commonStyle,
        width,
        height,
        left: scrollX,
        top: scrollY,
      });
    });
  }

  render(): JSX.Element {
    if (!this.layout) {
      this.layout = createElement(PanelLayerComp);
    }
    return this.layout;
  }
}
