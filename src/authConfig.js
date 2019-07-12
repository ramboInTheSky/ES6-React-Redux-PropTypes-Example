import { getWindowOrigin } from 'nhh-styles';

import { arrearsBaseRoute, arrearsClientId, authTenantName } from './constants/tokens';
import devElse from './util/devElse';

export default {
  requireTenant: true,
  closable: false,
  apiTokenCallbackUrl: devElse(
    `${getWindowOrigin()}/callback.html`,
    `${getWindowOrigin()}${arrearsBaseRoute}/callback.html`
  ),
  auth: {
    redirectUrl: devElse(getWindowOrigin(), `${getWindowOrigin()}${arrearsBaseRoute}`),
  },
  clientId: devElse('7S4DP6HaTH5htG72ZqDOC3tONqK1yG62', arrearsClientId),
  domain: devElse('nhh-dev.eu.auth0.com', `${authTenantName}.eu.auth0.com`),
  id: 'arrears-spa',
  ssoCallbackUrl: devElse(
    `${getWindowOrigin()}/callback.html`,
    `${getWindowOrigin()}${arrearsBaseRoute}/callback.html`
  ),
};
