import React, { Component } from 'react';
import { Input } from '@mycrypto/ui';

import { InlineErrorMsg, ENSStatus } from 'v2/components';
import { ITxFields } from '../../types';
import { getResolvedENSAddress } from 'v2/features/Ens/ensFunctions';
import { getIsValidENSAddressFunction, isValidETHAddress } from 'v2/libs/validators';
import { FormikProps } from 'formik';

/*
  Eth address field to be used within a Formik Form
  - the 'fieldname' must exist within the Formik default fields
  - validation of the field is handled here.
*/

interface ETHAddressFieldProps {
  error?: string;
  touched?: boolean;
  placeholder?: string;
  handleBlur(e: string): void;
}

interface Props {
  error?: string;
  touched?: boolean;
  placeholder?: string;
  values: ITxFields;
  form: FormikProps<any>;
  handleGasEstimate(): void;
}

interface State {
  isResolving: boolean;
}

function ETHAddressField({
  error,
  touched,
  placeholder = 'Eth Address',
  handleBlur
}: ETHAddressFieldProps) {
  // By destructuring 'field' in the rendered component we are mapping
  // the Inputs 'value' and 'onChange' props to Formiks handlers.
  return (
    <>
      <Input placeholder={placeholder} onBlur={e => handleBlur(e.currentTarget.value)} />
      {error && touched ? (
        <InlineErrorMsg className="SendAssetsForm-errors">{error}</InlineErrorMsg>
      ) : null}
    </>
  );
}

export class RecipientAddressField extends Component<Props> {
  public state: State = {
    isResolving: false
  };

  public async handleENSResolve(name: string) {
    const { values, handleGasEstimate, form } = this.props;
    if (!values || !values.network) {
      return;
    }
    this.setState({ isResolving: true });
    const resolvedAddress: string | null = await getResolvedENSAddress(values.network, name);
    this.setState({ isResolving: false });
    resolvedAddress === null
      ? form.setFieldValue('resolvedNSAddress', '0x0')
      : form.setFieldValue('resolvedNSAddress', resolvedAddress);

    if (resolvedAddress) {
      handleGasEstimate();
    }
  }

  public render() {
    const { isResolving } = this.state;
    const { values, placeholder, form, handleGasEstimate } = this.props;
    console.log('isResolving: ' + isResolving);
    return (
      <>
        <ETHAddressField
          handleBlur={(e: any) => {
            console.log(e);
            form.setFieldValue('recipientAddress', e);
            if (values && values.network) {
              const isValidENS = getIsValidENSAddressFunction(values.network.chainId);
              form.setFieldValue('resolvedNSAddress', '');
              console.log(isValidENS(e));
              if (isValidENS(e)) {
                this.handleENSResolve(e);
              } else if (isValidETHAddress(e)) {
                handleGasEstimate();
              }
            }
          }}
          placeholder={placeholder}
        />
        <ENSStatus
          ensAddress={values.recipientAddress}
          isLoading={isResolving}
          rawAddress={values.resolvedNSAddress}
          chainId={values.network ? values.network.chainId : 1}
        />
      </>
    );
  }
}

export default RecipientAddressField;
