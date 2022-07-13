import { Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import * as countrycitystatejson from 'countrycitystatejson';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  url: string = ""
  // url :string = "https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json";
  private countryData = countrycitystatejson;

  constructor(private http: HttpClient) {}
  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName);
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state);
  }
  public getCodeList() {
    const codes = [];
    // this.getCountries().map((element) => {
    //   codes.push(element.dial_code);
    // });
    return ['+961', '+971'];
  }
  public getGenderList() {
    return ['Male', 'Female'];
  }
  public getNationalityList() {
    return ['Afghan', 'Albanian', 'Algerian', 'American Samoan', 'Andorran', 'Angolan', 'Anguillan', 'Antiguan, Barbudan', 'Argentine', 'Armenian', 'Aruban; Dutch', 'Australian', 'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese', 'Bermudian', 'Bhutanese', 'Bolivian', 'Bosnian, Herzegovinian', 'Motswana, Batswana', 'Brazilian', 'British Virgin Islander', 'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cabo Verdean', 'Cambodian', 'Cameroonian', 'Canadian', 'Caymanian', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Christmas Island', 'Cocos Islander', 'Colombian', 'Comoran', 'Congolese', 'Congo', 'Cook Islander', 'Costa Rican', 'Ivoirian', 'Croatian', 'Cuban', 'Curacaoan; Dutch', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dominican', 'Ecuadorian', 'Egyptian', 'Salvadoran', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Falkland Island', 'Faroese', 'Fijian', 'Finnish', 'French', 'French Polynesian', 'Gabonese', 'Gambian', 'NA', 'Georgian', 'German', 'Ghanaian', 'Gibraltar', 'Greek', 'Greenlandic', 'Grenadian', 'Guamanian', 'Guatemalan', 'Channel Islander', 'Bissau-Guinean', 'Guinean', 'Guyanese', 'Haitian', 'none', 'Honduran', 'Chinese', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi',
    'Irish', 'Manx', 'Israeli', 'Italian', 'Jamaican', 'Japanese', 'Channel Islander', 'Jordanian', 'Kazakhstani', 'Kenyan', 'I-Kiribati', 'Korean', 'Korean', 'Kosovar (Albanian), Kosovski (Serbian)', 'Kuwaiti', 'Kyrgyzstani', 'Laotian', 'Latvian', 'Lebanese', 'Basotho', 'Liberian', 'Libyan', 'Liechtenstein', 'Lithuanian', 'Luxembourg', 'Chinese', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monegasque', 'Mongolian', 'Montenegrin', 'Montserratian', 'Moroccan', 'Mozambican', 'Namibian', 'Nauruan', 'Nepali', 'Dutch', 'New Caledonian', 'New Zealand', 'Nicaraguan', 'Nigerian', 'Nigerien', 'Niuean', 'Norfolk Islander(s)', 'NA', 'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Philippine', 'Pitcairn Islander', 'Polish', 'Portuguese', 'Puerto Rican', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Helenian', 'Kittitian, Nevisian', 'Saint Lucian', 'French', 'Vincentian', 'Samoan', 'Sammarinese', 'Sao Tomean', 'Saudi Arabian', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singapore', 'Slovak', 'Slovenian', 'Solomon Islander', 'Somali', 'South African', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamese', 'Swazi', 'Swedish',
    'Swiss', 'Syrian', 'Taiwan', 'Tajikistani', 'Tanzanian', 'Thai', 'Timorese', 'Togolese', 'Tokelauan', 'Tongan', 'Trinidadian, Tobagonian', 'Tunisian', 'Turkish', 'Turkmen', 'none', 'Tuvaluan', 'Ugandan', 'Ukrainian', 'Emirati', 'British', 'American', 'Uruguayan', 'Uzbekistani', 'Ni-Vanuatu', 'Venezuelan', 'Vietnamese', 'Virgin Islander', 'Wallisian', 'NA', 'Sahrawi, Sahrawian, Sahraouian', 'Yemeni', 'Zambian', 'Zimbabwean'];
  }
  public getBirthPlaceList() {
    return ['Beirut', 'Luxem'];
  }
  public getProvinceList() {
    return ['prov1', 'prov2'];
  }
  public getDistrictList() {
    return ['district', 'district'];
  }
  public getCityList() {
    return ['beirut', 'berlin', 'testy'];
  }
}
