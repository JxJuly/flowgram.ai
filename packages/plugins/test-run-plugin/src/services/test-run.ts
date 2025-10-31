/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { injectable } from 'inversify';
import type { FlowNodeEntity, FlowNodeType } from '@flowgram.ai/document';

import { TestRunFormEntity } from './test-run-form';
import { NodeTestConfig, TestRunPluginConfig, NodeMap } from '../types';
import { FormSchema } from '../form-engine';

@injectable()
export class TestRunService {
  private initialized = false;

  private nodes: NodeMap = {};

  private components = {};

  formEntities = new Map<string, TestRunFormEntity>();

  init(config: TestRunPluginConfig) {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    const { nodes = {}, components = {} } = config;
    this.nodes = nodes;
    this.components = components;
  }

  nodeRegister(nodeType: string, nodeTestConfig: NodeTestConfig) {
    this.nodes[nodeType] = nodeTestConfig;
  }

  isEnabled(nodeType: FlowNodeType) {
    const config = this.nodes[nodeType];
    return config && config?.enabled !== false;
  }

  async toSchema(node: FlowNodeEntity) {
    const nodeType = node.flowNodeType;
    const config = this.nodes[nodeType];
    if (!this.isEnabled(nodeType)) {
      return {};
    }
    const properties =
      typeof config.properties === 'function'
        ? await config.properties({ node })
        : config.properties;

    return {
      type: 'object',
      properties,
    };
  }

  createFormWithSchema(schema: FormSchema) {
    const form = new TestRunFormEntity({
      schema,
      components: this.components,
    });
    this.formEntities.set(form.id, form);
    form.onFormUnmounted(() => {
      form.dispose();
      this.formEntities.delete(form.id);
    });
    return form;
  }

  async createForm(node: FlowNodeEntity) {
    const schema = await this.toSchema(node);
    return this.createFormWithSchema(schema);
  }
}
