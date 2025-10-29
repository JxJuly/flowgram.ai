/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createElement } from 'react';

import type { FormSchema, FormSchemaValidate, FormComponentProps } from './types';

/** Splice form item unique name */
export const getUniqueFieldName = (...args: (string | undefined)[]) =>
  args.filter((path) => path).join('.');

/** Create validation rules */
export const createValidate = (schema: FormSchema) => {
  const rules: Record<string, FormSchemaValidate> = {};

  visit(schema);

  return rules;

  function visit(current: FormSchema, name?: string) {
    if (name && current['x-validator']) {
      rules[name] = current['x-validator'];
    }
    if (current.type === 'object' && current.properties) {
      Object.entries(current.properties).forEach(([key, value]) => {
        visit(value, getUniqueFieldName(name, key));
      });
    }
  }
};

export const connect = <T = any>(
  Component: React.FunctionComponent<any>,
  mapProps: (p: FormComponentProps) => T
) => {
  const Connected = (props: FormComponentProps) => {
    const mappedProps = mapProps(props);
    return createElement(Component, mappedProps);
  };

  return Connected;
};
