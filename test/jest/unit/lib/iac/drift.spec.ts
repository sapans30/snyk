import { findDriftCtl, parseArgs } from '../../../../../src/lib/iac/drift';
import * as cacheDir from 'cachedir';
import * as isExe from 'isexe';
import * as which from 'which';
const cache = cacheDir('snyk');

describe('driftctl integration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('default arguments are correct', () => {
    const args = parseArgs(['scan'], {});
    expect(args).toEqual(['scan', '--config-dir', cache, '--to', 'aws+tf']);
  });

  it('passing options generate correct arguments', () => {
    const args = parseArgs(['scan'], {
      'config-dir': 'confdir',
      'tf-lockfile': 'tflockfile',
      'tf-provider-version': 'tfproviderversion',
      'tfc-endpoint': 'tfcendpoint',
      'tfc-token': 'tfctoken',
      deep: true,
      driftignore: 'driftignore',
      filter: 'filter',
      from: 'from',
      headers: 'headers',
      output: 'output',
      quiet: true,
      strict: true,
      to: 'to',
    });
    expect(args).toEqual([
      'scan',
      '--quiet',
      '--filter',
      'filter',
      '--output',
      'output',
      '--headers',
      'headers',
      '--tfc-token',
      'tfctoken',
      '--tfc-endpoint',
      'tfcendpoint',
      '--tf-provider-version',
      'tfproviderversion',
      '--strict',
      '--deep',
      '--driftignore',
      'driftignore',
      '--tf-lockfile',
      'tflockfile',
      '--config-dir',
      'confdir',
      '--from',
      'from',
      '--to',
      'to',
    ]);
  });

  it('findDriftctl precedence to env var', async () => {
    jest.spyOn(isExe, 'sync').mockReturnValue(true);
    process.env.DRIFTCTL_PATH = 'var env path';
    const path = await findDriftCtl();
    delete process.env.DRIFTCTL_PATH;
    expect(path).toEqual('var env path');
  });

  it('findDriftctl fallback to $PATH when DRIFTCTL_PATH is not set', async () => {
    jest.spyOn(isExe, 'sync').mockReturnValue(true);
    jest.spyOn(which, 'sync').mockReturnValue('value from $PATH');
    const path = await findDriftCtl();
    expect(path).toEqual('value from $PATH');
  });

  it('findDriftctl fallback to cache when DRIFTCTL_PATH is not set and there is nothing in $PATH', async () => {
    jest.spyOn(isExe, 'sync').mockReturnValue(true);
    jest.spyOn(which, 'sync').mockReturnValue(null);
    const driftctlPath = cache + '/driftctl';

    const path = await findDriftCtl();
    expect(path).toEqual(driftctlPath);
  });

  it('findDriftctl return empty string when driftctl is not found', async () => {
    jest.spyOn(isExe, 'sync').mockReturnValue(false);
    const path = await findDriftCtl();
    expect(path).toEqual('');
  });
});
