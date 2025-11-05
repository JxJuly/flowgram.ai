/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { definePluginCreator } from '@flowgram.ai/core';

import {
  TestRunService,
  TestRunFormEntity,
  TestRunFormFactory,
  TestRunFormEntityOptions,
  TestRunPipelineEntity,
  TestRunPipelineFactory,
  TestRunConfig,
  defineConfig,
} from './services';

export const createTestRunPlugin = definePluginCreator<Partial<TestRunConfig>>({
  onBind: ({ bind }, opt) => {
    /** service */
    bind(TestRunService).toSelf().inSingletonScope();
    /** config */
    bind(TestRunConfig).toConstantValue(defineConfig(opt));
    /** form entity */
    bind(TestRunFormEntity).toSelf().inTransientScope();
    bind<TestRunFormFactory>(TestRunFormFactory).toFactory<
      TestRunFormEntity,
      [TestRunFormEntityOptions]
    >((context) => (options) => {
      const e = context.container.resolve(TestRunFormEntity);
      e.init(options);
      return e;
    });
    /** pipeline entity */
    bind(TestRunPipelineEntity).toSelf().inTransientScope();
    bind<TestRunPipelineFactory>(TestRunPipelineFactory).toFactory<TestRunPipelineEntity>(
      (context) => () => {
        const e = context.container.resolve(TestRunPipelineEntity);
        e.container = context.container.createChild();
        return e;
      }
    );
  },
});
