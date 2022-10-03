import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IItem, sp } from '@pnp/sp/presets/all';
import { FunctionsService } from '../Service/FunctionsService';
import { IUserProfile } from "../Model/UserProfile";
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { isEmpty } from "@microsoft/sp-lodash-subset";
import { legacyStyled } from "office-ui-fabric-react/lib/Foundation";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/security";

export class SPService {
    constructor(private context: WebPartContext) {

        sp.setup({
            spfxContext: this.context
        });
    }

    public async getListItemsNum(select: string, filter: string, expand: string, orderby: string, numberOfSlider: number, listId: string) {

        return sp.web.lists.getById(listId)
            .items
            .select(select)
            .filter(filter)
            .orderBy(orderby, false)
            .top(numberOfSlider == undefined ? 5 : numberOfSlider)
            .expand(expand)
            .get()
            .then(async (result) => {

                var listItems = result;
                return listItems;
            })
            .catch((err) => {
                console.error(err);
                return [];
                Promise.reject(err);
            });
    }

    public async getListItems(select: string, filter: string, expand: string, orderby: string, listId: string, ascending?: boolean) {

        return sp.web.lists.getById(listId)
            .items
            .select(select)
            .filter(filter)
            .orderBy(orderby, ascending)
            .expand(expand)
            .getAll()
            .then(async (result) => {

                var listItems = result;
                return listItems;
            })
            .catch((err) => {
                console.error(err);
                return [];
                Promise.reject(err);
            });
    }


    public async getListItem(select: string, filter: string, listId: string) {

        return sp.web.lists.getById(listId)
            .items
            .select(select)
            .filter(filter)
            .getAll()
            .then(async (result) => {

                var listItems = result;
                return listItems;
            })
            .catch((err) => {
                console.error(err);
                return [];
                Promise.reject(err);
            });
    }

    public async GetListImages(listId: string, field: string, filter: string) {

        return sp.web.lists.getById(listId)
            .items
            .select(field)
            .filter(filter)
            .expand()
            .getAll()
            .then(async (result) => {

                var listItems = result;
                return listItems;
            })
            .catch((err) => {
                console.error(err);
                return [];
                Promise.reject(err);
            });
    }

    public async GetListItemsWithParameterByTitleList(titleList: string, selectField: string, filterQuery: string, topCount: number, orderByField: string, ascending?: boolean) {
        return sp.web.lists.getByTitle(titleList)
            .items
            .select(selectField)
            .filter(filterQuery)
            .orderBy(orderByField, ascending)
            .top(topCount)
            .getAll()
            .then(async (result) => {

                var listItems = result;
                return listItems;
            })
            .catch((err) => {
                console.error(err);
                return [];
                Promise.reject(err);
            });
    }

    public async GetListItemsWithParameter(guidIdList: string, selectField: string, filterQuery: string, topCount: number, orderByField: string, ascending?: boolean) {
        return sp.web.lists.getById(guidIdList)
            .items
            .select(selectField)
            .filter(filterQuery)
            .orderBy(orderByField, ascending)
            .top(topCount)
            .get()
            .then(async (result) => {

                var listItems = result;
                return listItems;
            })
            .catch((err) => {
                console.error(err);
                return [];
                Promise.reject(err);
            });
    }

    public getViewRecentPages(startingUrl: string): Promise<any> {
        //const url=`_api/search/query?querytext='path:https://ternaspa.sharepoint.com/sites/InTerna/SitePages'&refinementfilters='RefinableString01:equals("News")'&selectproperties='ViewsRecent,Title,Path,ViewsRecent,RefinableString00,RefinableString01,ViewsLifeTime'&rowlimit=10&sortlist='ViewsRecent:descending'"`;
        //startingUrl="https://avateamdev.sharepoint.com/sites/TernaIntranet/SitePages";
        const url = `/search/_api/search/query?querytext='Path:${startingUrl}'&refinementfilters='RefinableString01:equals("News")'&selectproperties='Title,Path,ViewsRecent,RefinableString00,RefinableString02,RefinableString03,PictureThumbnailURL,ViewsLifeTime,Description'&sortlist='ViewsRecent:descending'&rowLimit=500`;//"/search/_api/search/query?querytext='path:https://avateamdev.sharepoint.com/sites/TernaIntranet/SitePages'"//&selectproperties='ViewsRecent,Title,Path,ViewsRecent,RefinableString00,RefinableString01,ViewsLifeTime'&rowlimit=10&sortlist='ViewsRecent:descending'"` //`/search/_api/search/query?querytext='Path:${startingUrl}* AND contentclass:STS_Site'&selectproperties='Title,Path'&trimduplicates=false&rowLimit=500;
        let items: any[] = [];

        return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json().then((data) => {

                    if (data["odata.error"]) {
                        //se ho degli errori ritorno l'array vuoto
                        //Log.error(Constants.LOG_SOURCE, new Error(data["odata.error"].message.value));
                        return items;
                    }

                    const rows = data.PrimaryQueryResult.RelevantResults.Table.Rows;
                    rows.forEach(c => {
                        const objTitle = c.Cells.filter((cell) => { return cell.Key == "Title"; })[0];
                        const objUrl = c.Cells.filter((cell) => { return cell.Key == "Path"; })[0];
                        const objCategoria = c.Cells.filter((cell) => { return cell.Key == "RefinableString00"; })[0];
                        const objTag = c.Cells.filter((cell) => { return cell.Key == "RefinableString02"; })[0];
                        const objPictureThumbnailURL = c.Cells.filter((cell) => { return cell.Key == "PictureThumbnailURL"; })[0];
                        const objViewsRecent = c.Cells.filter((cell) => { return cell.Key == "ViewsRecent"; })[0];
                        const objDescription = c.Cells.filter((cell) => { return cell.Key == "Description"; })[0];
                        const objFirstPublishedDate = c.Cells.filter((cell) => { return cell.Key == "RefinableString03"; })[0];

                        // ritorno solo il titolo e la url
                        if (objViewsRecent.Value != null) {
                            items.push({
                                Title: objTitle.Value,
                                Url: objUrl.Value,
                                Categoria: objCategoria.Value,
                                Tag: objTag.Value.replaceAll(';', ' ').replaceAll(',', ' '),
                                BannerImageUrl: objPictureThumbnailURL.Value,
                                Description: objDescription.Value,
                                ViewsRecent: objViewsRecent.Value,
                                FirstPublishedDate: objFirstPublishedDate.Value
                            });
                        }
                    });

                    //custom sort: &sortlist='Title:ascending' -> non funziona da errore
                    items = items.slice(0, 3);
                    return items;
                });
            });
    }
}