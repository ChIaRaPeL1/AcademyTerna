import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IPageNewsProps {
  description: string;
  listId: string;
  numberOfNews: number;
  //filterByCategoria: string;
  filterByTagName: string;
  onConfigure: () => void;
  context: WebPartContext;
  ViewForSingleNews: boolean;
}
