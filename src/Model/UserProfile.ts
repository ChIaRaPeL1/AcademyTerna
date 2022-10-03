export class ITest {
    private UserProfile: IUserProfile;
}

export class IUserProfile {
    public AccountName: string;
    public Alert: Array<IAlert> = [];
}

export class IAlert {
    public ID: number;
    public LinkNews: string;
    public Title: string;
    public Categoria: string;
    public Tipologia: string;
    public Read: boolean;
    public Delete: boolean;

}