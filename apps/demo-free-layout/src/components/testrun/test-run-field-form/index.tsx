/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useCreateForm, FormEngineProps } from '@flowgram.ai/test-run-plugin';
import type { FlowNodeEntity } from '@flowgram.ai/free-layout-editor';
import { IconSpin } from '@douyinfe/semi-icons';

interface TestRunFieldFormProps {
  node: FlowNodeEntity;
  defaultValues?: any;
  onMounted?: FormEngineProps['onMounted'];
  onFormValuesChange?: (v: any) => void;
}

export const TestRunFieldForm: React.FC<TestRunFieldFormProps> = ({
  node,
  defaultValues,
  onMounted,
  onFormValuesChange,
}) => {
  const { renderer } = useCreateForm({
    node,
    defaultValues,
    loadingRenderer: (
      <div>
        <IconSpin spin size="large" />
      </div>
    ),
    emptyRenderer: <div>No Need Input</div>,
    onMounted,
    onFormValuesChange: ({ values }) => onFormValuesChange?.(values),
  });

  return renderer;
};
