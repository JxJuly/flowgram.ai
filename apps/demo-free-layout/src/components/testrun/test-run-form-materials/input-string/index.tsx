/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Input } from '@douyinfe/semi-ui';

import { withStatus } from '../with-status';
import { withSize } from '../with-size';

export const InputString = withSize(withStatus(Input));
