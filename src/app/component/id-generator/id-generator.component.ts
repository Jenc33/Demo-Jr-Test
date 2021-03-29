import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clubes } from 'src/app/data/clubes';
import { generos } from 'src/app/data/generos';
import { nacionalidades } from 'src/app/data/nacionalidades';
import { FootballClub } from 'src/app/models/football-club';
import { Gender } from 'src/app/models/gender';
import { Identification } from 'src/app/models/identification';
import { Nationality } from 'src/app/models/nationality';
import { NgWizardConfig, NgWizardService, StepChangedArgs, StepValidationArgs, STEP_STATE, THEME } from 'ng-wizard';
import { jsPDF } from 'jspdf';
import { of } from 'rxjs';

@Component({
  selector: 'app-id-generator',
  templateUrl: './id-generator.component.html',
  styleUrls: ['./id-generator.component.css']
})
export class IdGeneratorComponent implements OnInit {

  idForm : FormGroup;
  genderS : Gender;
  nacionalityS : Nationality
  club : FootballClub;
  showRFC : boolean = false;
  patternRFC = '^[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?$';
  readonly clubs = clubes;
  readonly nacionalities = nacionalidades;
  readonly genders = generos;
  identification : Identification;

  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };

  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarExtraButtons: [
        { text: 'Finish', class: 'btn btn-info', event: () => { alert("Finished!!!"); } }
      ],
    }
  };

  constructor(private ngWizardService: NgWizardService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initForm();
    this.identification = new Identification();
    let footballC = new FootballClub();
    let nationality = new Nationality();
    this.identification.footballClub = footballC;
    this.identification.nationality = nationality;
  }

  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    this.ngWizardService.next();
  }

  resetWizard(event?: Event) {
    this.ngWizardService.reset();
  }

  setTheme(theme: THEME) {
    this.ngWizardService.theme(theme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
  }

  isValidTypeBoolean: boolean = true;

  isValidFunctionReturnsBoolean(args: StepValidationArgs) {
    return true;
  }

  isValidFunctionReturnsObservable(args: StepValidationArgs) {
    return of(true);
  }

  generateID(){
    this.identification = new Identification();
    this.identification.name = this.idForm.get("name").value;
    this.identification.pLastName = this.idForm.get("pLastName").value;
    this.identification.mLastName = this.idForm.get("mLastName").value;
    this.identification.birthdate = this.idForm.get("birthdate").value;
    this.identification.gender = this.genderS;
    this.identification.nationality = this.nacionalityS;
    this.identification.footballClub = this.club;
    this.identification.rfc = this.idForm.get("rfc").value;
    this.identification.ocupation = this.idForm.get("occupation").value;
    this.ngWizardService.next();
  }

  initForm(){
    this.idForm = this.fb.group({
      name : ["", Validators.required],
      pLastName : ["", Validators.required],
      mLastName : ["", Validators.required],
      birthdate : ["", Validators.required],
      gender : ["", Validators.required],
      nacionality : ["", Validators.required],
      footballClub : ["", Validators.required],
      rfc : ["", Validators.pattern(this.patternRFC)],
      occupation : ["", Validators.required]
    });
  }
  validateDate(date){
    var today = new Date();
    var minAge = 18;
    var dateF = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    var dateS = new Date(date.value);
    if(dateS < dateF){
      this.showRFC = true;
    } else {
      this.showRFC = false;
    }
  }

  get name(){
    return this.idForm.get('name');
  }

  get rfc() {
    return this.idForm.get('rfc');
  }

  get pLastName(){
    return this.idForm.get('pLastName');
  }

  get mLastName(){
    return this.idForm.get('mLastName');
  }

  get birthdate(){
    return this.idForm.get('birthdate');
  }

  get gender(){
    return this.idForm.get('gender');
  }

  get nacionality(){
    return this.idForm.get('nacionality');
  }

  get footballClub(){
    return this.idForm.get('footballClub');
  }

  get occupation(){
    return this.idForm.get('occupation');
  }

  get idRandom(){
    let firstId = Math.floor(Math.random() * (99999)) + 1;
    let secondId = Math.floor(Math.random() * (99)) + 1;
    let thirtId = Math.floor(Math.random() * (99)) + 1;
    let fourthId = Math.floor(Math.random() * (9999)) + 1;
    let id = firstId.toString().padStart(5, '0') + ' ' + secondId.toString().padStart(2, '0') +
    ' ' + thirtId.toString().padStart(2, '0') + ' ' + fourthId.toString().padStart(4, '0');
    return id;
  }

  generatePDF(){
    const doc = new jsPDF();
    doc.text("Nombre: " + this.identification.name + " " + this.identification.pLastName +
    " " + this.identification.mLastName, 10, 10);
    doc.text("Fecha de nacimiento: " + this.identification.birthdate, 10, 20);
    doc.text("Género: " + this.identification.gender.nombre, 10, 30);
    doc.text("Nacionalidad: " + this.identification.nationality.nombre, 10, 40);
    doc.text("Club de futbol: " + this.identification.footballClub.nombre, 10, 50);
    if(this.showRFC){
      doc.text("RFC: " + this.identification.rfc, 10, 60);
    }
    doc.text("Ocupación: " + this.identification.ocupation, 10, 70);

    doc.save("formato.pdf");
  }

}
