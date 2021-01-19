export class News{
  date: Date;
  descrip: string;
  country: string;
  
  constructor(date: Date, descrip: string, country: string){
    this.date = date;
    this.descrip = descrip;
    this.country = country;
  }
}
