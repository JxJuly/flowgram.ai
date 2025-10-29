/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { ReactiveState } from '@flowgram.ai/reactive';

import { getUniqueFieldName } from '../utils';
import { FormSchema, FormSchemaType, FormSchemaModelState } from '../types';

export class FormSchemaModel implements FormSchema {
  name?: string;

  type?: FormSchemaType;

  properties?: Record<string, FormSchema>;

  ['x-index']?: number;

  ['x-component']?: string;

  ['x-component-props']?: Record<string, unknown>;

  ['x-decorator']?: string;

  ['x-decorator-props']?: Record<string, unknown>;

  [key: string]: any;

  path: string[] = [];

  state = new ReactiveState<FormSchemaModelState>({ disabled: false });

  get componentType() {
    return this['x-component'];
  }

  get componentProps() {
    return this['x-component-props'];
  }

  get decoratorType() {
    return this['x-decorator'];
  }

  get decoratorProps() {
    return this['x-decorator-props'];
  }

  get uniqueName() {
    return getUniqueFieldName(...this.path);
  }

  constructor(json: FormSchema, path: string[] = []) {
    this.fromJSON(json);
    this.path = path;
  }

  private fromJSON(json: FormSchema) {
    Object.entries(json).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  static getFieldPath(...args: (string | undefined)[]) {
    return args.filter((path) => path).join('.');
  }

  static mergeFieldPath(path?: string[], name?: string) {
    return [...(path || []), name].filter((i): i is string => Boolean(i));
  }

  static getProperties(schema: FormSchemaModel | FormSchema) {
    const orderProperties: FormSchemaModel[] = [];
    const unOrderProperties: FormSchemaModel[] = [];
    Object.entries(schema.properties || {}).forEach(([key, item]) => {
      const index = item['x-index'];
      const current = new FormSchemaModel(item, FormSchemaModel.mergeFieldPath(schema.path, key));
      if (index !== undefined && !isNaN(index)) {
        orderProperties[index] = current;
      } else {
        unOrderProperties.push(current);
      }
    });
    return orderProperties.concat(unOrderProperties).filter((item) => !!item);
  }
}
