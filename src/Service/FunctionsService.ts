import { IAlert, IUserProfile } from "../Model/UserProfile";

export class FunctionsService {
    /**
     * getCurrentDateTime 
     */
    public getTodayFormatDateTime(UTCTime: boolean, ReturnDateAndTime: boolean, AddMinutes: number) {
        let month: any;
        let day: any;
        let hour: any;
        let minute: any;
        let date: any;
        let time: any;
        var dateTime = new Date(new Date().getTime() + (AddMinutes * 60000));
        if (UTCTime) {
            month = (dateTime.getMonth() + 1) < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
            day = (dateTime.getDate() + 1) < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
            hour = dateTime.getUTCHours() < 10 ? 'T0' + dateTime.getUTCHours() : 'T' + dateTime.getUTCHours();
            minute = dateTime.getUTCMinutes() < 10 ? '0' + dateTime.getUTCMinutes() : dateTime.getUTCMinutes();
            date = dateTime.getFullYear() + '-' + month + '-' + day;
            time = hour + ':' + minute + ':00';
        } else {
            month = (dateTime.getMonth() + 1) < 10 ? '0' + (dateTime.getMonth() + 1) : (dateTime.getMonth() + 1);
            day = (dateTime.getDate() + 1) < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
            hour = dateTime.getHours() < 10 ? 'T0' + dateTime.getHours() : 'T' + dateTime.getHours();
            minute = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
            date = dateTime.getFullYear() + '-' + month + '-' + day;
            time = hour + ':' + minute + ':00';


        }
        if (ReturnDateAndTime)
            return date + time;
        else
            return date;
    }

    public getDayName() {
        var days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        var d = new Date(new Date().toISOString());
        return days[d.getDay()];

    }

    public checkJsonExist(jsonExist: boolean, alertMemoItems: any, UserProfile: IUserProfile) {
        let alertFinal: IUserProfile = new IUserProfile();
        if (jsonExist) {
            alertMemoItems.forEach(element => {
                let found = UserProfile.Alert.filter(itm => itm.ID == element.ID && itm.Delete == true);
                if (found.length == 0) {
                    let NewAlert: IAlert = new IAlert();
                    NewAlert.ID = element.ID;
                    NewAlert.Title = element.Title;
                    NewAlert.Categoria = element.Categoria;
                    NewAlert.Tipologia = element.Tipologia;
                    NewAlert.LinkNews = element.FileDirRef + '/' + element.LinkFilename;
                    NewAlert.Read = UserProfile.Alert.filter(itm => itm.ID == element.ID).length > 0 ? UserProfile.Alert.filter(itm => itm.ID == element.ID)[0].Read : false;
                    NewAlert.Delete = false;
                    alertFinal.Alert.push(NewAlert);
                }


            });
        } else {
            alertFinal.Alert = alertMemoItems.map(e => (
                {
                    ID: e.ID,
                    Title: e.Title,
                    Categoria: e.Categoria,
                    Tipologia: e.Tipologia,
                    LinkNews: e.FileDirRef + '/' + e.LinkFilename,
                    Read: false,
                    Delete: false,
                }
            ) as IAlert

            );
        }
        return alertFinal;
    }

    public checkExistMessage(UserProfile: IUserProfile, e: any) {
        if (UserProfile.Alert.filter(aler => e.ID == aler.ID && e.Read == true).length > 0) {
            UserProfile.Alert.filter(aler => e.ID == aler.ID)[0].Read == true ?
                UserProfile.Alert.filter(aler => e.ID == aler.ID)[0].Delete = true :
                UserProfile.Alert.filter(aler => e.ID == aler.ID)[0].Read = true;
            return "update";
        } else {
            let NewAlert: IAlert = new IAlert();
            NewAlert.ID = e.ID;
            NewAlert.Title = e.Title;
            NewAlert.Categoria = e.Categoria;
            NewAlert.LinkNews = e.LinkNews;
            NewAlert.Tipologia = e.Tipoloiga;
            NewAlert.Read = true;
            NewAlert.Delete = false;
            UserProfile.Alert.push(NewAlert);
            return "new";
        }
    }

    public AddObjectEmpty(item: any) {
        item["Title"] = "";
        item["Description"] = "";
        item["Tag"] = null;
        item["Categoria"] = "";
        item["BannerImageUrl"]["Description"] = "https://avateamdev.sharepoint.com/sites/TernaIntranet/ContenutiSezioniCustom/news/blank.png";
        item["BannerImageUrl"]["Url"] = "https://avateamdev.sharepoint.com/sites/TernaIntranet/ContenutiSezioniCustom/news/blank.";
        item["FirstPublishedDate"] = null;
        return item;
    }

    public GetResolution(width: number) {
        if (width <= 300)
            return "0";
        else if (width > 300 && width <= 480)
            return "1";
        if (width > 480 && width <= 750)
            return "2";
        else if (width > 750 && width <= 1024)
            return "3";
        else if (width > 1024 && width <= 1600)
            return "4";
        else if (width > 1600 && width <= 2560)
            return "5";
        else
            return "6";
    }
}