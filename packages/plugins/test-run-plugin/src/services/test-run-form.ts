/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createElement } from 'react';

import { injectable } from 'inversify';

import { FormSchema, FormEngine, FormComponents, FormComponent } from '../form-engine';

@injectable()
export class TestRunFormService {
  private initialized = false;

  private components: FormComponents = {};

  init(comps: FormComponents) {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.components = comps;
  }

  componentRegister(key: string, comp: FormComponent) {
    this.components[key] = comp;
  }

  render(schema: FormSchema) {
    return createElement(FormEngine, {
      schema,
      components: this.components,
    });
  }
}
