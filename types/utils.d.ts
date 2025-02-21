export type PartialExcept<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

export type ServerResponse =
  | {
      success: false;
      data: null;
      error: string;
    }
  | {
      success: true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
      error: null;
    };
