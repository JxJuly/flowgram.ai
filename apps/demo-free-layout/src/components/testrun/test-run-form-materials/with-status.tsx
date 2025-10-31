/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { connect } from '@flowgram.ai/test-run-plugin';

export const withStatus = (Comp: any) =>
  connect(Comp, ({ errors, warnings, ...props }) => {
    let validateStatus = 'default';
    if (errors?.length) {
      validateStatus = 'error';
    } else if (warnings?.length) {
      validateStatus = 'warning';
    }
    return {
      ...props,
      validateStatus,
    };
  });
