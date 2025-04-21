import React from "react";

interface FormPartProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const FormPart = ({
  title,
  description,
  children,
}: React.PropsWithChildren<FormPartProps>) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};
