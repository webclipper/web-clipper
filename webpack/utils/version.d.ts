type GenerateVersionOptions = {
  version: string;
  commitsCount: number;
  beta?: boolean;
};

export function generateVersion(options: GenerateVersionOptions): string;
export function getPackageJsonVersion(): string;
