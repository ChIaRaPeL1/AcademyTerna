import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISectionBoxProps {
  description: string;

  context: WebPartContext;
  listGuidID: string;
}
