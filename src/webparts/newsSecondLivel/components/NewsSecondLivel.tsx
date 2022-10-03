import * as React from 'react';
import styles from './NewsSecondLivel.module.scss';
import { INewsSecondLivelProps } from './INewsSecondLivelProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPService } from '../../../Service/SPService';
import { FunctionsService } from '../../../Service/FunctionsService';
import MediaQuery from 'react-responsive';


export interface INewsSecondLivelState {
  items?: Array<any>;
  filterItems?: Array<any>;
  listItems: any[];
  errorMessage: string;
  absoluteUrl: string;
}


export default class NewsSecondLivel extends React.Component<INewsSecondLivelProps, INewsSecondLivelState, {}> {

  private SPService: SPService = null;
  private FunctionsService: FunctionsService = null;

  constructor(props: INewsSecondLivelProps) {

    super(props);
    this.SPService = new SPService(this.props.context);
    this.FunctionsService = new FunctionsService();


    this.state = {
      items: new Array<any>(),
      filterItems: new Array<any>(),
      listItems: [],
      errorMessage: '',
      absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
    };

  }

  public async getSecondLevelNews() {
    let selectBy = "FileDirRef,LinkFilename,Title,BannerImageUrl,FirstPublishedDate,Categoria, ID";
    let filterBy = "FirstPublishedDate ne null and Rilevanza eq 'Secondo piano' and Tipologia eq 'News'";
    let orderBy = "FirstPublishedDate";


    let newsView = null;

    if (window.innerWidth >= 1024) {
      newsView = await this.SPService.getListItemsNum(selectBy, filterBy, "", orderBy, this.props.numberOfNews, this.props.listGuidID);
    } else {
      newsView = await this.SPService.getListItemsNum(selectBy, filterBy, "", orderBy, 2, this.props.listGuidID);
    }

    const newsItems = newsView;


    let fields = `FileRef,FileLeafRef,ID,FileDirRef,LinkFilename,IDPage`;
    //const imgNews = await this.SPService.GetListImages(this.props.IDDocumentLibraryImages, fields, filter);

    if (newsItems.length > 0) {
      let newsItemsMapping = newsItems.map(e => ({
        title: e.Title ? e.Title : "",
        url: e.FileDirRef + "/" + e.LinkFilename,
      }));


      this.setState({ listItems: newsItemsMapping });
    }
  }

  public componentDidMount() {
    this.getSecondLevelNews();
  }

  public componentDidUpdate(prevProps: INewsSecondLivelProps): void {
    this.getSecondLevelNews();
  }

  public render(): React.ReactElement<INewsSecondLivelProps> {
    return (
      <div>
        <MediaQuery minDeviceWidth={1024}>
          <div className={styles.newsSecondLivel}>
            <div className={styles.container}>
              <div className={styles.row}>
                {/* "https://ternaspa.sharepoint.com/sites/rfstest/SitePages/News.aspx?source=https%3A%2F%2Fternaspa.sharepoint.com%2Fsites%2Frfstest%2FSitePages%2FForms%2FByAuthor.aspx" */}
                <a href={this.state.absoluteUrl + "/SitePages/News.aspx"}
                  className={styles.button}>
                  Vedi tutte le news
                </a>
                <div className={styles.column}>

                  {this.state.listItems.map((item, index) => {
                    return (
                      <div className={styles.detail}>
                        <p className={styles.newsItem}>
                          {item.title}
                        </p>
                        <a href={item.url} className={styles.link}>Continua</a>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minDeviceWidth={0} maxDeviceWidth={1023}>
          <div className={styles.newsSecondLivel}>
            <div className={styles.container}>
              <div className={styles.row}>
                <div className={styles.column}>

                  {this.state.listItems.map((item, index) => {
                    return (
                      <div className={styles.detail}>
                        <p className={styles.newsItem}>
                          {item.title}
                        </p>
                        <a href={item.url} className={styles.link}>Continua</a>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.buttonMobile}>
                  <a className={styles.linkButtonMobile}
                    href={this.state.absoluteUrl + "/SitePages/News.aspx"}>
                    Visualizza tutte le news
                  </a>
                </div>
              </div>
            </div>
          </div>
        </MediaQuery>
      </div>
    );
  }
}
