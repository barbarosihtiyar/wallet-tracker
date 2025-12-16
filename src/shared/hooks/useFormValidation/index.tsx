import { FormInstance } from "antd/es/form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface UseFormValidationProps {
  form: FormInstance;
}

const useFormValidation = ({ form }: UseFormValidationProps): void => {
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    const errorFields = form.getFieldsError().reduce<string[]>((arr, field) => {
      if (field.errors.length) {
        arr.push(field.name as unknown as string);
      }

      return arr;
    }, []);

    if (!errorFields.length) return;

    form.validateFields(errorFields);
  }, [language, form]);
};

export default useFormValidation;
