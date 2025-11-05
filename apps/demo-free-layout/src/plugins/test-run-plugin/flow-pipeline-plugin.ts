/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import {
  TestRunPipelinePlugin,
  TestRunPipelineEntity,
  type FormInstance,
  type TestRunPipelineEntityCtx,
} from '@flowgram.ai/test-run-plugin';
import { injectable, inject, WorkflowDocument } from '@flowgram.ai/free-layout-editor';
import { Toast } from '@douyinfe/semi-ui';

import { GetGlobalVariableSchema } from '../variable-panel-plugin';
import { WorkflowRuntimeClient } from '../runtime-plugin';

interface PrepareData {
  form: FormInstance['form'] | null;
  mode: 'json' | 'form';
  values: Record<string, unknown>;
}

export class FormValidatePipelinePlugin implements TestRunPipelinePlugin {
  name: 'FormValidatePipelinePlugin';

  apply(pipeline: TestRunPipelineEntity) {
    pipeline.prepare.tap('TestRunFormValidate', this.prepare.bind(this));
  }

  async prepare(ctx: TestRunPipelineEntityCtx<PrepareData>) {
    const { store, operate } = ctx;
    const { mode, form } = store.getState().data || {};
    if (mode === 'form' && form) {
      const error = await form.validate();
      if (error.length) {
        Toast.info('TestRun form has error!');
        operate.cancel();
      }
    }
  }
}

@injectable()
export class DocumentValidatePipelinePlugin implements TestRunPipelinePlugin {
  name: 'DocumentValidatePipelinePlugin';

  @inject(WorkflowDocument) document: WorkflowDocument;

  @inject(WorkflowRuntimeClient) runtime: WorkflowRuntimeClient;

  @inject(GetGlobalVariableSchema) getGlobalVariableSchema: GetGlobalVariableSchema;

  apply(pipeline: TestRunPipelineEntity) {
    pipeline.prepare.tap('DocumentValidate', this.prepare.bind(this));
  }

  async prepare(ctx: TestRunPipelineEntityCtx<PrepareData>) {
    const { operate, store } = ctx;
    const allForms = this.document.getAllNodes().map((node) => node.form);
    const formValidations = await Promise.all(allForms.map(async (form) => form?.validate()));
    const validations = formValidations.filter((validation) => validation !== undefined);
    const isValid = validations.every((validation) => validation);
    if (!isValid) {
      Toast.info('Document has error!');
      operate.cancel();
      return;
    }
    const schema = {
      ...this.document.toJSON(),
      globalVariable: this.getGlobalVariableSchema(),
    };
    const { values = {} } = store.getState().data || {};
    const validateResult = await this.runtime.TaskValidate({
      schema: JSON.stringify(schema),
      inputs: values,
    });
    if (!validateResult?.valid) {
      const msg = validateResult?.errors?.[0] || 'Internal Server Error';
      Toast.info(msg);
      operate.cancel();
      return;
    }
  }
}

@injectable()
export class ExecutePipelinePlugin implements TestRunPipelinePlugin {
  name: 'ExecutePipelinePlugin';

  @inject(WorkflowDocument) document: WorkflowDocument;

  @inject(WorkflowRuntimeClient) runtime: WorkflowRuntimeClient;

  @inject(GetGlobalVariableSchema) getGlobalVariableSchema: GetGlobalVariableSchema;

  apply(pipeline: TestRunPipelineEntity) {
    pipeline.registerExecute(this.execute.bind(this));
  }

  async execute(ctx: TestRunPipelineEntityCtx) {
    const { store } = ctx;
    const schema = {
      ...this.document.toJSON(),
      globalVariable: this.getGlobalVariableSchema(),
    };
    const { data = {}, setData } = store.getState();
    const { values = {} } = data;

    const output = await this.runtime.TaskRun({
      schema: JSON.stringify(schema),
      inputs: values,
    });
    if (output?.taskID) {
      setData({ taskId: output.taskID });
    }
  }
}

@injectable()
export class ProgressPipelinePlugin implements TestRunPipelinePlugin {
  name: 'ProgressPipelinePlugin';

  @inject(WorkflowRuntimeClient) runtime: WorkflowRuntimeClient;

  apply(pipeline: TestRunPipelineEntity) {
    pipeline.registerProgress(this.progress.bind(this));
  }

  async progress(ctx: TestRunPipelineEntityCtx<{ taskId: string }>) {
    const { operate, store } = ctx;

    const { data, status } = store.getState();
    if (!data?.taskId || status !== 'executing') {
      return;
    }
    const result = await this.runtime.TaskReport({ taskID: data.taskId });

    if (!result) {
      Toast.error('Sync task report failed');
      return;
    }
    operate.update(result);

    if (result?.workflowStatus.terminated) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.progress(ctx);
  }
}
