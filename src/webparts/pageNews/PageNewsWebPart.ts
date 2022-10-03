import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PageNewsWebPartStrings';
import PageNews from './components/PageNews';
import { IPageNewsProps } from './components/IPageNewsProps';
import { sp } from "@pnp/sp";

export interface IPageNewsWebPartProps {
  description: string;
  listId: string; // Stores the list ID(s)
  numberOfNews?: number;
  filterByCategoria: string;
  filterByTagName: string;
  ViewForSingleNews: boolean;
}

export default class PageNewsWebPart extends BaseClientSideWebPart<IPageNewsWebPartProps> {

  public onInit(): Promise<void> {
    sp.setup({
      ie11: true,
      spfxContext: this.context
    });
    return super.onInit();
  }

  public render(): void {
    const element: React.ReactElement<IPageNewsProps> = React.createElement(
      PageNews,
      {
        description: this.properties.description,
        filterByTagName: this.properties.filterByTagName,
        //filterByCategoria: this.properties.filterByCategoria,
        numberOfNews: this.properties.numberOfNews,
        listId: this.properties.listId,
        ViewForSingleNews: this.properties.ViewForSingleNews,
        onConfigure: () => {
          this.context.propertyPane.open();
        },
        context: this.context
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
                  label: 'Select a list ID'
                }),
                PropertyPaneCheckbox("ViewForSingleNews", {
                  text: "ViewForSingleNews",
                  checked: false,
                }),
                PropertyPaneTextField('filterByCategoria', {
                  label: 'Filter By Categoria'
                }),
                PropertyPaneTextField('filterByTagName', {
                  label: 'Filter By Tag'
                }),
                PropertyPaneSlider('numberOfNews',
                  {
                    label: 'Number Of News',
                    min: 2,
                    max: 20,
                    showValue: true,
                  }),
              ]
            }
          ]
        }
      ]
    };
  }
}
