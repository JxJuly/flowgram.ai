/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useMemo, useRef, useState } from 'react';

import cls from 'classnames';
import { JsonCodeEditor } from '@flowgram.ai/form-materials';
import type { ValidateStatus } from '@douyinfe/semi-ui/lib/es/input';

import { withStatus } from '../with-status';

import css from './index.module.less';

export const InputJson = withStatus(
  ({
    value,
    validateStatus,
    onChange,
  }: {
    value: Record<string, unknown>;
    onChange: (value: Record<string, unknown>) => void;
    validateStatus: ValidateStatus;
  }) => {
    const defaultJsonText = useMemo(() => JSON.stringify(value, null, 2), [value]);

    const [jsonText, setJsonText] = useState(defaultJsonText);

    const effectVersion = useRef(0);
    const changeVersion = useRef(0);

    const handleJsonTextChange = (text: string) => {
      setJsonText(text);
      try {
        const jsonValue = JSON.parse(text);
        onChange(jsonValue);
        changeVersion.current++;
      } catch (e) {
        // ignore
      }
    };

    useEffect(() => {
      // more effect compared with change
      effectVersion.current = effectVersion.current + 1;
      if (effectVersion.current === changeVersion.current) {
        return;
      }
      effectVersion.current = changeVersion.current;

      setJsonText(JSON.stringify(value, null, 2));
    }, [value]);

    return (
      <div className={cls(css['input-json'], validateStatus === 'error' && css['error'])}>
        <JsonCodeEditor value={jsonText} onChange={handleJsonTextChange} />
      </div>
    );
  }
);
