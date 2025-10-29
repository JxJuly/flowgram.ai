/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { definePluginCreator } from '@flowgram.ai/core';

import { TestRunPluginConfig } from './types';
import { TestRunService, TestRunFormService } from './services';

export const createTestRunPlugin = definePluginCreator<TestRunPluginConfig>({
  onBind: ({ bind }) => {
    bind(TestRunService).toSelf().inSingletonScope();
    bind(TestRunFormService).toSelf().inSingletonScope();
  },
  onInit(ctx, opts) {
    const testRun = ctx.container.get<TestRunService>(TestRunService);
    testRun.init(opts);
  },
});
