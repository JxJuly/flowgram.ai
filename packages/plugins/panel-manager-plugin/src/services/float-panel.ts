/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Emitter } from '@flowgram.ai/utils';

import type { PanelFactory, PanelConfig } from '../types';

export interface PanelElement {
  key: string;
  el: React.ReactNode;
}

export class FloatPanel {
  elements: PanelElement[] = [];

  private onUpdateEmitter = new Emitter<void>();

  onUpdate = this.onUpdateEmitter.event;

  constructor(private config: PanelConfig) {}

  open(factory: PanelFactory<any>, options: any) {
    const el = factory.render(options?.props);
    const idx = this.elements.findIndex((e) => e.key === factory.key);
    if (idx >= 0) {
      this.elements[idx] = { el, key: factory.key };
    } else {
      this.elements.push({ el, key: factory.key });
      if (this.elements.length > this.config.max) {
        this.elements.shift();
      }
    }
    this.onUpdateEmitter.fire();
  }

  close(key?: string) {
    if (!key) {
      this.elements = [];
    } else {
      this.elements = this.elements.filter((e) => e.key !== key);
    }
    this.onUpdateEmitter.fire();
  }

  dispose() {
    this.elements = [];
    this.onUpdateEmitter.dispose();
  }
}
