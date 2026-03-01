import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/index.js';
import { createOffer } from '../../helpers/index.js';
import { EventEmitter } from 'node:events';

const CHUNK_SIZE = 16384;
export class TsvFileReader extends EventEmitter implements FileReader {
  private rawData = '';

  constructor(private filePath: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filePath, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const line = remainingData.slice(0, nextLinePosition + 1).trim();
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;
        this.emit('line', line);
      }

      this.emit('end', importedRowCount);
    }
  }

  public toArray(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => createOffer(line));
  }
}
