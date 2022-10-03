import * as React from 'react';
import styles from './BottonTop.module.scss';
import { IBottonTopProps } from './IBottonTopProps';
import { escape } from '@microsoft/sp-lodash-subset';
import styles2 from './BackToTop.module.scss';
import { Icon, IconButton } from 'office-ui-fabric-react';

export interface IBottonTopState {
  showGoToTop: boolean;
  absoluteUrl: string;
  imageTop: string;
}

export default class BottonTop extends React.Component<IBottonTopProps, IBottonTopState, {}> {

  private scrollContainer;
  private _scrollElement;

  constructor(props: IBottonTopProps) {

    super(props);

    this._scrollElement = document.querySelector('[data-automation-id="contentScrollRegion"]');

    this.state = {
      showGoToTop: false,
      absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
      imageTop: "/SiteAssets/ImagesHome/arrow-up.svg"
    };

    if (this._scrollElement) {
      this._scrollElement.onscroll = this._onScroll;
    }

  }

  // public render(): React.ReactElement<IBottonTopProps> {
  //   return (
  //     <div className={styles.bottonTop}>
  //       <div className={styles.container}>
  //         {this.state.showGoToTop && (
  //           <a href="#spPageCanvasContent" className={styles.goToTop}>
  //             <img src={this.state.absoluteUrl + this.state.imageTop}></img>
  //             <span>Torna Su</span>
  //           </a>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  public render(): JSX.Element {
    return (
      <React.Fragment>
        {this.state.showGoToTop && (
          <div className={styles2.backToTop}>
            <IconButton className={styles2.iconButton} onClick={this._goToTop} ariaLabel="Back to Top">
              <Icon iconName="Up" className={styles2.icon}></Icon>
              Torna Su
            </IconButton>
          </div>
        )}
      </React.Fragment>
    )
  }

  private _onScroll = () => {
    this.setState({
      showGoToTop: this._scrollElement.scrollTop > 300
    });

  };

  private _goToTop = () => {
    this._scrollElement.scrollTop = 0;
    setTimeout(() => {
      this._scrollElement.scrollTop = 0; // first scroll doesn't go to the very top.
    }, 50);
    this.setState({
      showGoToTop: false
    });
  };

  // public componentDidMount() {
  //   // await this.readItemListAPI();
  //   this.scrollContainer = document.querySelector('[data-automation-id="contentScrollRegion"]');

  //   if (this.scrollContainer.scrollHeight > window.innerHeight) {
  //     this.setState({ showGoToTop: true });
  //   }
  //   this.scrollContainer.addEventListener('scroll', () => {
  //     if (this.scrollContainer.scrollHeight > window.innerHeight) {
  //       if (!this.state.showGoToTop) {
  //         this.setState({
  //           showGoToTop: true
  //         }, function () {
  //           //this.moveFooter();
  //         });
  //       }
  //     }
  //   });

  //   // this.moveFooter();
  // }

  // public componentWillReceiveProps(nextProps: IbacktoTopProps) {
  //   if (this.props.currentUrl != nextProps.currentUrl) {
  //     this._scrollElement = undefined;
  //     if (!this._scrollElement) {
  //       this._scrollElement = document.body;
  //     }
  //     // Register the onscroll even handler
  //     if (this._scrollElement) {
  //       this._scrollElement.onscroll = this._onScroll;
  //     }
  //     this._onScroll();
  //   }
  // }

}