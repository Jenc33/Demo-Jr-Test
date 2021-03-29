import { FootballClub } from "./football-club";
import { Gender } from "./gender";
import { Nationality } from "./nationality";

export class Identification {
  public name : string;
  public pLastName : string;
  public mLastName : string;
  public birthdate : Date;
  public gender : Gender;
  public nationality : Nationality;
  public footballClub : FootballClub;
  public rfc : string;
  public ocupation : string;
}
