/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createElement } from 'react';

import { nanoid } from 'nanoid';
import { Emitter } from '@flowgram.ai/utils';

import {
  FormSchema,
  FormEngine,
  FormComponents,
  type FormInstance,
  type FormEngineProps,
} from '../form-engine';

export type FormRenderProps = Omit<
  FormEngineProps,
  'schema' | 'components' | 'onMounted' | 'onUnmounted'
>;

interface TestRunFormEntityOptions {
  schema: FormSchema;
  components: FormComponents;
}

export class TestRunFormEntity {
  private components: FormComponents = {};

  private _schema: FormSchema;

  id = nanoid();

  form: FormInstance | null = null;

  onFormMountedEmitter = new Emitter<FormInstance>();

  onFormMounted = this.onFormMountedEmitter.event;

  onFormUnmountedEmitter = new Emitter<void>();

  onFormUnmounted = this.onFormUnmountedEmitter.event;

  get schema() {
    return this._schema;
  }

  constructor(options: TestRunFormEntityOptions) {
    const { schema, components } = options;
    this._schema = schema;
    this.components = components;
  }

  render(props?: FormRenderProps) {
    const { children, ...restProps } = props || {};
    return createElement(
      FormEngine,
      {
        schema: this.schema,
        components: this.components,
        onMounted: (instance) => {
          this.form = instance;
          this.onFormMountedEmitter.fire(instance);
        },
        onUnmounted: this.onFormUnmountedEmitter.fire.bind(this.onFormUnmountedEmitter),
        ...restProps,
      },
      children
    );
  }

  dispose() {
    this.form = null;
    this.onFormMountedEmitter.dispose();
    this.onFormUnmountedEmitter.dispose();
  }
}
