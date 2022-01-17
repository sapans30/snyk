import config from '../config';
import { makeRequest } from '../request';
import { getAuthHeader } from '../api-token';
import { FormattedResult } from '../../cli/commands/test/iac-local-execution/types';
import { convertIacResultToScanResult } from './utils';

export function shareResults(results: FormattedResult[]) {
  const scanResults = results.map(convertIacResultToScanResult);
  
  makeRequest({
    method: 'POST',
    url: `${config.API}/iac-cli-share-results`,
    json: true,
    headers: {
      authorization: getAuthHeader(),
    },
    body: scanResults,
  });
}
