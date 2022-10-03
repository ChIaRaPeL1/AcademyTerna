import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SectionBoxWebPartStrings';
import SectionBox from './components/SectionBox';
import { ISectionBoxProps } from './components/ISectionBoxProps';

import { sp } from "@pnp/sp";


export interface ISectionBoxWebPartProps {
  description: string;
  listGuidID: string;
}

export default class SectionBoxWebPart extends BaseClientSideWebPart<ISectionBoxWebPartProps> {

  public onInit(): Promise<void> {
    sp.setup({
      ie11: true,
      spfxContext: this.context
    });

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ISectionBoxProps> = React.createElement(
      SectionBox,
      {
        context: this.context,
        description: this.properties.description,
        listGuidID: this.properties.listGuidID,
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
                PropertyPaneTextField('listGuidID', {
                  label: 'listGuidID'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
