/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { connect } from '@flowgram.ai/test-run-plugin';

export const withSize = (Comp: any) =>
  connect(Comp, (props) => ({
    ...props,
    size: 'small',
    style: { ...props.style, width: '100%' },
  }));
