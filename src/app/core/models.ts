export interface Account {
  id: string;
  name: string;
  number: string;
  currency: 'PLN' | 'EUR' | 'USD';
  balance: number;
}

export type TxKind = 'deposit' | 'withdrawal' | 'transfer';

export interface Transaction {
  id: string;
  ts: string;
  kind: TxKind;
  amount: number;
  currency: Account['currency'];
  fromAccountId?: string;
  toAccountId?: string;
  description?: string;
}
