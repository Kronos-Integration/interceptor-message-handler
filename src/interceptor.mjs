import LineParser from "./line-parser.mjs";
import { StreamTransformInterceptor } from "@kronos-integration/interceptor";

/**
 * This interceptor cares about the handling of the messages.
 * It will add the hops and copies the messages
 */
export class LineParserInterceptor extends StreamTransformInterceptor {
  static get name() {
    return "line-parser";
  }

  createTransformer()
  {
    return new LineParser(this, true);
  }
}

export default LineParserInterceptor;
