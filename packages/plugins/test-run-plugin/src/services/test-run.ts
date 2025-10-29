/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { injectable, inject } from 'inversify';
import type { FlowNodeEntity, FlowNodeType } from '@flowgram.ai/document';

import { TestRunFormService } from './test-run-form';
import { NodeTestConfig, TestRunPluginConfig, NodeMap } from '../types';
import { FormSchema } from '../form-engine';

@injectable()
export class TestRunService {
  @inject(TestRunFormService) private readonly form: TestRunFormService;

  private initialized = false;

  private nodes: NodeMap = {};

  init(config: TestRunPluginConfig) {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    const { nodes = {}, components = {} } = config;
    this.nodes = nodes;
    this.form.init(components);
  }

  nodeRegister(nodeType: string, nodeTestConfig: NodeTestConfig) {
    this.nodes[nodeType] = nodeTestConfig;
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

  isEnabled(nodeType: FlowNodeType) {
    const config = this.nodes[nodeType];
    return config && config?.enabled !== false;
  }

  formRender(schema: FormSchema) {
    return this.form.render(schema);
  }
}
