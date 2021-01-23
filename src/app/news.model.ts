export class News{
    nid: string;
  date: string;
  descrip: string;
  country: string;
  
  constructor(date: string, descrip: string, country: string){
    this.date = date;
    this.descrip = descrip;
    this.country = country;
  }
}
