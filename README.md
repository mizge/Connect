# Connect

Ši repozitorija sukurta Kauno technologijos universiteto Programų sistemos moduliui T120B165 Saityno taikomųjų programų projektavimas.

Visas darbas ir ši dokumentacija paruošta IFF-9/7 studentės Ugnės Glinskytės.

# Sprendžiamo uždavinio aprašymas
## Sistemos paskirtis

Projekto tikslas – palengvinti terapeuto ir kliento interakciją, sukuriant centralizuotą terapeutų paieškos sistemą.

Veikimo principas – pačią kuriamą platformą sudaro dvi dalys: internetinė aplikacija, kuria naudosis klientas ir terapeutas bei aplikacijų programavimo sąsaja (angl. trump. API).

Terapeutas, norėdamas naudotis šia platforma, užsiregistruoja sistemoje pasirinkdamas savo specializacijos kryptį ar kryptis. Terapuetas gali kurti seansus. Kai pirmasis seansas, terapuetas gali palikti užrašus apie įvykusį seansą bei priskirti namų darbus užduotus po seanso. Terapeutas taip pat gali ištrinti neužrezervuotus seansus ar pridėti naujų. Terapeutas turi galimybę peržiūrėti jau įvykusių ir įvyksiančių seansus. Klientas gali matyti savo seansų istoriją, namų darbus bei atšaukti dar neprasidėjusius seansus. Užsiregistruoti į seansą gali tik klientas.

Sistemos administratorius gali kurti terapuetų kvalifikacijas.

Neprisregistravęs vartotojas gali pasirinkęs jam norimą terapeutų specializacijos kategoriją, peržiūrėti pasirinkto terapeuto laisvus seansus. 

## Funkciniai reikalavimai

Neregistruotas sistemos naudotojas gali:
1.	Peržiūrėti platformos reprezentacinį puslapį;
2.	Perskaityti klasifikacijų tipų aprašymus bei jas turinčius terapeutus;
3.	Matyti laisvus galimus laikus pasirinktam terapeutui.
4.	Prisijungti (užsiregistruoti) prie internetinės aplikacijos.

Visi registruoti sistemos naudotojai gali:
1.	Prisijungti prie internetinės aplikacijos;
2.	Atsijungti nuo internetinės aplikacijos.

Registruotas sistemos naudotojas (terapeutas) gali:
1.	Pridėti naujus laikus;
2.	Ištrinti neužrezervuotus laikus;
3.	Peržiūrėti rezervuotus laikus ir tuo laiku užsiregistravusius klientus;
4.	Peržiūrėti seanso namų darbų sąrašą;
5.	Pridėti įvykusiam seansui namų darbus;
6.  Redaguoti įvykusio seanso namų darbus;
7.  Ištrinti įvykusio seanso namų darbus;
8.	Redaguoti įvykusio seanso užrašus;


Registruotas sistemos naudotojas (klientas) gali:
1.	Užsiregistruoti į seansą pas pasirinktą terapeutą.
2.	Atšaukti seansą su terapeutu, jeigu iki seanso pradžios like nemažiau, kaip para.
3.	Peržiūrėti savo seansų istoriją;
4.	Peržiūrėti seanso namų darbų sąrašą;

Sistemos administratorius gali:
1.  Sukurti terapeutų kategoriją;
2.	Redaguoti terapeutų kategoriją;
3.	Šalinti terapeutų kategorija.

# Sistemos architektūra
Sistemos sudedamosios dalys: 
*	Kliento pusė (ang. Front-End) – naudojant React.js; 
*	Serverio pusė (angl. Back-End) – naudojant C# .NET. Duomenų bazė – MySQL. 

2.1 pav. pavaizduota kuriamos sistemos diegimo diagrama. Sistemos talpinimui yra naudojamas Azure serveris. Kiekviena sistemos dalis yra diegiama tame pačiame serveryje. Internetinė aplikacija yra pasiekiama per HTTPS protokolą. Šios sistemos veikimui (pvz., duomenų manipuliavimui su duomenų baze) yra reikalingas Connect API, kuris pasiekiamas per aplikacijų programavimo sąsają. Pats Connect API vykdo duomenų mainus su duomenų baze - tam naudojamas TCP komunikacijos protokolas.

![](Picture1.png)

_2.1 pav. Sistemos Connect diegimo diagrama_

# API specifikacija
Tam, kad būtų išlaikomas nuoseklumas, sistemos API metodai bus aprašomi remiantis Twitter API užklausų aprašymais. Aprašymuose pateikiama svarbiausia bei būtina informacija sėkmingam užklausos vykdymui. Taip pat pateikiama informacija apie galimas klaidas, kurios gali iškilti apdorojant tam tikrą API užklausą. Verta paminėti, kad kelias iki metodo yra nurodomas tik parašant URL galutinę dalį, nes domenas gali skirtis.

## Example API: _/2/users/:id/bookmarks/:tweet_id_

Simple description

**Endpoint URL**

`https://api.twitter.com/2/users/:id/bookmarks/:tweet_id`

**Authorization required**
||
|:--:|
|Admin|
| User|

**Path parameters**
|Name| Type| Description|
|:--:|:--:|:--:|
|`id` | int||
| User|int ||

**Example responses**

**Response fields**