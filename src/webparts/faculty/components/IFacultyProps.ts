import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IFacultyProps {
  description: string;
  listId: string;
  listRole: string;
  listSpecialization: string;
  //filterByCategoria: string;
  context: WebPartContext;
}
