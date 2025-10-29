/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { FormComponentProps } from '@flowgram.ai/test-run-plugin';
import { DisplaySchemaTag } from '@flowgram.ai/form-materials';
import { Typography } from '@douyinfe/semi-ui';

import css from './index.module.less';

type FieldItemProps = FormComponentProps & {
  label: string;
  description?: string;
  required: boolean;
  type: string;
  itemsType?: string;
};

export const FieldItem: React.FC<React.PropsWithChildren<FieldItemProps>> = ({
  label,
  required,
  description,
  type,
  itemsType,
  children,
}) => (
  <div className={css['field-item']}>
    <label className={css['field-label']}>
      <Typography.Text size="small" strong>
        {label}
      </Typography.Text>
      {required && (
        <Typography.Text size="small" type="danger">
          *
        </Typography.Text>
      )}
      <DisplaySchemaTag value={{ type, items: itemsType ? { type: itemsType } : undefined }} />
    </label>
    {description && (
      <div className={css['field-description']}>
        <Typography.Text size="small" type="secondary">
          {description}
        </Typography.Text>
      </div>
    )}
    {children}
  </div>
);
