/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { FlowNodeType, FlowNodeEntity } from '@flowgram.ai/document';

import type { FormSchema, FormComponents } from './form-engine';

type MaybePromise<T> = T | Promise<T>;

type PropertiesFunctionParams = {
  node: FlowNodeEntity;
};

export interface NodeTestConfig {
  enabled?: boolean;
  properties?:
    | Record<string, FormSchema>
    | ((params: PropertiesFunctionParams) => MaybePromise<Record<string, FormSchema>>);
}
export type NodeMap = Record<FlowNodeType, NodeTestConfig>;

export interface TestRunPluginConfig {
  components?: FormComponents;
  nodes?: NodeMap;
}
