import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CarouselNewsWebPartStrings';
import CarouselNews from './components/CarouselNews';
import { ICarouselNewsProps } from './components/ICarouselNewsProps';

import { sp } from "@pnp/sp";

export interface ICarouselNewsWebPartProps {
  description: string;
  listName: string;
  numberOfSlider?: number;
  listGuidID: string;
  IDDocumentLibraryImages: string;
}

export default class CarouselNewsWebPart extends BaseClientSideWebPart<ICarouselNewsWebPartProps> {

  public onInit(): Promise<void> {
    sp.setup({
      ie11: true,
      spfxContext: this.context
    });

    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<ICarouselNewsProps> = React.createElement(
      CarouselNews,
      {
        context: this.context,
        description: this.properties.description,
        numberOfSlider: this.properties.numberOfSlider,
        listName: this.properties.listName,
        listGuidID: this.properties.listGuidID,
        IDDocumentLibraryImages: this.properties.IDDocumentLibraryImages,
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
                PropertyPaneSlider('numberOfSlider', {
                  label: 'Number Of Slider',
                  min: 5,
                  max: 20,
                  showValue: true,
                }),
                PropertyPaneTextField('IDDocumentLibraryImages', {
                  label: 'IDDocumentLibraryImages'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
