/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useMemo, useState } from 'react';

import type { FlowNodeEntity } from '@flowgram.ai/document';

import { useTestRunService } from './use-test-run-service';

interface UseFormOptions {
  node?: FlowNodeEntity;
}

export const useForm = ({ node }: UseFormOptions) => {
  const testRun = useTestRunService();
  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState({});

  const renderer = useMemo(() => testRun.formRender(schema), [schema]);

  const compute = async () => {
    if (!node) {
      return;
    }
    try {
      setLoading(true);
      const data = await testRun.toSchema(node);
      setSchema(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compute();
  }, [node]);

  return {
    renderer,
    loading,
    schema,
  };
};
