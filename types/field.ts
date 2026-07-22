export type Field = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FieldFormData = {
  name: string;
  description: string;
};

export type FieldFormErrors = {
  name?: string;
  description?: string;
};
