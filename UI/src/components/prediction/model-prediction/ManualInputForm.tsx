"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z, ZodError } from "zod";
import { fieldsConfig } from "./utils";
import { Button } from "@/components/button/Button";
import { ModelPredicitonRequestInput } from "@/types";

const generateZodSchema = () => {
  const shape: { [key: string]: z.ZodTypeAny } = {};
  fieldsConfig.forEach((field) => {
    shape[field.name] = field.validation;
  });
  return z.object(shape);
};

const ManualInputZodSchema = generateZodSchema();
type ManualFormValues = z.infer<typeof ManualInputZodSchema>;

interface ManualInputFormProps {
  onSubmit: (values: ModelPredicitonRequestInput) => Promise<void>;
  model_type: string;
  isLoading: boolean;
  initialValues?: Partial<ManualFormValues>;
}

export default function ManualInputForm({
  onSubmit,
  isLoading,
  initialValues = {},
  model_type,
}: ManualInputFormProps) {
  const formikInitialValues = fieldsConfig.reduce((acc, field) => {
    acc[field.name] = initialValues[field.name as keyof ManualFormValues] ?? "";
    return acc;
  }, {} as any);

  const validateFormWithZod = (values: ManualFormValues) => {
    try {
      const valuesToValidate = { ...values };
      for (const key in valuesToValidate) {
        const fieldConfig = fieldsConfig.find((f) => f.name === key);
        if (valuesToValidate[key] === "" && fieldConfig?.validation) {
        } else if (
          fieldConfig?.type === "number" ||
          fieldConfig?.type === "select"
        ) {
          if (
            valuesToValidate[key] !== "" &&
            valuesToValidate[key] !== null &&
            valuesToValidate[key] !== undefined
          ) {
            const numValue = parseFloat(valuesToValidate[key]);
            valuesToValidate[key] = isNaN(numValue)
              ? valuesToValidate[key]
              : numValue;
          } else if (valuesToValidate[key] === "") {
          }
        }
      }
      ManualInputZodSchema.parse(valuesToValidate);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const formikErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            formikErrors[err.path[0] as string] = err.message;
          }
        });
        return formikErrors;
      }
      return {};
    }
  };

  return (
    <div className="tab-content active bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">
        Enter Features Manually:
      </h3>
      <Formik
        initialValues={formikInitialValues}
        validate={validateFormWithZod}
        onSubmit={(values, { setSubmitting }) => {
          const processedValues: any = {};
          fieldsConfig.forEach((field) => {
            const rawValue = values[field.name as keyof typeof values];
            if (
              rawValue === "" ||
              rawValue === null ||
              rawValue === undefined
            ) {
              processedValues[field.name] = undefined;
            } else if (field.type === "number" || field.type === "select") {
              const num = parseFloat(rawValue as string);
              processedValues[field.name] = isNaN(num) ? undefined : num;
            } else {
              processedValues[field.name] = rawValue;
            }
          });

          onSubmit({
            features: processedValues,
            model_type,
          });
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ errors, touched }) => (
          <div>
            <Form id="manualFeaturesForm">
              <div className="flex flex-wrap -mx-2">
                {fieldsConfig.map((field, index) => (
                  <div
                    key={field.name}
                    className="w-full md:w-1/3 px-2 mb-6 flex flex-col justify-start"
                  >
                    <div className="h-full">
                      <label
                        htmlFor={field.name}
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        {field.label}
                      </label>
                      {field.type === "select" ? (
                        <Field
                          as="select"
                          name={field.name}
                          id={field.name}
                          className={`block w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-colors duration-150 ease-in-out
              ${
                errors[field.name as string] && touched[field.name as string]
                  ? "border-red-500 text-red-800 focus:border-red-500 focus:ring-red-500/60"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
              } focus:outline-none`}
                        >
                          {field.options?.map((option) => (
                            <option
                              key={option.value.toString()}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      ) : (
                        <Field
                          type="number"
                          step="any"
                          name={field.name}
                          id={field.name}
                          className={`block w-full rounded-lg border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-colors duration-150 ease-in-out
              ${
                errors[field.name as string] && touched[field.name as string]
                  ? "border-red-500 text-red-800 placeholder-red-400 focus:border-red-500 focus:ring-red-500/60"
                  : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30"
              } focus:outline-none`}
                          placeholder={field.placeholder || `Enter value`}
                        />
                      )}
                      <ErrorMessage
                        name={field.name}
                        component="div"
                        className="mt-1.5 text-xs font-medium text-red-600"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button isLoading={isLoading} type="submit" />
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
