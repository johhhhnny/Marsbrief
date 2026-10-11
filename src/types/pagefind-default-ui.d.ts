declare module "@pagefind/default-ui" {
  type PagefindUIOptions = {
    element: string;
    bundlePath?: string;
    showSubResults?: boolean;
    showImages?: boolean;
    autofocus?: boolean;
    translations?: Record<string, string>;
  };

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
}