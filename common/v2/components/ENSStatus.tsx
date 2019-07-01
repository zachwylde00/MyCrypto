import React from 'react';
import Spinner from 'components/ui/Spinner';
import { translate, translateRaw } from 'translations';
import { getIsValidENSAddressFunction } from 'v2/libs/validators';

const ENSStatus: React.SFC<{
  isLoading: boolean;
  ensAddress: string;
  rawAddress: string;
  chainId: number;
}> = ({ isLoading, ensAddress, rawAddress, chainId }) => {
  const isValidENS = getIsValidENSAddressFunction(chainId);
  const isENS = isValidENS(ensAddress);
  console.log('isResolving: ' + isLoading);
  const text = translate('LOADING_ENS_ADDRESS');

  if (isLoading) {
    return (
      <React.Fragment>
        <Spinner /> {text}
      </React.Fragment>
    );
  } else {
    return isENS ? (
      rawAddress === '' ? null : (
        <React.Fragment>{`${translateRaw(
          'NAME_OWNED_RESOLVED_ADDR'
        )}: ${rawAddress}`}</React.Fragment>
      )
    ) : null;
  }
};

export default ENSStatus;
