/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Select } from '@douyinfe/semi-ui';

import { withStatus } from '../with-status';
import { withSize } from '../with-size';

interface SelectBooleanProps {
  value?: boolean;
  onChange?: (v?: boolean) => void;
}

export const SelectBoolean = withSize(
  withStatus(({ value, onChange, ...props }: SelectBooleanProps) => {
    const optionList = [
      {
        label: 'True',
        value: 1,
      },
      {
        label: 'False',
        value: 0,
      },
    ];

    return (
      <Select
        value={value === undefined ? value : Number(value)}
        optionList={optionList}
        onChange={(v) => onChange?.(v === undefined ? v : Boolean(v))}
        {...props}
      />
    );
  })
);
