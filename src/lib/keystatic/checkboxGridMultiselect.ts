import { createElement } from "react";
import { fields } from "@keystatic/core";

type CheckboxOption = {
  label: string;
  value: string;
};

type CheckboxGridConfig<Options extends readonly CheckboxOption[]> = {
  label: string;
  options: Options;
  description?: string;
  required?: boolean;
};

export function checkboxGridMultiselect<
  const Options extends readonly CheckboxOption[],
>({ label, options, description, required = false }: CheckboxGridConfig<Options>) {
  const field = fields.multiselect({ label, options, description });

  return {
    ...field,
    Input: ({ value, onChange, autoFocus, forceValidation }: Parameters<
      typeof field.Input
    >[0]) =>
      createElement(
        "fieldset",
        {
          style: { border: 0, margin: 0, minWidth: 0, padding: 0 },
        },
        createElement(
          "legend",
          { style: { fontWeight: 600, marginBottom: "0.5rem" } },
          label
        ),
        description
          ? createElement(
            "p",
            { style: { margin: "0 0 0.75rem", opacity: 0.75 } },
            description
          )
          : null,
        createElement(
          "div",
          {
            style: {
              display: "grid",
              gap: "0.75rem 1rem",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            },
          },
          ...options.map((option, index) =>
            createElement(
              "label",
              {
                key: option.value,
                style: {
                  alignItems: "flex-start",
                  display: "flex",
                  gap: "0.5rem",
                  minWidth: 0,
                },
              },
              createElement("input", {
                type: "checkbox",
                checked: value.includes(option.value),
                autoFocus: autoFocus && index === 0,
                onChange: () =>
                  onChange(
                    value.includes(option.value)
                      ? value.filter((item) => item !== option.value)
                      : [...value, option.value]
                  ),
                style: { flex: "none", marginTop: "0.2rem" },
              }),
              createElement(
                "span",
                { style: { overflowWrap: "anywhere" } },
                option.label
              )
            )
          )
        ),
        required && forceValidation && value.length === 0
          ? createElement(
            "p",
            { role: "alert", style: { color: "#b42318", marginTop: "0.5rem" } },
            "至少选择一个分类。"
          )
          : null
      ),
    validate(value: Parameters<typeof field.validate>[0]) {
      if (required && value.length === 0) {
        throw new Error("至少选择一个分类。");
      }
      return field.validate(value);
    },
  };
}