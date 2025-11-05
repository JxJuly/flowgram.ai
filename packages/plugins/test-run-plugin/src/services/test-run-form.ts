/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createElement } from 'react';

import { nanoid } from 'nanoid';
import { injectable, inject } from 'inversify';
import { Emitter } from '@flowgram.ai/utils';

import { FormSchema, FormEngine, type FormInstance, type FormEngineProps } from '../form-engine';
import { TestRunConfig } from './config';

export type FormRenderProps = Omit<
  FormEngineProps,
  'schema' | 'components' | 'onMounted' | 'onUnmounted'
>;

export const TestRunFormFactory = Symbol('TestRunFormFactory');
export type TestRunFormFactory = (options: TestRunFormEntityOptions) => TestRunFormEntity;

export interface TestRunFormEntityOptions {
  schema: FormSchema;
}

@injectable()
export class TestRunFormEntity {
  @inject(TestRunConfig) private readonly config: TestRunConfig;

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

  init(options: TestRunFormEntityOptions) {
    this._schema = options.schema;
  }

  render(props?: FormRenderProps) {
    const { children, ...restProps } = props || {};
    return createElement(
      FormEngine,
      {
        schema: this.schema,
        components: this.config.components,
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
