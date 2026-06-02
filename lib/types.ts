export type User = {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  balance: number;
  status: string;
  package_id?: number | null;
};

export type Package = {
  id: number;
  name: string;
  amount: number;
  monthly_return: number;
  max_trade: number;
  support_level: string;
};

export type Transaction = {
  id: string | number;
  user_id: string | number;
  type: string;
  amount: number;
  status: string;
  created_at: string;
};

export type Loan = {
  id: string | number;
  user_id: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  net_income?: number;
  amount: number;
  tenure: number;
  status: string;
  created_at?: string;
  updated_at?: string | null;
};
