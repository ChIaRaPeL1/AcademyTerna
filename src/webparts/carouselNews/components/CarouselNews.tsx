import * as React from 'react';
import styles from './CarouselNews.module.scss';
import { ICarouselNewsProps } from './ICarouselNewsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext, Dot, Image, DotGroup } from 'pure-react-carousel';
import { ImageFit } from 'office-ui-fabric-react';
import { SPService } from '../../../Service/SPService';
import { FunctionsService } from '../../../Service/FunctionsService';

export interface ICarouselNewsState {
  items?: Array<any>;
  filterItems?: Array<any>;
  listItems: any[];
  errorMessage: string;
}

export default class CarouselNews extends React.Component<ICarouselNewsProps, ICarouselNewsState, {}> {

  private SPService: SPService = null;
  private FunctionsService: FunctionsService = null;

  constructor(props: ICarouselNewsProps) {

    super(props);
    this.SPService = new SPService(this.props.context);
    this.FunctionsService = new FunctionsService();
    this.getCarouselItems = this.getCarouselItems.bind(this);

    this.state = {
      items: new Array<any>(),
      filterItems: new Array<any>(),
      listItems: [],
      errorMessage: '',
    };

  }

  public async getCarouselItems() {

    let selectBy = "FileDirRef,LinkFilename,Title,BannerImageUrl,FirstPublishedDate,Categoria, ID";
    let filterBy = "FirstPublishedDate ne null and Rilevanza eq 'Primo piano' and Tipologia eq 'News'";
    let orderBy = "FirstPublishedDate";

    const carouselItems = await this.SPService.getListItemsNum(selectBy, filterBy, "", orderBy, this.props.numberOfSlider, this.props.listGuidID);

    let condition = window.innerWidth >= 1024 ? "desktop" : window.innerWidth >= 768 ? "tablet" : "mobile";

    let filter = "";

    //modifica 
    if (carouselItems.length >= 1) {
      for (let index = 0; index < carouselItems.length; index++) {
        if (index <= carouselItems.length-1) {
          filter += `IDPage eq ` + carouselItems[index]["ID"] + ` and startswith(FileLeafRef,'` + condition + `') or `;
        } 
        
      }
    }

    let newFilter = filter.substring(0,filter.length - 4);
    let fields = `FileRef,FileLeafRef,ID,FileDirRef,LinkFilename,IDPage`;
    const imgNews = await this.SPService.GetListImages(this.props.IDDocumentLibraryImages, fields, newFilter);
  

    if (carouselItems.length > 0) {
      let carouselItemsMapping = carouselItems.map(e => ({
        imageSrc: e.BannerImageUrl.Url + "&resolution=" + this.FunctionsService.GetResolution(window.innerWidth),
        title: e.Title ? e.Title : "",
        showDetailsOnHover: true,
        url: e.FileDirRef + "/" + e.LinkFilename,
        imageFit: ImageFit.cover,
        ID: e.ID,
        img: new Array<any>()
      }));

      for (let i = 0; i < carouselItemsMapping.length; i++) {

        let id = carouselItemsMapping[i]["ID"];

        if (imgNews.length > 0) {

          for (let index = 0; index < imgNews.length; index++) {
            let idimg = imgNews[index]["IDPage"];
            if (id == idimg) {
              carouselItemsMapping[i].img.push(imgNews[index]["FileRef"]);
            }
          }

          if (carouselItemsMapping[i].img.length <= 0) {
            carouselItemsMapping[i].img.push(carouselItemsMapping[i].imageSrc);
          }

        }
        else {
          carouselItemsMapping[i].img.push(carouselItemsMapping[i].imageSrc);
        }
      }
      this.setState({ listItems: carouselItemsMapping });
    }
  }

  public componentDidMount() {
    this.getCarouselItems();
  }

  public componentDidUpdate(prevProps: ICarouselNewsProps): void {
    if (prevProps.numberOfSlider !== this.props.numberOfSlider || prevProps.listGuidID !== this.props.listGuidID) {
      this.setState({ listItems: [] });
      this.getCarouselItems();
    }
  }

  public render(): React.ReactElement<ICarouselNewsProps> {

    return (
      <div className={styles.containerCarousel}>
        <div className={styles.pnpImageCarousel}>

          {(this.state.listItems != null && this.state.listItems != undefined && this.state.listItems.length > 0) &&
            <CarouselProvider
              className={styles.carouselCustomSize}
              naturalSlideWidth={90}
              naturalSlideHeight={90}
              totalSlides={this.state.listItems.length}
              infinite={true}
              currentSlide={0}
              dragStep={1}
              dragEnabled={true}
              //playDirection={'forward'}
              isPlaying={true}
              step={1}
              lockOnWindowScroll={true}
              orientation={'horizontal'}
              touchEnabled={true}>

              <Slider className="slider">
                {this.state.listItems.map((item, index) => {

                  const _onClickImgCarousel = (e: React.MouseEvent) => {
                    window.location.href = item.url;
                  };

                  return (
                    <Slide index={index} >
                      <div className="details" >
                        <a className="titleNews" href={item.url}>{item.title}</a>
                      </div>
                      <Image className={styles.imgCarouselHome} isBgImage={true} hasMasterSpinner={true} src={item.img[0]} />
                      {/* <Image className={styles.imgCarouselHome} isBgImage={true} hasMasterSpinner={true} src={item.imageSrc} /> */}
                    </Slide>
                  );

                })}
              </Slider>

              <DotGroup dotNumbers />
            </CarouselProvider>
          }
        </div>
      </div>
    );
  }
}