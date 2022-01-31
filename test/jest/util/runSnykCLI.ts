import * as path from 'path';
import { runCommand, RunCommandResult, RunCommandOptions } from './runCommand';

const cwd = process.cwd();

const runSnykCLI = async (
  argsString: string,
  options?: RunCommandOptions,
): Promise<RunCommandResult> => {
  const cliPath = path.resolve(cwd, './bin/snyk');
  const args = argsString.split(' ').filter((v) => !!v);

  if (process.env.TEST_SNYK_COMMAND) {
    return await runCommand(process.env.TEST_SNYK_COMMAND, args, options);
  }

  return await runCommand('node', [cliPath, ...args], options);
};

export { runSnykCLI };
