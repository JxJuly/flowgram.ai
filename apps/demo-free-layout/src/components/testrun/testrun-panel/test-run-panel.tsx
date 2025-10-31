/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { FC, useState, useEffect, useMemo, useRef } from 'react';

import classnames from 'classnames';
import type { FormInstance } from '@flowgram.ai/test-run-plugin';
import { WorkflowInputs, WorkflowOutputs } from '@flowgram.ai/runtime-interface';
import { type PanelFactory, usePanelManager } from '@flowgram.ai/panel-manager-plugin';
import { useService, WorkflowDocument } from '@flowgram.ai/free-layout-editor';
import { Button, Switch, Toast } from '@douyinfe/semi-ui';
import { IconClose, IconPlay, IconSpin } from '@douyinfe/semi-icons';

import { TestRunJsonInput } from '../testrun-json-input';
import { TestRunFieldForm } from '../test-run-field-form';
import { NodeStatusGroup } from '../node-status-bar/group';
import { WorkflowRuntimeService } from '../../../plugins/runtime-plugin/runtime-service';
import { WorkflowNodeType } from '../../../nodes';
import { IconCancel } from '../../../assets/icon-cancel';

import styles from './index.module.less';

interface TestRunSidePanelProps {}

export const TestRunSidePanel: FC<TestRunSidePanelProps> = () => {
  const runtimeService = useService(WorkflowRuntimeService);
  const document = useService(WorkflowDocument);

  const startNode = useMemo(
    () => document.root.blocks.find((node) => node.flowNodeType === WorkflowNodeType.Start),
    [document]
  );
  const panelManager = usePanelManager();
  const [isRunning, setRunning] = useState(false);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<string[]>();
  const [result, setResult] = useState<
    | {
        inputs: WorkflowInputs;
        outputs: WorkflowOutputs;
      }
    | undefined
  >();

  const formRef = useRef<FormInstance | null>(null);

  // en - Use localStorage to persist the JSON mode state
  const [inputJSONMode, _setInputJSONMode] = useState(() => {
    const savedMode = localStorage.getItem('testrun-input-json-mode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const setInputJSONMode = (checked: boolean) => {
    _setInputJSONMode(checked);
    localStorage.setItem('testrun-input-json-mode', JSON.stringify(checked));
  };

  const onTestRun = async () => {
    if (isRunning) {
      await runtimeService.taskCancel();
      return;
    }
    if (!inputJSONMode && formRef.current) {
      const error = await formRef.current.form.validate();
      if (error.length) {
        Toast.info('Form has errors');
        return;
      }
    }
    setResult(undefined);
    setErrors(undefined);
    const taskID = await runtimeService.taskRun(values);
    if (taskID) {
      setRunning(true);
    }
  };

  const onClose = async () => {
    await runtimeService.taskCancel();
    setValues({});
    setRunning(false);
    panelManager.close(testRunPanelFactory.key);
  };

  useEffect(() => {
    const disposer = runtimeService.onResultChanged(({ result, errors }) => {
      setRunning(false);
      setResult(result);
      if (errors) {
        setErrors(errors);
      } else {
        setErrors(undefined);
      }
    });
    return () => disposer.dispose();
  }, []);

  useEffect(
    () => () => {
      runtimeService.taskCancel();
    },
    [runtimeService]
  );

  if (!startNode) {
    return null;
  }

  return (
    <div className={styles['testrun-panel-container']}>
      <div className={styles['testrun-panel-header']}>
        <div className={styles['testrun-panel-title']}>Test Run</div>
        <Button
          className={styles['testrun-panel-title']}
          type="tertiary"
          icon={<IconClose />}
          size="small"
          theme="borderless"
          onClick={onClose}
        />
      </div>
      <div className={styles['testrun-panel-content']}>
        {isRunning && (
          <div className={styles['testrun-panel-running']}>
            <IconSpin spin size="large" />
            <div className={styles.text}>Running...</div>
          </div>
        )}
        <div className={styles['testrun-panel-form']}>
          <div className={styles['testrun-panel-input']}>
            <div className={styles.title}>Input Form</div>
            <div>JSON Mode</div>
            <Switch
              checked={inputJSONMode}
              onChange={(checked: boolean) => setInputJSONMode(checked)}
              size="small"
            />
          </div>
          {inputJSONMode ? (
            <TestRunJsonInput values={values} setValues={setValues} />
          ) : (
            <TestRunFieldForm
              node={startNode}
              defaultValues={values}
              onFormValuesChange={setValues}
              onMounted={(form) => {
                formRef.current = form;
                setValues(form.form.values);
              }}
            />
          )}
          {errors?.map((e) => (
            <div className={styles.error} key={e}>
              {e}
            </div>
          ))}
          <NodeStatusGroup title="Inputs Result" data={result?.inputs} optional disableCollapse />
          <NodeStatusGroup title="Outputs Result" data={result?.outputs} optional disableCollapse />
        </div>
      </div>
      <div className={styles['testrun-panel-footer']}>
        <Button
          onClick={onTestRun}
          icon={isRunning ? <IconCancel /> : <IconPlay size="small" />}
          className={classnames(styles.button, {
            [styles.running]: isRunning,
            [styles.default]: !isRunning,
          })}
        >
          {isRunning ? 'Cancel' : 'Test Run'}
        </Button>
      </div>
    </div>
  );
};

export const testRunPanelFactory: PanelFactory<TestRunSidePanelProps> = {
  key: 'test-run-panel',
  defaultSize: 400,
  render: () => <TestRunSidePanel />,
};
