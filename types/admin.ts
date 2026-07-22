export type Admin = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type AdminFormData = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
};

export type AdminFormErrors = {
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
};
