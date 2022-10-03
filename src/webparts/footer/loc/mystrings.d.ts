declare interface IFooterWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  SiteUrlField: string;
  Linkedin: string;
  Instagram: string;
  Facebook: string;
  Youtube: string;
  Twitter: string;
  Mailto: string;
  ContactNumber: string;
}

declare module 'FooterWebPartStrings' {
  const strings: IFooterWebPartStrings;
  export = strings;
}
