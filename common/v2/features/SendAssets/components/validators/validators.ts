import {
  isValidHex,
  gasPriceValidator,
  gasLimitValidator,
  isValidAmount,
  isValidETHAddress,
  getIsValidENSAddressFunction
} from 'v2/libs/validators';
import { translateRaw } from 'translations';
import { ITxFields } from '../../types';

export function validateGasPriceField(value: string): string | undefined {
  if (!gasPriceValidator(value)) {
    return translateRaw('ERROR_10');
  }
}

export function validateGasLimitField(value: string): string | undefined {
  if (!gasLimitValidator(value)) {
    return translateRaw('ERROR_8');
  }
}

export function validateDataField(value: string): string | undefined {
  if (!isValidHex(value)) {
    return translateRaw('ERROR_9');
  }
}

export function validateNonceField(value: string): string | undefined {
  if (!(parseInt(value, 10) >= 0)) {
    return translateRaw('ERROR_11');
  }
}

export function validateAmountField(value: string): string | undefined {
  if (!isValidAmount(parseFloat(value))) {
    return translateRaw('ERROR_0');
  }
}

export function validateRecipientField(value: string, values: ITxFields): string | undefined {
  let errorMsg;
  if (!value) {
    errorMsg = translateRaw('REQUIRED');
  } else if (!isValidETHAddress(value)) {
    if (values && values.network) {
      const isValidENS = getIsValidENSAddressFunction(values.network.chainId);
      if (!isValidENS(value)) {
        errorMsg = translateRaw('TO_FIELD_ERROR');
      }
    } else {
      errorMsg = translateRaw('TO_FIELD_ERROR');
    }
  }
  return errorMsg;
}
