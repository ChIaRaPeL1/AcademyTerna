import * as React from 'react';
import styles from './Footer.module.scss';
import { IFooterProps } from './IFooterProps';
import { IFooterState } from './IFooterState';
import { sp, toAbsoluteUrl, Web } from "@pnp/sp/presets/all";
import { ContactNumber, Mailto } from 'FooterWebPartStrings';
import { SPService } from '../../../Service/SPService';

// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";

export default class Footer extends React.Component<IFooterProps, IFooterState> {
  private footer;
  private mailfooter;
  private contatcfooter;
  private scrollContainer;
  private SPService: SPService = null;

  //private web = Web(this.props.siteUrl);

  constructor(props: IFooterProps, state: IFooterState) {
    super(props);
    this.SPService = new SPService(this.props.context);
    this.GetFooterProperty();
    sp.setup({
      defaultCachingStore: "session",
      defaultCachingTimeoutSeconds: 900, //10min
      globalCacheDisable: false // true to disable caching in case of debugging/testing
    });
    let filter = `Section eq 'footer'`;
    this.state = {
      status: 'Ready',
      //items: [],
      showGoToTop: false,
      sitoCorporate: "https://www.terna.it/it",
      linkedin: "https://www.linkedin.com/company/terna/",
      instagram: "https://www.instagram.com/ternaspa/",
      facebook: "https://www.facebook.com/ternaspa",
      youtube: "https://www.youtube.com/user/ternaenergia",
      twitter: "https://twitter.com/ternaspa",
      mailto: "",
      contactNumber: "",
      ImageMail: "mail.svg",
      ImageTwitter: "twitter.svg",
      ImageFacebook: "facebook.svg",
      ImageInstagram: "instagram.svg",
      ImageLinkedin: "linkedin.svg",
      ImageTerna: "Terna.svg",
      ImagecontactNumber: "phone.svg",
      ImageYoutube: "youtube.svg",
      AbsoluteUrl: this.props.context.pageContext.web.absoluteUrl + '/ContenutiSezioniCustom/footer/'

    };

  }

  public returnMail() {
    return this.state.mailto;

  }
  public async GetFooterProperty() {
    let filter = `Section eq 'footer'`;
    const footerValues = await this.SPService.GetListItemsWithParameterByTitleList("ConfigList", "Title,Value", filter, 0, "Created", true);
    let footerMail, footerContactNumber;
    footerValues.forEach(element => {
      switch (element["Title"]) {
        case 'mail':
          footerMail = element["Value"];
          break;
        case 'contactnumber':
          footerContactNumber = element["Value"];
          break;
        default:
          break;
      }
      this.setState(
        {
          mailto: footerMail,
          contactNumber: footerContactNumber
        }
      );

    });
    this.moveFooter();


  }

  public render(): React.ReactElement<IFooterProps> {
    return (
      <div className={`${styles.ternaFooter}`} ref={(footer) => { this.footer = footer; }}>
        {/* <div className={styles.container}> */}
        <div className={`${styles['row-footer']} ${styles.customTernaFooter}`}>
          <div className={`${styles['wrapper-info-terna']} ${styles.logoFooterDesktop}`}>
            <a href={this.state.sitoCorporate} target="_blank">
              <img className={styles['img-terna']} src={this.state.AbsoluteUrl + this.state.ImageTerna.toLowerCase() + '?v=' + new Date().toISOString()} alt="Logo Terna" />
            </a>
          </div>

          <div className={styles.centerFooter}>
            <div className={styles.logoFooter}>
              <a href={this.state.sitoCorporate} target="_blank">
                <img className={styles['img-terna']} src={this.state.AbsoluteUrl + this.state.ImageTerna.toLowerCase() + '?v=' + new Date().toISOString()} alt="Logo Terna" />
              </a>
            </div>
            <a>
              <div className={styles['wrapper-mail']}>
                <a id='mail' /*className={styles['action-social']}*/ href={'mailto:' + this.state.mailto.toLowerCase()} target="_blank">
                  <img className={styles['img-mail']} src={this.state.AbsoluteUrl + this.state.ImageMail.toLowerCase() + '?v=' + new Date().toISOString()} alt="Mail" />
                  <span className={styles['action-social']}>{this.state.mailto}</span>
                </a>
              </div>
            </a>
            <a className={styles.centerFooterMail}>
              <div className={styles['wrapper-mail']}>
                <a href={this.state.contactNumber != undefined && this.state.contactNumber != "" && this.state.contactNumber.split(':').length > 1 ? 'tel:' + this.state.contactNumber.split(':')[1] : this.state.contactNumber}>
                  <img className={styles['img-mail']} src={this.state.AbsoluteUrl + this.state.ImagecontactNumber.toLowerCase() + '?v=' + new Date().toISOString()} alt="Mail" />
                  <span className={styles['action-social']}>{this.state.contactNumber != undefined && this.state.contactNumber != "" && this.state.contactNumber.split(':').length > 1 ? this.state.contactNumber.split(':')[0] : this.state.contactNumber}</span>
                </a>
              </div>
            </a>
          </div>

          <div className={`${styles['wrapper-social']} ${styles.dFlex} ${styles.socialIconCustom}`}>
            <a className={styles['action-social']} href={this.state.linkedin} target="_blank">
              <img src={this.state.AbsoluteUrl + this.state.ImageLinkedin.toLowerCase() + '?v=' + new Date().toISOString()} alt="Linkedin" />
            </a>
            <a className={styles['action-social']} href={this.state.instagram} target="_blank">
              <img src={this.state.AbsoluteUrl + this.state.ImageInstagram.toLowerCase() + '?v=' + new Date().toISOString()} alt="Instagram" />
            </a>
            <a className={`${styles['action-social']} ${styles.facebook}`} href={this.state.facebook.toLowerCase()} target="_blank">
              <img src={this.state.AbsoluteUrl + this.state.ImageFacebook.toLowerCase() + '?v=' + new Date().toISOString()} alt="Facebook" />
            </a>
            <a className={`${styles['action-social']} ${styles.youtube}`} href={this.state.youtube} target="_blank">
              <img src={this.state.AbsoluteUrl + this.state.ImageYoutube.toLowerCase() + '?v=' + new Date().toISOString()} alt="Youtube" />
            </a>
            <a className={`${styles['action-social']} ${styles.twitter}`} href={this.state.twitter} target="_blank">
              <img src={this.state.AbsoluteUrl + this.state.ImageTwitter.toLowerCase() + '?v=' + new Date().toISOString()} alt="Twitter" />
            </a>
          </div>
        </div>
        {/* </div> */}
      </div>
    );
  }

  private moveFooter(): void {
    const comments = document.querySelector('#CommentsWrapper');
    if (comments) {
      if (document.querySelector('#footer-clone')) {
        document.querySelector('#footer-clone').remove();
      }
      const footerCopy = this.footer.cloneNode(true);
      footerCopy.setAttribute('id', 'footer-clone');
      footerCopy.style.display = 'block';
      comments.insertAdjacentElement('afterend', footerCopy);
      this.footer.style.display = 'none';
    }


  }

  public async componentDidMount(): Promise<void> {
    this.GetFooterProperty();
    this.scrollContainer = document.querySelector('[data-automation-id="contentScrollRegion"]');

    if (this.scrollContainer.scrollHeight > window.innerHeight) {
      this.setState({
        showGoToTop: true,
      });


    }
    this.scrollContainer.addEventListener('scroll', () => {
      if (this.scrollContainer.scrollHeight > window.innerHeight) {
        if (!this.state.showGoToTop) {
          this.setState({
            showGoToTop: true,
          }, function () {
            //this.moveFooter();
          });
        }
      }
    });

    //this.moveFooter();
  }

}