export interface createTransactionInput {
  orderId: string | undefined;
  amount: number | undefined;
  currency: string | undefined;
  externalUrl: string;
  pspReference: string;
}

export interface updateTransactionInput {
  transactionId: string | undefined;
  amount: number | undefined;
  currency: string | undefined;
  externalUrl: string;
  pspReference: string;
  pspReferenceEvent: string;
}

export interface CallbackPayload {
  id: string;
  externalTransactionId: string;
  transactionType: string;
  AMOUNT: number;
  FEE: number;
  PHONE_NUMBER: string;
  STATUS: string;
  CUSTOM_DATA: string;
  COMPLETED_AT: string;
  BALANCE: number;
  PREVIOUS_BALANCE: number;
  CURRENT_BALANCE: number;
}
