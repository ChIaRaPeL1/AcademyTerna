import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'FacultyWebPartStrings';
import Faculty from './components/Faculty';
import { IFacultyProps } from './components/IFacultyProps';
import { sp } from "@pnp/sp";

export interface IFacultyWebPartProps {
  description: string;
  listId: string;
  listRole:string;
  listSpecialization:string;
}

export default class FacultyWebPart extends BaseClientSideWebPart<IFacultyWebPartProps> {

  public onInit(): Promise<void> {
    sp.setup({
      ie11: true,
      spfxContext: this.context
    });

    return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<IFacultyProps> = React.createElement(
      Faculty,
      {
        context: this.context,
        description: this.properties.description,
        listId: this.properties.listId,
        listRole: this.properties.listRole,
        listSpecialization: this.properties.listSpecialization
        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listId', {
                  label: 'listId'
                }),
                PropertyPaneTextField('listRole', {
                  label: 'listRole'
                }),
                PropertyPaneTextField('listSpecialization', {
                  label: 'listSpecialization'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
