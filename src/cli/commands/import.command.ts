import chalk from 'chalk';
import { TsvFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string): Promise<void> {
    const offer = createOffer(line);
    console.log(offer);
  }

  public async onImportEnd(totalLines: number): Promise<void> {
    console.info(
      chalk.green(
        `Import completed successfully! Total lines: ${chalk.yellow(totalLines)}`
      )
    );
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filePath] = parameters;
    const fileReader = new TsvFileReader(filePath.trim());

    fileReader.on('line', (line) => this.onImportedLine(line));
    fileReader.on('end', (totalLines) => this.onImportEnd(totalLines));

    try {
      await fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Error reading file: ${getErrorMessage(error)}`));
    }
  }
}
