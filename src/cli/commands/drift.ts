import { MethodArgs } from '../args';
import { processCommandArgs } from './process-command-args';
import { driftctl, parseArgs } from '../../lib/iac/drift';

const legacyError = require('../../lib/errors/legacy-errors');

export default async function drift(...args: MethodArgs): Promise<any> {
  const { options, paths } = processCommandArgs(...args);

  if (options.iac != true) {
    return legacyError('drift');
  }

  try {
    const args = await parseArgs(paths, options);
    const ret = await driftctl(args);
    process.exit(ret);
  } catch (e) {
    const err = new Error('Error running `iac drift` ' + e);
    return Promise.reject(err);
  }
}
