import * as React from 'react';
import styles from './Faculty.module.scss';
import { IFacultyProps } from './IFacultyProps';
import { DetailsList, DetailsListLayoutMode, DetailsRow, DetailsRowFields, DocumentCard, DocumentCardDetails, DocumentCardLocation, DocumentCardPreview, Dropdown, ComboBox, IComboBox, IComboBoxOption, IColumn, Icon, IDetailsListProps, IDetailsRowFieldsProps, IDetailsRowProps, IDetailsRowStyles, IDropdownOption, List, Persona, PersonaSize, SelectionMode, TextField } from 'office-ui-fabric-react';
import { SPService } from '../../../Service/SPService';
import { FunctionsService } from '../../../Service/FunctionsService';
import { IPersonaProps } from '@fluentui/react/lib/Persona';
import MediaQuery from 'react-responsive';
import Pagination from 'office-ui-fabric-react-pagination';
import { Accordion } from '../../../Service/controls/accordion';
import { values } from 'lodash';
export interface IFacultyState {
  items: Array<any>;
  siteurl: string;
  emailImage: string;
  listItems: any[];
  listItemsComplete: any[];
  filterPerson: boolean;
  filterRuolo: boolean;
  filterSpec: boolean;
  people?: IDropdownOption[];
  personSelected: string;
  roles?: IDropdownOption[];
  roleSelected: string;
  specializations?: IDropdownOption[];
  specializationSelected: string[];
  specializationSelectedKey: string[];
  columns: IColumn[];
  itemsPaged: any[];
  totalPages: number;
  currentPage: number;
  listColor: any[];
  absoluteUrl: string;
}

export default class Faculty extends React.Component<IFacultyProps, IFacultyState, {}> {
  private SPService: SPService = null;
  private FunctionsService: FunctionsService = null;

  public itemsPerPage = 10;

  constructor(props: IFacultyProps) {
    super(props);

    this.SPService = new SPService(this.props.context);
    this.FunctionsService = new FunctionsService();

    const _columns: IColumn[] = [ //Colonne della DetailList
      {
        key: 'docentiColumn',
        name: 'Docenti',
        fieldName: 'Docenti',
        minWidth: 100,
        maxWidth: 250,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'any',
        isPadded: true
      },
      {
        key: 'ruoloColumn',
        name: 'Ruolo',
        fieldName: 'Ruolo',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        isPadded: true
      },
      {
        key: 'specializzazioniColumn',
        name: 'Specializzazioni',
        fieldName: 'Specializzazioni',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        data: 'string',
        isPadded: true,
        isMultiline: true
      }
    ];
    this.state = {
      items: new Array<any>(),
      siteurl: this.props.context.pageContext.web.absoluteUrl,
      emailImage: '',
      listItems: [],
      listItemsComplete: [],
      filterPerson: false,
      filterRuolo: false,
      filterSpec: false,
      roleSelected: "",
      personSelected: "",
      specializationSelected: [],
      specializationSelectedKey: [],
      columns: _columns,
      itemsPaged: [],
      totalPages: 0,
      currentPage: 1,
      listColor: [],
      absoluteUrl: this.props.context.pageContext.web.absoluteUrl,
    };

    this.getFacultyList();
    this.getRoles();
    this.getSpecializations();
  }

  private async getRoles() {
    let filter;
    let fields;
    if (this.props.listRole !== "undefined" && this.props.listRole.length > 0) {
      filter = `Title ne null`;
      fields = `Title`;
    }

    let listRoles = await this.SPService.GetListItemsWithParameter(this.props.listRole, fields, filter, 5000, fields, true);
    listRoles = listRoles.sort((a, b) => a.Title.localeCompare(b.Title));
    listRoles = listRoles.map(item => item.Title).filter((value, index, self) => self.indexOf(value) === index);
    listRoles = listRoles.map<IDropdownOption>((v) => {
      return {
        key: v,
        text: v
      };
    });

    let result: any[] = [];
    result.push({ key: 'Vedi tutto', text: 'Vedi tutto' });
    listRoles.forEach(e => {
      result.push({ key: e.key, text: e.text, enable: true });
    });

    if (result.length > 0) {
      this.setState({ roles: result });
    }
  }

  private async getSpecializationsColors() {
    let filter;
    let fields;
    if (this.props.listSpecialization !== "undefined" && this.props.listSpecialization.length > 0) {
      filter = `Title ne null`;
      fields = `Title, CategoriaCodColore`;
    }
    let listSpecializationColor = await this.SPService.GetListItemsWithParameter(this.props.listSpecialization, fields, filter, 0, fields, true);
    listSpecializationColor = listSpecializationColor.map(e => ({
      title: e.Title ? e.Title : "",
      categoria: e.CategoriaCodColore.split('|')[0],
      colore: e.CategoriaCodColore.split('|')[1],
    }));

    if (listSpecializationColor.length > 0) {
      this.setState({ listColor: listSpecializationColor });
    }
  }

  public componentWillMount() {
    this.getSpecializationsColors;
    this.getSpecializations;
  }

  private async getSpecializations() {
    let filter;
    let fields;
    if (this.props.listSpecialization !== "undefined" && this.props.listSpecialization.length > 0) {
      filter = `Title ne null`;
      fields = `Title, CategoriaCodColore`;
    }
    let listSpecialization = await this.SPService.GetListItemsWithParameter(this.props.listSpecialization, fields, filter, 0, "Title", true);
    let listSpecializationColor = listSpecialization.map(e => ({
      title: e.Title ? e.Title : "",
      categoria: e.CategoriaCodColore.split('|')[0],
      colore: e.CategoriaCodColore.split('|')[1],
    }));
    //listSpecialization = listSpecialization.sort((a, b) => a.title.localeCompare(b.title));
    listSpecialization = listSpecialization.map(item => item.Title).filter((value, index, self) => self.indexOf(value) === index);
    listSpecialization = listSpecialization.map<IDropdownOption>((v) => {
      return {
        key: v,
        text: v,
        enable: true,
      };
    });
    let result: any[] = [];
    result.push({ key: 'Vedi tutto', text: 'Vedi tutto', selected: true });
    listSpecialization.forEach(e => {
      result.push({ key: e.key, text: e.text, selected: e.selected });
    });
    let listSpecializationKey = result.map<string>((v) => {
      return v.key;
    });
    if (result.length > 0) {
      this.setState({ specializations: result, specializationSelectedKey: [], listColor: listSpecializationColor });

    }
  }

  private async getFacultyList() {
    let filter;
    let fields;
    let expand;
    if (this.props.listId !== "undefined" && this.props.listId.length > 0) {
      filter = `Docenti ne null`;
      fields = `Docenti/Id,Docenti/EMail,Docenti/Title,Ruolo,Email,Specializzazioni`;
      expand = 'Docenti/Id,Docenti/EMail,Docenti/Title';
    }

    let listFaculty = await this.SPService.getListItems(fields, filter, expand, 'Docenti/Title', this.props.listId, true);

    if (listFaculty.length > 0) {
      let itemMapping = listFaculty
        .sort((a, b) => a.Docenti.Title.localeCompare(b.Docenti.Title))
        .map(e => ({
          person: {
            imageUrl: '/_layouts/15/userphoto.aspx?size=S&username=' + e.Docenti.EMail,
            Name: e.Docenti.Title,
            Email: e.Docenti.EMail,
            IconEmail: this.state.siteurl + this.state.emailImage //URL icona email
          },
          Ruolo: e.Ruolo ? e.Ruolo : "",
          Specializzazioni: e.Specializzazioni ? e.Specializzazioni : "",
        }));

      this.setState({ listItemsComplete: itemMapping });
      this.setState({ listItems: itemMapping });
      this.setState({ totalPages: Math.ceil(itemMapping.length / this.itemsPerPage) });
      this.goToPage(1, itemMapping);
    }
  }

  private renderItemColumn = (item: any, index: number, column: IColumn): JSX.Element => {
    const fieldContent = item[column.fieldName as keyof any] as string;
    var specialization: [any] = item.Specializzazioni;
    var colori: any = [];

    const _onRenderSecondaryText = (props: IPersonaProps): JSX.Element => {
      let mail = "mailto:";
      let address = mail + item.person.Email;
      return (
        <div className={styles.email}>
          <img src={this.state.absoluteUrl + '/SiteAssets/ImagesHome/Email.svg'} />
          &nbsp;
          <a href={address}> {item.person.Email}</a>
          {props.secondaryText}
        </div>
      );
    };

    switch (column.key) {
      case 'docentiColumn':
        return (
          <div className={styles.description}>
            <Persona
              imageUrl={item.person.imageUrl}
              text={item.person.Name}
              onRenderSecondaryText={_onRenderSecondaryText}
              size={PersonaSize.size40}
            />
          </div>
        );
        break;
      case 'specializzazioniColumn':
        if (specialization.length > 0) {
          let result = [];

          specialization.forEach(itemSpec => {
            const propSpec = this.state.listColor.filter(f => f.title == itemSpec)[0];

            if (propSpec) {
              result.push(
                <div className={styles.specialization} style={{ backgroundColor: propSpec.colore, borderColor: propSpec.colore }}>
                  <span data-selection-disabled={true} className={styles.specializationText}>
                    {itemSpec}
                  </span>
                </div>
              );
            }
          });

          return (<div>{result}</div>);

        }
        else
          return (<div ><span ></span></div>);

        break;
      default:
        return <span className={styles.roleText} > {fieldContent}</span>;
    }
  }

  public render(): React.ReactElement<IFacultyProps> {
    return (
      <div>
        <MediaQuery minDeviceWidth={1024}>
          <div className={styles.container}>
            <div className={styles.filterContainer}>
              <div className={styles.containerDropdownPerson}>
                <TextField
                  label="Ricerca membro della faculty"
                  disabled={false}
                  id={"TextFaculty"}
                  required={false}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
              <div className={styles.containerDropdownRole}>
                <ComboBox
                  label="Struttura"
                  options={this.state.roles}
                  disabled={false}
                  id={"ComboBoxRuoli"}
                  required={false}
                  onChange={this._onChangeComboBoxRole}
                  autoComplete={'on'}
                />
              </div>
              <div className={styles.containerDropdownSpecialization}>
                <Dropdown
                  label="Specializzazioni"
                  options={this.state.specializations}
                  disabled={false}
                  id={"DropDownSpecializzazioni"}
                  required={false}
                  onChange={this._onChangeDropdownSpecialization}
                  multiSelect={true}
                  selectedKeys={this.state.specializationSelectedKey}
                />
              </div>
            </div>
            <DetailsList
              //items={this.state.listItems}
              items={this.state.itemsPaged}
              setKey="set"
              columns={this.state.columns}
              onRenderItemColumn={this.renderItemColumn}
              ariaLabelForSelectionColumn="Toggle selection"
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              checkButtonAriaLabel="Row checkbox"
              styles={this.getStylesDetailListContainer}
              onRenderRow={this.onRenderColumnListRow}
              isHeaderVisible={false}
              selectionMode={SelectionMode.none}
            />
            <div className={styles.paginazione}>
              <div>
                {this.state.currentPage} - {this.state.totalPages} of {this.state.listItems.length}
              </div>
              <Pagination
                currentPage={this.state.currentPage}
                totalPages={this.state.totalPages ? this.state.totalPages : 1}
                hideEllipsis={false}
                hideFirstAndLastPageLinks={false}
                format

                onChange={(page) => {
                  if (this.state.listItems.length == 0) { this.goToPage(page, this.state.listItems); }
                  else { this.goToPage(page, this.state.listItems); }
                }}
              />
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minDeviceWidth={0} maxDeviceWidth={1023}>
          <div className={styles.container}>
            <div>
              <div>
                <TextField
                  label="Ricerca membro della faculty"
                  disabled={false}
                  id={"TextFaculty"}
                  required={false}
                  onChange={this._handleChange.bind(this)}
                />
              </div>
              <div>
                <ComboBox
                  label="Ruolo"
                  options={this.state.roles}
                  disabled={false}
                  id={"ComboBoxRuoli"}
                  required={false}
                  onChange={this._onChangeComboBoxRole}
                  autoComplete={'on'}
                />
              </div>
              <div>
                <Dropdown
                  label="Specializzazioni"
                  options={this.state.specializations}
                  disabled={false}
                  id={"DropDownSpecializzazioni"}
                  required={false}
                  onChange={this._onChangeDropdownSpecialization}
                  multiSelect={true}
                  selectedKeys={this.state.specializationSelectedKey}
                />
              </div>
            </div>
            {this.state.itemsPaged.map((item, index) => {
              let mail = "mailto:";
              let address = mail + item.person.Email;
              return (
                <DocumentCard className={styles.documentCardContainer}>
                  <DocumentCardDetails className={styles.documentCardContent}>
                    <div>
                      <Persona
                        imageUrl={item.person.imageUrl}
                        text={item.person.Name}
                        secondaryText={item.Ruolo}
                        size={PersonaSize.size40}
                      />
                    </div>
                    <div className={styles.emailMobile}>
                      {/* <img src='https://ternaspa.sharepoint.com/sites/rfstest/SiteAssets/ImagesHome/Email.svg' /> */}
                      <img src={this.state.absoluteUrl + '/SiteAssets/ImagesHome/Email.svg'} />
                      &nbsp;
                      <a href={address}> {item.person.Email}</a>
                    </div>
                    <div>
                      {(item.Specializzazioni != "") &&
                        <Accordion title="Vedi Specializzazioni" key={index}>
                          {item.Specializzazioni.map(itemSpec => {
                            return this.state.listColor.map(c => {
                              if (c.title == itemSpec) {
                                return (
                                  <div className={styles.specialization} style={{ backgroundColor: c.colore, borderColor: c.colore }}>
                                    <span data-selection-disabled={true} className={styles.specializationText}>
                                      {itemSpec}
                                    </span>
                                  </div>
                                );
                              }

                            });
                          })
                          }
                        </Accordion>
                      }
                    </div>
                  </DocumentCardDetails>
                </DocumentCard>
              );
            })}
            <div className={styles.paginazione}>
              <Pagination
                currentPage={this.state.currentPage}
                totalPages={this.state.totalPages ? this.state.totalPages : 1}
                hideEllipsis={false}
                hideFirstAndLastPageLinks={false}
                format
                onChange={(page) => {
                  if (this.state.listItems.length == 0) { this.goToPage(page, this.state.listItems); }
                  else { this.goToPage(page, this.state.listItems); }
                }}
              />
            </div>
          </div>
        </MediaQuery>
      </div >
    );
  }

  private goToPage(page: number, items: any[]) {
    if (page == 1) {
      this.setState({
        itemsPaged: items.slice(0, (page * this.itemsPerPage)),
        totalPages: Math.ceil(items.length / this.itemsPerPage)
      });
    }
    else {
      this.setState({
        itemsPaged: items.slice(((page - 1) * this.itemsPerPage), (page * this.itemsPerPage)),
        totalPages: Math.ceil(items.length / this.itemsPerPage)
      });
    }
    this.setState({ currentPage: page });
  }

  private getStylesDetailListContainer = () => {
    return {
      root: {
        display: 'inline-block',
        marginTop: '40px'
      }
    };
  };

  private onRenderColumnListRow: IDetailsListProps['onRenderRow'] = (props) => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {
      customStyles.root = { border: '1px solid #DDDDDD', borderRadius: '5px', margin: '4px 4px 20px 4px' };
      return <DetailsRow {...props} rowFieldsAs={this.renderRowFields} styles={customStyles} />;
    }
    return null;
  }

  private renderRowFields(props: IDetailsRowFieldsProps) {
    return (
      <span data-selection-disabled={true}>
        <DetailsRowFields {...props} />
      </span>
    );
  }

  private filterDetailList(value: any, type: string) {

    //Filter for Search box with minimun three letter
    let filterList = this.state.listItemsComplete;
    if (type == "searchuser")
      filterList = (value != null && value != "") && value.length >= 3
        ? filterList.filter((item) => item.person.Name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        : filterList;
    else
      filterList = (this.state.personSelected != null && this.state.personSelected != "") && this.state.personSelected.length >= 3
        ? filterList.filter((item) =>
          item.person.Name.toLowerCase().indexOf(this.state.personSelected.toLowerCase()) !== -1)
        : filterList;
    //filter select box
    if (type == "role")
      filterList = value != null && value != "" && value != "Vedi tutto"
        ? filterList.filter((item) =>
          item.Ruolo.toLowerCase().indexOf(value.toLowerCase()) !== -1)
        : filterList;
    else
      filterList = this.state.roleSelected != null && this.state.roleSelected != "" && this.state.roleSelected != "Vedi tutto"
        ? filterList.filter((item) =>
          item.Ruolo.toLowerCase().indexOf(this.state.roleSelected.toLowerCase()) !== -1)
        : filterList;
    //filter specialization
    if (type == "specializationFilter" && value.indexOf("Vedi tutto") == -1 && value.length > 0) {
      filterList = filterList.filter((itemA) => {
        return value.find((itemB) => {
          return itemA.Specializzazioni.indexOf(itemB) != -1;
        });
      });
    } else if (this.state.specializationSelectedKey.length > 1 && value.indexOf("Vedi tutto") == -1) {
      let filterAny: any = this.state.specializationSelectedKey;
      filterList = filterList.filter((itemA) => {
        return filterAny.find((itemB) => {
          return itemA.Specializzazioni.indexOf(itemB) != -1;
        });
      });
    }

    this.setState({ listItems: filterList });
    this.goToPage(1, filterList);
  }

  private _handleChange(event) {
    this.setState({ personSelected: event.target.value });
    this.filterDetailList(event.target.value, 'searchuser');
  }

  private _onChangeComboBoxRole = (event: React.FormEvent<IComboBox>, item: IComboBoxOption): void => {
    this.setState({ roleSelected: item.text == "Vedi tutto" ? "" : item.text });
    this.filterDetailList(item.text, "role");
  }

  private _onChangeDropdownSpecialization = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    let listSpecialization: any[] = [];
    let listSpecializationKey: any[] = [];
    if (item.text == "Vedi tutto" && item.selected == true) {
      listSpecialization = this.state.specializations.map<IDropdownOption>((v) => {
        return {
          key: v.key,
          text: v.text,
          selected: true
        };
      });
      listSpecializationKey = listSpecialization.map<any>(item => {
        return item.key;
      });
      this.setState({ specializationSelectedKey: listSpecializationKey, specializations: listSpecialization });
    } else if (item.text == "Vedi tutto" && item.selected == false) {
      listSpecialization = this.state.specializations.map<IDropdownOption>((v) => {
        return {
          key: v.key,
          text: v.text,
          selected: false
        };
      });
      this.setState({ specializationSelectedKey: [], specializations: listSpecialization });

    } else {
      listSpecialization = this.state.specializations.map<IDropdownOption>((v) => {
        return {
          key: v.key,
          text: v.text,
          selected: v.key == item.text ? item.selected : v.key == "Vedi tutto" ? false : v.selected
        };
      });
      let filter = listSpecialization.filter(item => item.selected == true);
      listSpecializationKey = filter.map<any>(item => {
        return item.key;
      });
      this.setState({ specializationSelectedKey: listSpecializationKey, specializations: listSpecialization });

    }
    this.filterDetailList(listSpecializationKey, 'specializationFilter');
  }

}