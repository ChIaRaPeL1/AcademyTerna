import * as React from 'react';
import styles from './SectionBox.module.scss';
import { ISectionBoxProps } from './ISectionBoxProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPService } from '../../../Service/SPService';
import { FunctionsService } from '../../../Service/FunctionsService';

export interface ISectionBoxState {
  items?: Array<any>;
  listItems: any[];
  isResponsabile: boolean;
  errorMessage: string;
  absoluteUrl: string;
  imageFaculty: string;
  imageRituals: string;
  imageIconBlue: string;
  imageIconWhite: string;
  userCorrente: string;
}

export default class SectionBox extends React.Component<ISectionBoxProps, ISectionBoxState, {}> {

  private SPService: SPService = null;
  private FunctionsService: FunctionsService = null;

  constructor(props: ISectionBoxProps) {

    super(props);
    this.SPService = new SPService(this.props.context);
    this.FunctionsService = new FunctionsService();
    this.getResponsabili = this.getResponsabili.bind(this);

    this.state = {
      items: new Array<any>(),
      listItems: [],
      errorMessage: '',
      absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
      imageFaculty: "/ContenutiSezioniCustom/Faculty/Faculty.png",
      imageRituals: "/ContenutiSezioniCustom/Rituals/Rituals.png",
      imageIconBlue: "/SiteAssets/ImagesHome/Vector.png",
      imageIconWhite: "/SiteAssets/ImagesHome/Vector1.png",
      userCorrente: this.props.context.pageContext.user.email,
      isResponsabile: false,
    };
  }

  public componentDidMount() {
    this.getResponsabili();
  }

  public async getResponsabili() {

    let filter = `LinkTitle eq '${this.state.userCorrente}'`;
    let fields = 'LinkTitle';

    const responsabile = await this.SPService.getListItem(fields, filter, this.props.listGuidID);

    this.setState({ isResponsabile: responsabile.length == 0 ? false : true });

  }

  public render(): React.ReactElement<ISectionBoxProps> {
    return (
      <div className={styles.sectionBox}>
        {/* <div className={styles.container}> */}
        <div className={styles.row}>
          {(this.state.isResponsabile == true) &&
            <div className={styles.column}>
              <div className={styles.columnDirigenti}>
                <span className={styles.title}>Richieste formative specifiche</span>
                <p className={styles.description}>Richiedi un corso di formazione per il tuo team</p>
                <a href={this.state.absoluteUrl + "/Lists/Richiesta%20Corsi/NewForm.aspx"}
                  className={styles.spec}>
                  <span className={styles.labelspec}>Compila modulo RFS <img className={styles.imageIcon} src={this.state.absoluteUrl + this.state.imageIconBlue}></img></span>
                </a>
              </div>
            </div>
          }
          <div className={styles.column}>
            <div className={styles.columnDipendenti}>
              <span className={styles.title}>Non smettere mai di imparare</span>
              <p className={styles.description}>C'è qualcosa che vorresti imparare ma non lo trovi nell'offerta? Condividilo!</p>
              <a href="https://forms.office.com/Pages/DesignPage.aspx?fragment=FormId%3DTnPN7CJwCUerpaXdd5KeJxn4FEnhbmVCg5onmj-O8JdURFM2VDFFRzlIS0w1QVlSSzhXNUY1TFBLMC4u"
                className={styles.spec}>
                <span className={styles.labelspec}>Compila Survey <img className={styles.imageIcon} src={this.state.absoluteUrl + this.state.imageIconBlue}></img></span>
              </a>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.Faculty} style={{ backgroundImage: `url(${this.state.absoluteUrl + this.state.imageFaculty})` }}>
              <span className={styles.title}>Faculty</span>
              <p className={styles.description}>Scopri tutti i docenti di Terna Academy</p>
              <a href={this.state.absoluteUrl + "/SitePages/Faculty.aspx"} className={styles.button}>
                <span className={styles.labelFaculty}>Contatta i colleghi</span>
              </a>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.Rituals} style={{ backgroundImage: `url(${this.state.absoluteUrl + this.state.imageRituals})` }}>
              <span className={styles.title}>Terna Rituals</span>
              <p className={styles.description}>Sfoglia la repository dei rituali Terna</p>
              <a href="https://ternaspa.sharepoint.com/sites/Ritualileadership" className={styles.button}>
                <span className={styles.label}>Cerca Rituali <img className={styles.imageIcon} src={this.state.absoluteUrl + this.state.imageIconWhite}></img> </span>
              </a>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    );
  }
}
