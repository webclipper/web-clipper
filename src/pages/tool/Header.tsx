import React, { useEffect, useRef, useMemo } from 'react';
import { Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Section from '@/components/section';
import { FormattedMessage } from 'react-intl';
import * as styles from './index.scss';
import { useSelector, useDispatch } from 'dva';
import { GlobalStore, ClipperHeaderForm } from '@/common/types';
import { updateClipperHeader, asyncCreateDocument } from '@/actions/clipper';
import { isEqual } from 'lodash';
import { ServiceMeta, Repository } from '@/common/backend';

type PageProps = FormComponentProps & {
  pathname: string;
  service: ServiceMeta | null;
  currentRepository?: Repository;
};

const ClipperHeader: React.FC<PageProps> = props => {
  const {
    form: { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue },
    form,
    pathname,
    service,
    currentRepository,
  } = props;
  const formValue = getFieldsValue() as ClipperHeaderForm;
  const ref = useRef<ClipperHeaderForm>(formValue);
  const { loading, clipperHeaderForm } = useSelector((g: GlobalStore) => {
    return {
      loading: g.loading.effects[asyncCreateDocument.started.type],
      clipperHeaderForm: g.clipper.clipperHeaderForm,
    };
  }, isEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEqual(clipperHeaderForm, ref.current)) {
      return;
    }
    setFieldsValue(clipperHeaderForm);
  }, [clipperHeaderForm, formValue, setFieldsValue]);

  useEffect(() => {
    if (isEqual(ref.current, formValue)) {
      return;
    }
    dispatch(updateClipperHeader(formValue));
    ref.current = formValue;
  }, [dispatch, formValue]);

  const handleSubmit = () => {
    validateFields(err => {
      if (err) {
        return;
      }
      dispatch(asyncCreateDocument.started({ pathname }));
    });
  };

  const headerForm = useMemo(() => {
    return (
      !!service &&
      !!service.headerForm && (
        <service.headerForm form={form} currentRepository={currentRepository}></service.headerForm>
      )
    );
  }, [currentRepository, form, service]);

  return (
    <Section
      title={<FormattedMessage id="tool.title" defaultMessage="Title" />}
      className={styles.header}
    >
      <Form.Item>
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage id="tool.title.required" defaultMessage="Title is Required" />
              ),
            },
          ],
        })(<Input placeholder="Please Input Title" />)}
      </Form.Item>
      {headerForm}
      <Button
        className={styles.saveButton}
        size="large"
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        disabled={loading || pathname === '/'}
        block
      >
        {<FormattedMessage id="tool.save" defaultMessage="Save Content" />}
      </Button>
    </Section>
  );
};

export default Form.create<PageProps>()(ClipperHeader);
