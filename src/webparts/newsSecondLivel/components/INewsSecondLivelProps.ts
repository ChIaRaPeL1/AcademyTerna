import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INewsSecondLivelProps {
  description: string;
  listName: string;
  context: WebPartContext;
  numberOfNews: number;
  listGuidID: string;
}
