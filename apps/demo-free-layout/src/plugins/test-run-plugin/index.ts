/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { createTestRunPlugin as create, type FormSchema } from '@flowgram.ai/test-run-plugin';
import type { IJsonSchema } from '@flowgram.ai/form-materials';

import { WorkflowNodeType } from '../../nodes';
import {
  FieldItem,
  InputString,
  InputJson,
  SelectBoolean,
} from '../../components/testrun/test-run-form-materials';

const TYPE_TO_COMP: Record<string, string> = {
  string: 'InputString',
  boolean: 'SelectBoolean',
  object: 'InputJson',
  array: 'InputJson',
};

export const createTestRunPlugin = () =>
  create({
    components: {
      InputString,
      InputJson,
      SelectBoolean,
      FieldItem,
    },
    nodes: {
      [WorkflowNodeType.Start]: {
        properties: ({ node }) => {
          const inputs = node.form?.getValueIn<IJsonSchema>('outputs') || {};
          return Object.entries(inputs.properties || {})
            .map(([name, property]) => {
              const required = inputs.required?.includes(name) ?? false;
              const field: FormSchema = {
                name,
                type: property.type,
                defaultValue: property.default,
                required,
                ['x-decorator']: 'FieldItem',
                ['x-decorator-props']: {
                  label: name,
                  description: property.description,
                  itemsType: property.items?.type,
                },
                ['x-component']: TYPE_TO_COMP[property.type || ''] || 'InputString',
                ['x-validator']: ({ value }) => {
                  const isEmptyValue = (v: unknown) => v === undefined || v === null || v === '';
                  if (required && isEmptyValue(value)) {
                    return `${name} is required`;
                  }
                },
              };
              return field;
            })
            .reduce<Record<string, FormSchema>>((prev, cur) => {
              prev[cur.name || ''] = cur;
              return prev;
            }, {});
        },
      },
    },
  });
