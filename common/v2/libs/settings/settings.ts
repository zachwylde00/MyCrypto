import { getCache, setCache } from 'v2/services/LocalCache/LocalCache';
import { Settings } from 'v2/services/Settings/types';

export const getSettings = (): Settings => {
  return getCache().settings;
};

export const removeDashboardAccount = (uuid: string): void => {
  const newCache = getCache();
  newCache.settings.dashboardAccounts.filter(accountStrings => accountStrings === uuid);
  setCache(newCache);
};
