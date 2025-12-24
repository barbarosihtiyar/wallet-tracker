import type { FormInstance } from 'antd';
import type { NamePath } from 'antd/es/form/interface';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const useErrorTranslation = (formInstances?: FormInstance | FormInstance[]) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!formInstances) return;

    const forms = Array.isArray(formInstances)
      ? formInstances
      : [formInstances];

    forms.forEach(form => {
      const errorFields: NamePath[] = [];

      form.getFieldsError().forEach(field => {
        if (field.errors.length) {
          errorFields.push(field.name);
        }
      });

      if (errorFields.length) {
        form.validateFields(errorFields);
      }
    });
  }, [i18n.language, formInstances]);
};

export default useErrorTranslation;
