import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICarouselNewsProps {
  description: string;
  listName: string;
  context: WebPartContext;
  numberOfSlider: number;
  listGuidID: string;
  IDDocumentLibraryImages: string;
}
