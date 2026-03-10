declare module 'kuromoji' {
  export type IpadicFeatures = {
    surface_form: string;
    reading?: string;
    pronunciation?: string;
  } & Record<string, unknown>;

  export interface Tokenizer<T extends IpadicFeatures> {
    tokenize(text: string): T[];
  }

  export interface Builder {
    build(
      callback: (
        error: Error | null,
        tokenizer?: Tokenizer<IpadicFeatures>,
      ) => void,
    ): void;
  }

  export function builder(options: { dicPath: string }): Builder;
}

declare module 'kuromoji/build/kuromoji' {
  import type { Builder } from 'kuromoji';

  const kuromoji: {
    builder(options: { dicPath: string }): Builder;
  };

  export default kuromoji;
}
