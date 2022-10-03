import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneLabel,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'FooterWebPartStrings';
import Footer from './components/Footer';
import { IFooterProps } from './components/IFooterProps';



export interface IFooterWebPartProps {
  siteUrl: string;
  ListTitle:string;
 
}

export default class FooterWebPart extends BaseClientSideWebPart<IFooterWebPartProps> {

    public render(): void {
  
    const element: React.ReactElement<IFooterProps> = React.createElement(
      Footer,
      {
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.properties.siteUrl,
        context: this.context,
        
        
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
          displayGroupsAsAccordion: true,
          groups: [          
            // {
            //   groupName: "Configuration",
            //   isCollapsed: true,
            //   groupFields: [
            //     PropertyPaneTextField('ListTitle', {
            //       label: "List Guid Configuration"
            //     })
            //   ]
            // },
          ]
        }
      ]
    };
  }
}
