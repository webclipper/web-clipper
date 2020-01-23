import { IPermissionsService } from '@/service/common/permissions';
import { useState } from 'react';
import Container from 'typedi';

const useOriginPermission = (initData: boolean) => {
  const [verified, setVerified] = useState(initData);
  const permissionsService = Container.get(IPermissionsService);
  const requestOriginPermission = async (origin: string) => {
    const result = await permissionsService.request({
      origins: [`${origin}/*`],
    });
    setVerified(result);
  };
  return [verified, requestOriginPermission] as const;
};

export default useOriginPermission;
