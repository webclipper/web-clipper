import React, { useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Section from '@/components/section';
import { FormattedMessage } from 'react-intl';
import * as styles from './index.scss';
import { useSelector, useDispatch } from 'dva';
import { GlobalStore, ClipperHeaderForm } from '@/common/types';
import { updateClipperHeader, asyncCreateDocument } from '@/actions/clipper';
import { isEqual } from 'lodash';

type PageProps = FormComponentProps & { pathname: string };

const ClipperHeader: React.FC<PageProps> = props => {
  const {
    form: { getFieldDecorator, validateFields, getFieldsValue, setFieldsValue },
    pathname,
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

  return (
    <Section title={<FormattedMessage id="tool.title" defaultMessage="Title" />}>
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
