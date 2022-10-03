import * as React from 'react';
import styles from './PageNews.module.scss';
import { IPageNewsProps } from './IPageNewsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp";
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import MediaQuery from 'react-responsive';

import {
  DocumentCard,
  DocumentCardActivity,
  DocumentCardPreview,
  DocumentCardDetails,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  DocumentCardLocation,
  DocumentCardType
} from 'office-ui-fabric-react/lib/DocumentCard';
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { elementContains, ISize, replaceElement } from 'office-ui-fabric-react/lib/Utilities';
import { SPService } from '../../../Service/SPService';
import { FunctionsService } from '../../../Service/FunctionsService';

export interface IPageNewsState {
  items: Array<any>;
  siteurl: string;
  firstNews: Array<any>;
  categorie?: IDropdownOption[];
  categoriaSelected: string;
  allNewsEnabled: boolean;
}

export default class PageNews extends React.Component<IPageNewsProps, IPageNewsState, {}> {
  private SPService: SPService = null;
  private FunctionsService: FunctionsService = null;
  constructor(props: IPageNewsProps) {
    super(props);
    this.SPService = new SPService(this.props.context);
    this.FunctionsService = new FunctionsService();
    this.state = {
      items: new Array<any>(),
      siteurl: this.props.context.pageContext.web.absoluteUrl,
      firstNews: new Array<any>(),
      categoriaSelected: "",
      allNewsEnabled: true,
    };

    this.getListNews(this.state.categoriaSelected, this.props.numberOfNews);
    this.getCategoria();
  }

  private async getListNews(categoria: string, numberOfNews: number) {
    let filter;
    let fields;
    if (this.props.listId !== "undefined" && this.props.listId.length > 0) {
      if (categoria != "" && categoria != null) {
        filter = `FirstPublishedDate ne null and Tipologia eq 'News' and  Categoria eq '${categoria}' `;
        fields = `FileDirRef,LinkFilename,FirstPublishedDate,Title,Categoria,BannerImageUrl,Description`;
      } else {
        filter = `FirstPublishedDate ne null and Tipologia eq 'News'`;
        fields = `FileDirRef,LinkFilename,FirstPublishedDate,Title,Categoria,BannerImageUrl,Description`;
      }
    }

    let listNews = this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined ?
      await this.SPService.GetListItemsWithParameter(this.props.listId, fields, filter, numberOfNews, "FirstPublishedDate", false)
      : await this.SPService.getViewRecentPages(this.props.context.pageContext.web.absoluteUrl + "/SitePages*");

    if (listNews.length > 0) {
      let itemMapping = listNews.map(e => ({
        Title: e.Title,
        BannerImageUrl: e.BannerImageUrl,
        Description: e.Description,
        Categoria: e.Categoria,
        FirstPublishedDate: e.FirstPublishedDate,
        Url: this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined ? e.FileDirRef + "/" + e.LinkFilename : e.Url
      }));

      this.setState({
        items: this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined ? itemMapping.slice(1) : itemMapping,
        firstNews: listNews[0]
      });

    }
  }

  private async getCategoria() {
    let filter;
    let fields;

    if (this.props.listId !== "undefined" && this.props.listId.length > 0) {
      filter = `FirstPublishedDate ne null and Tipologia eq 'News'`;
      fields = `Categoria`;
    }

    let listCategorie = await this.SPService.GetListItemsWithParameter(this.props.listId, fields, filter, 0, fields, true);
    listCategorie = listCategorie.map(item => item.Categoria).filter((value, index, self) => self.indexOf(value) === index);
    listCategorie = listCategorie.map<IDropdownOption>((v) => {
      return {
        key: v,
        text: v
      };
    });

    let result: any[] = [];
    result.push({ key: 'Vedi tutto', text: 'Vedi tutto' });
    listCategorie.forEach(e => {
      result.push({ key: e.key, text: e.text });
    });

    if (result.length > 0) {
      this.setState({ categorie: result });
    }
  }

  private _onChangeDropdown = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    this.setState({
      categoriaSelected: item.text,
      allNewsEnabled: true,
    });

    if (item.text == "Vedi tutto") {
      this.getListNews("", this.props.numberOfNews);
    } else {
      this.getListNews(item.text, this.props.numberOfNews);
    }
  }

  public componentDidUpdate(prevProps: IPageNewsProps): void {
    if (prevProps.listId !== this.props.listId || prevProps.numberOfNews !== this.props.numberOfNews || this.props.ViewForSingleNews !== prevProps.ViewForSingleNews) {
      this.getListNews(this.state.categoriaSelected, this.props.numberOfNews);
    }
  }

  public async componentDidMount() {
    if (!this.state.categorie) {
      this.getCategoria();
    }
  }

  private _onRenderGridItem = (item: any, isCompact: boolean): JSX.Element => {

    const subTitleClass = mergeStyles({
      height: 'auto',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 16,
      paddingRight: 16,
    });

    const tagClass = mergeStyles({
      color: "rgb(46, 99, 175)",
    });

    const classCategory = mergeStyles({
      color: "rgb(46, 99, 175)"
    });

    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined ?
            item.BannerImageUrl != null ? item.BannerImageUrl.Url : ""
            : item.BannerImageUrl,
          imageFit: ImageFit.cover,
          height: 130,
        }
      ]
    };

    const onClick = (e: React.MouseEvent) => {
      this.setState({ allNewsEnabled: false });
      this.getListNews(this.state.categoriaSelected, 0);
    };

    return <div
      data-is-focusable={true}
      role="listitem"
      aria-label={item.Title}>
      <DocumentCard
        type={DocumentCardType.normal}
      >
        <DocumentCardPreview {...previewProps} />

        <DocumentCardDetails>
          <div className={styles.containerNews}>
            <div className={styles.containerNewsFirstRow}>
              <p className={styles.categoryNews}>
                {(item.Categoria != null && item.Categoria != "undefined" && item.Categoria != "") && <DocumentCardTitle title={item.Categoria} />}
              </p>
              <p className={styles.dateNews}>
                {(item.FirstPublishedDate != null && item.FirstPublishedDate != "undefined" && item.FirstPublishedDate != "") && <DocumentCardTitle title={new Date(item.FirstPublishedDate).getDate() + "/" + (new Date(item.FirstPublishedDate).getMonth() + 1) + "/" + new Date(item.FirstPublishedDate).getFullYear()} />}
              </p>
              {/* <p className={(item.Tag != null && item.Tag != "undefined" && item.Tag != "" ? styles.tagNews : "")}>
                {(item.Tag != null && item.Tag != "undefined" && item.Tag != "") && <DocumentCardTitle title={item.Tag} />}
              </p> */}
            </div>
            <div className={styles.containerTitleNews}>
              <h3 className={styles.titleNews}>
                {(item.Title != null && item.Title != "undefined" && item.Title != "") && <DocumentCardTitle title={item.Title} />}
              </h3>
            </div>
            <div className={styles.containerShortDescription}>
              <p className={styles.shortDescription}>
                {(item.Description != null || item.Description != "undefined") &&
                  <DocumentCardTitle title={item.Description} className={subTitleClass} showAsSecondaryTitle />}
              </p>
            </div>
            <div className={styles.containerShowMore}>
              <DocumentCardLocation
                location="Leggi di più >"
                locationHref={item.Url}
                className={tagClass}
              />
            </div>
          </div>
        </DocumentCardDetails>

      </DocumentCard>
    </div>;
  }

  public render(): React.ReactElement<IPageNewsProps> {
    let link = "Leggi di più >";

    const onClick = (e: React.MouseEvent) => {
      this.setState({ allNewsEnabled: false });
      this.getListNews(this.state.categoriaSelected, 0);
    };

    const subTitleClass = mergeStyles({
      height: 'auto',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 16,
      paddingRight: 16,
    });

    const tagClass = mergeStyles({
      color: "rgb(46, 99, 175)",
    });

    return (
      <div className={styles.customMarginMobileNegative}>
        {/* div che comprende il filtro per Categorie dropdown */}
        {(this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined) &&
          <div className={styles.containerDropdownCategories}>
            <Dropdown
              label="Categorie"
              options={this.state.categorie}
              disabled={false}
              id={"DroDownCategorie"}
              required={false}
              onChange={this._onChangeDropdown}
            />
          </div>
        }
        {/* frammento di codice contenente la prima news in primo piano(la piu grande)*/}
        {(this.state.firstNews != null && this.state.firstNews != undefined && (this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined)) &&
          <div className={styles.containerBigNews}>
            <div className={styles.leftBigNews}>
              <div className={styles.containerCategoryDateBigNews}>
                <p className={styles.categoryBigNews}>
                  {this.state.firstNews["Categoria"] == null || this.state.firstNews["Categoria"] == undefined ? "" : this.state.firstNews["Categoria"]}
                </p>
                <p className={styles.dateBigNews}>
                  {this.state.firstNews["FirstPublishedDate"] == null || this.state.firstNews["FirstPublishedDate"] == undefined ? "" : new Date(this.state.firstNews["FirstPublishedDate"]).getDate() + "/" + (new Date(this.state.firstNews["FirstPublishedDate"]).getMonth() + 1) + "/" + new Date(this.state.firstNews["FirstPublishedDate"]).getFullYear()}
                </p>
              </div>
              <div className={styles.titleBigNews}>{this.state.firstNews["Title"] == null || this.state.firstNews["Title"] == undefined ? "" : this.state.firstNews["Title"]}</div>
              <div className={styles.containerShortDescriptionBigNews}>{this.state.firstNews["Description"] == null || this.state.firstNews["Description"] == undefined ? "" : this.state.firstNews["Description"]}</div>
              <div>
                <a className={styles.showMoreBigNews} href={this.state.firstNews["FileDirRef"] + "/" + this.state.firstNews["LinkFilename"]}>{link}</a>
              </div>
            </div>

            <div className={styles.rightBigNews}>
              <MediaQuery maxDeviceWidth={480} >
                <img src={this.state.firstNews["BannerImageUrl"] != null ? this.state.firstNews["BannerImageUrl"]["Url"] + "&resolution=1" : ""} />
              </MediaQuery>
              <MediaQuery minDeviceWidth={481}>
                <img src={this.state.firstNews["BannerImageUrl"] != null ? this.state.firstNews["BannerImageUrl"]["Url"] + "&resolution=3" : ""} />
              </MediaQuery>
            </div>

          </div>
        }

        <div className={styles.hrSeparatorNews}></div>
        {(this.props.ViewForSingleNews) && <div className={styles.titleArticle}>Articoli più letti</div>}
        <div className={styles.containerAllNews}>
          {/* <GridLayout
            ariaLabel="List of content, use right and left arrow keys to navigate, arrow down to access details."
            items={this.state.items}
            onRenderGridItem={(item: any, finalSize: ISize, isCompact: boolean) => this._onRenderGridItem(item, isCompact)}
          /> */}

          {/* lista di tutte le news di sotto */}
          {this.state.items.map(item => {
            return (
              <div
                data-is-focusable={true}
                role="listitem"
                aria-label={item.Title}
                className={styles.containerSingleNews}>
                <DocumentCard
                  type={DocumentCardType.normal}
                >
                  <DocumentCardPreview previewImages={[{
                    imageFit: ImageFit.cover, height: 130, previewImageSrc: this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined ?
                      item.BannerImageUrl != null ? item.BannerImageUrl.Url : "" : item.BannerImageUrl
                  }]} />

                  <DocumentCardDetails>
                    <div className={styles.containerNews}>
                      <div className={styles.containerNewsFirstRow}>
                        <p className={styles.categoryNews}>
                          {(item.Categoria != null && item.Categoria != "undefined" && item.Categoria != "") &&
                            <DocumentCardTitle title={item.Categoria} />}
                        </p>
                        <p className={styles.dateNews}>
                          {(item.FirstPublishedDate != null && item.FirstPublishedDate != "undefined" && item.FirstPublishedDate != "") &&
                            <DocumentCardTitle title={new Date(item.FirstPublishedDate).getDate() + "/" + (new Date(item.FirstPublishedDate).getMonth() + 1) + "/" + new Date(item.FirstPublishedDate).getFullYear()} />}
                        </p>
                      </div>
                      <div className={styles.containerTitleNews}>
                        <h3 className={styles.titleNews}>
                          <a className={styles.viewTitleNews}
                            href={item.Url}>
                            {(item.Title != null && item.Title != "undefined" && item.Title != "") && <DocumentCardTitle title={item.Title} />}
                          </a>
                        </h3>
                      </div>
                      {/* <div>
                        <p className={styles.dateNews}>
                          {(item.FirstPublishedDate != null && item.FirstPublishedDate != "undefined" && item.FirstPublishedDate != "") &&
                            <DocumentCardTitle title={new Date(item.FirstPublishedDate).getDate() + "/" + (new Date(item.FirstPublishedDate).getMonth() + 1) + "/" + new Date(item.FirstPublishedDate).getFullYear()} />}
                        </p>
                      </div> */}
                      <div className={styles.containerShortDescription}>
                        <p className={styles.shortDescription}>
                          {(item.Description != null || item.Description != "undefined") &&
                            <DocumentCardTitle title={item.Description}
                              className={subTitleClass}
                              showAsSecondaryTitle />}
                        </p>
                      </div>
                      <div className={styles.containerShowMore}>
                        <DocumentCardLocation
                          location="Leggi di più >"
                          locationHref={item.Url}
                          className={tagClass}
                        />
                      </div>
                    </div>
                  </DocumentCardDetails>
                </DocumentCard>
              </div>
            );
          })}
        </div>

        <div className={styles.hrSeparatorNews2}></div>
        <div>
          {(this.state.allNewsEnabled) && (this.props.ViewForSingleNews == false || this.props.ViewForSingleNews == undefined) &&
            <a className={styles.viewAllNews}

              onClick={onClick}>Vedi tutte le notizie</a>

          }{(this.props.ViewForSingleNews == true) &&
            <a className={styles.viewAllNews}

              href={this.props.context.pageContext.web.serverRelativeUrl + "/SitePages/News.aspx"}>
              Vedi tutte le notizie</a>
          }
        </div>
      </div>
    );
  }
}

