"use client"

import { Button } from "../../../ui-components/src/components/ui/button";
import { Input } from "../../../ui-components/src/components/ui/input";
import { Label } from "../../../ui-components/src/components/ui/label";
import { Textarea } from "../../../ui-components/src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui-components/src/components/ui/select"
import { useState } from "react";

interface NewOrderFormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface NewOrderProps {
  data: NewOrderFormField[];
}

export const NewOrderForm = ({ data }: NewOrderProps) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4">
      {data.map((field, index) => {
        return (
          <div key={index}>
            <Label>{field.label}</Label>
            {(() => {
              switch (field.type) {
                case "select":
                  return (
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper">
                      {field.options?.map((option, idx) => (
                          <SelectItem key={idx} value={option.value} >{option.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  );
                case "textarea":
                  return <Textarea name={field.name} placeholder={field.placeholder} />;
                default:
                  return <Input name={field.name} type={field.type} placeholder={field.placeholder} />;
              }
            })()}
          </div>
        );
      })}
      <div className="flex gap-2">
        <Button variant="destructive" className="w-full">
          Cancel
        </Button>
        <Button className="w-full" type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
};
