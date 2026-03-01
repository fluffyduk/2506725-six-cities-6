import axios from 'axios';
import { MockServerData } from '../../shared/types/mock-server-data.type.ts';
import { Command } from './command.interface.ts';
import { getErrorMessage } from '../../shared/helpers/common.ts';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.ts';
import { appendFile } from 'node:fs/promises';

const isMockServerData = (data: unknown): data is MockServerData =>
  typeof data === 'object' &&
    data !== null &&
    'titles' in data &&
    'descriptions' in data &&
    'cities' in data &&
    'previewImages' in data &&
    'photos' in data &&
    'types' in data &&
    'features' in data &&
    'users' in data;

export class GenerateCommand implements Command {
  private initialData!: MockServerData;


  
  private async load(url: string) {
    try {
      const response = await axios.get(url);

      if (!isMockServerData(response.data)) {
        throw new Error(`Invalid mock server data from ${url}`);
      }

      this.initialData = response.data;
    } catch (error) {
      throw new Error(
        `Failed to load data from url ${url}: ${getErrorMessage(error)}`
      );
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    for (let i = 0; i < offerCount; i++) {
      await appendFile(
        filepath,
        `${tsvOfferGenerator.generate()}\n`,
        { encoding: 'utf-8' }
      );
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!!!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
