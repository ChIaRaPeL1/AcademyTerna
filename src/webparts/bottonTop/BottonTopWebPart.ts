import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'BottonTopWebPartStrings';
import BottonTop from './components/BottonTop';
import { IBottonTopProps } from './components/IBottonTopProps';

import { sp } from "@pnp/sp";

export interface IBottonTopWebPartProps {
  description: string;
}

export default class BottonTopWebPart extends BaseClientSideWebPart<IBottonTopWebPartProps> {

  public onInit(): Promise<void> {
    sp.setup({
      ie11: true,
      spfxContext: this.context
    });

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IBottonTopProps> = React.createElement(
      BottonTop,
      {
        context: this.context,
        description: this.properties.description,
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
