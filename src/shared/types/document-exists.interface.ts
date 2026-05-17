export interface DocumentExists {
    documentExists(documentId: string): Promise<boolean>;
}
