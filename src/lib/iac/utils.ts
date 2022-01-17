import { FormattedResult } from '../../cli/commands/test/iac-local-execution/types';
import { ScanResult } from '../ecosystems/types';

export function convertIacResultToScanResult(
  iacResult: FormattedResult,
): ScanResult {
  return {
    identity: {
      type: iacResult.packageManager,
      targetFile: iacResult.targetFile,
    },
    facts: iacResult.result.cloudConfigResults.map((result) => {
      return { data: result, type: 'iacIssues' };
    }),
    name: iacResult.projectName,
    target: {},
  };
}
