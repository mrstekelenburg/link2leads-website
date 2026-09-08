# Wijzigingen, 2 september 2026

Opgebouwd vanaf de originele zip. De bestaande structuur, stijl en werkende onderdelen zijn ongemoeid gelaten; alleen toegevoegd wat iets oplevert.

## Nieuw

| Bestand | Wat |
|---|---|
| `cold-email-bureaus-nederland.html` | Vergelijkingspagina, elf aanbieders inclusief concurrenten |
| `kennis.html` + `kennis/` (5 artikelen) | Kennisbank: kosten, wetgeving, deliverability, SDR-vergelijking, benchmarks |
| `assets/l2l-page.css` | Stijl voor de nieuwe pagina's, zelfde tokens als de homepage |
| `api/contact.js` | Endpoint voor het contactformulier |
| `llms-full.txt` | Volledige tekst van de kennispagina's, machineleesbaar |

## Aangepast in `index.html`

1. Klantlogo's in de carousel staan nu in kleur (grayscale-filter eruit, opacity van 0,45 naar 0,9)
2. Nav en mobiel menu: link Kennis erbij
3. Contactsectie `#contact` met kort formulier (naam, e-mail, optionele vraag) plus info@ en telefoon ernaast
4. Naast elke primaire knop een tweede, lagere-drempel knop naar dat formulier. De losse mailregel in de hero is eruit
5. Compacte cijferstrip onder de case: 4 tegels, geen tabel
6. Prijssectie: twee compacte blokken (wat je krijgt / wat er niet bij zit / wat we vastleggen, en wat telt als positieve reactie). Lijstjes, geen lappen tekst
7. FAQ: twee korte vragen erbij met doorklik naar de kennisbank
8. Footer: kolom Kennis en een contactlink
9. Schema: alle vier de pakketprijzen, de definitie van een positieve reactie, e-mailadres in het contactpunt, drie extra FAQ-items

## Klantlogo's

De carousel telt nu 19 namen in plaats van 7. Toegevoegd: Ubari, 2BE IT, HCA Project, Connessence, Secudata, MicFil Filters, Van As Advocaten, Cannabas, Club de Medios, VIP-Isolutions, WIJ van Werkgeluk en Neuropage. De animatieduur is meegeschaald van 60 naar 163 seconden, zodat de rij even snel loopt als eerst.

Voor de zeven bestaande namen staan nog de oorspronkelijke logobestanden. Voor de twaalf nieuwe heb ik monogram-tegels gemaakt in de stijl van de site, omdat ik geen logobestanden van die klanten heb. Stuur je de echte logo's (PNG of SVG, vierkant), dan wissel ik ze een voor een om.

Twee dingen om te checken voordat dit live gaat:

- **Neuropage** staat in mijn notities als leverancier van de gepersonaliseerde landingspagina's, niet als klant. Onder het kopje "Bedrijven die we al hebben geholpen" is dat een claim. Klopt het dat zij ook klant zijn, dan blijft hij staan; zo niet, haal het blok met alt="Neuropage" weg (staat twee keer in de track).
- **Cobra Art** heb ik bewust weggelaten, omdat die per 2 september is gecrediteerd. **Stoof, DevxTeam en De Energiespecialist** staan er ook niet in, want die zijn nog niet gesloten.


## Fitcheck in plaats van strategiecall

Overal doorgevoerd: `index.html`, `book.html`, `klant.html`, `calculator-l2l.html`, `privacy.html`, `algemene-voorwaarden.html`, `llms.txt` en de nieuwe pagina's. De EN- en ES-vertalingen in `assets/i18n/l2l-i18n-data.js` zijn meegenomen (strategy call wordt fit check, llamada estrategica wordt chequeo de encaje), dus de taalwissel blijft werken. De oude sleutels staan er nog naast voor het geval een pagina ze nog gebruikt.

## Schrijfstijl

Nul em dashes in alle zichtbare tekst. Nul nadruksaccenten (een in plaats van een-met-accenten, niet in plaats van niet-met-accent, wel, voor, dat). Geen "niet X, maar Y"-constructies meer, en het woord ruis is eruit. De em dashes die overblijven in `index.html`, `klant.html` en `calculator-l2l.html` zitten in CSS-commentaar en in JavaScript-placeholders, dus die ziet niemand.

Dit is toegepast op basis van wat er in mijn notities over je schrijfstijl staat. Je eigen anti-AI skill met de verbodenwoordenlijst zit niet in deze sessie, dus loop de nieuwe teksten daar nog een keer langs.

## Cijfers op de site

Uit Smartlead, uitgelezen op 2 september 2026. Alleen de sterke cijfers staan er nu:

- 140.869 mails verzonden namens klanten
- 76% hoogste open rate op een lopende campagne (2BE IT)
- 7,9% reply rate op de best draaiende campagne (Connessence, segment coaches en therapeuten: 2.100 verzonden, 1.224 geopend, 167 reacties)
- 3,4x meer reacties in het sterkste segment dan in het zwakste, binnen dezelfde campagne van 18.594 leads (7,8% tegen 2,3%, getoetst met een z-test)

De uitsplitsing per campagne met positieve reacties per 1.000 mails staat nergens meer op de site.

Ook weg: alles wat de eigen cijfers ondermijnde. De percentages afwezigheidsmeldingen (17 tot 41), de zin dat vier van de tien reacties geen reactie was, de opmerking dat een reply rate misleidt, en de FAQ op de vergelijkingspagina die 140.869 mails tegenover 102 positieve reacties zette. Dat is vervangen door wat we wel doen: elke reactie met de hand gelezen, alleen doorsturen wat een gesprek waard is, met naam en contactgegevens erbij. De z-testtabel staat er nog, maar de kolom heet nu "wat we ermee doen" (volume hierheen, andere insteek, uit de lijst) in plaats van significant beter of slechter.

## Voordat je pusht

**Contactformulier testen.** `api/contact.js` draait op dezelfde env-variabelen als `book.js` en `klant.js` (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`, `NOTIFY_EMAIL`), dus er hoeft niets bij. Vul het formulier op de preview-URL een keer in: je hoort een bevestiging op het ingevulde adres en een notificatie op `NOTIFY_EMAIL`, met reply-to naar de invuller.

**`/kennis` controleren.** Vercel serveert die met `cleanUrls` vanuit `kennis.html`, terwijl er ook een map `kennis/` bestaat. Werkt in de regel prima, maar check het na de eerste deploy. Zo niet: hernoem `kennis.html` naar `kennis/index.html`, de redirect voor `/kennis/index` staat al klaar.

## Twee dingen om zelf over te beslissen

**De calculator gaat uit van 5 positieve reacties per 1.000 verzonden mails**, en de tekst eronder noemt een sterkste campagne van 5,6 en een zwaarste markt van 0,7. Die cijfers stonden er al. Mijn metingen van 2 september komen op de best draaiende campagne lager uit. Er is geen directe tegenspraak op de site, want de nieuwe pagina's noemen reply rates en geen positieve reacties per 1.000. Maar als een prospect beide leest, is de calculator de optimistische kant. Je kunt de constante verlagen of erbij zetten dat het een bovenkant is.

**Het wetgevingsartikel** noemt nu alleen wat te herleiden is: de hoofdregel en de twee uitzonderingen uit artikel 11.7 Telecommunicatiewet, de AVG-artikelen 6, 14 en 21, en de wijziging van 1 juli 2026 met een link naar Rijksoverheid en Ondernemersplein. Waar de wet ruimte laat, staat dat er als zodanig bij in plaats van dat ik een uitleg claim. Interpretaties die ik niet kon staven zijn eruit.

---

# Ronde 25, 3 september 2026

1. **Kaarten lichter en blauwer.** `--card-bg` van `rgba(14,16,26,.72)` naar `rgba(21,27,46,.88)` en `--border` van `.07` naar `.11`. Werkt in één keer door op de inboxwidget, de cases, de blokken, het campagneoverzicht, de pakketten, de FAQ en de contactkaart. Zelfde waarden in `assets/l2l-page.css`, zodat de kennis- en vergelijkingspagina's meelopen.
2. **Sectielabels groter.** `.section-pill` van 12 naar 14 px (mobiel van 10 naar 12,5 px). Ook meegetrokken: het caselabel, het garantielabel, het label boven de vier stappen en de labels Standaard / Full Service.
3. **Opstart is nu een tijdlijn, geen tweede set genummerde blokken.** Nieuwe component `.tl-rail`: horizontale lijn met drie knooppunten, weeklabels in plaats van cijfercirkels, streepjes in plaats van groene vinkjes, en per week een regel **Aan het eind** met wat jij op dat moment concreet hebt. Op mobiel klapt de lijn verticaal. De blokken in de waarom-sectie blijven zoals ze waren, dus de twee secties lijken niet meer op elkaar.
4. **Dubbele Full Service-notitie eruit.** Het blok onder de pakketten is verwijderd, inclusief de nu ongebruikte css. De minimale looptijd hoort bij ieder pakket en staat nu boven de kaarten: "Alle pakketten hebben een minimale looptijd van drie maanden, daarna maandelijks opzegbaar."
5. **Contactsectie uitgelijnd.** Het formulier zit nu in een eigen paneel dat even hoog is als de linkerkolom, in plaats van bovenaan te zweven met een gat eronder.
6. **Footertitels blauw.** `.foot-col-title` van grijs naar `var(--accent2)`, op de homepage en op alle subpagina's.

22 nieuwe Engelse sleutels toegevoegd, dictionary staat op 1919. Gecontroleerd: geen dode ankers, geen kapotte links, geen JS-fouten, geen horizontale overflow op mobiel, en geen Nederlandse tekst meer over in de Engelse versie.

---

# Ronde 26, 3 september 2026

1. **Macvenster om het dashboard en de cases.** Nieuwe component `.brw-bar`: drie stoplichtknopjes, een adresbalk met slotje en een label rechts. Zit nu boven het campagneoverzicht (`app.link2leads.nl/campagne · voorbeeld`) en boven allebei de case studies. Panelen kregen een diepere schaduw, zodat ze als venster voor de pagina zweven.
2. **Onderkant van het dashboard opgeruimd.** De kop, de lange alinea en de disclaimer eronder zijn eruit. Wat overblijft is een legenda op één regel: "Elke reactie met de hand ingedeeld" plus de vijf labels, kleiner gezet. Dat het om een voorbeeld gaat staat nu in de adresbalk in plaats van in een tekstblok.
3. **800.000+ mails is een sticker.** Zweeft schuin over de rechterbovenhoek van het dashboard in plaats van als tekstblok eronder te staan. Op mobiel schuift hij naar rechtsboven het paneel.
4. **Logo bij elke losse review.** De citaten in beide cases (Nafite en MIJU-marketing), de review boven de prijzen (CrudenVision) en de review bij de beschikbaarheid (Remorec) hebben nu het bedrijfslogo naast de naam, net als de reviewkaarten.
5. **Garantiezegel.** Rond zegel met drie sterren, rechtsboven over de hoek van het garantieblok, met "Garantie / In je contract". De tekst in het blok krijgt automatisch minder breedte zodat er niets onder het zegel verdwijnt.
6. **Contacticonen professioneel en duidelijk klikbaar.** Emoji vervangen door strakke SVG-iconen in een grotere tegel, met een pijltje rechts. Bij hover kleurt de tegel blauw, schuift de rij een paar pixels op en beweegt het pijltje mee.

9 nieuwe Engelse sleutels, dictionary staat op 1928. Gecontroleerd: geen dode ankers, geen kapotte links, geen JS-fouten, geen horizontale overflow op mobiel, tags in balans en geen Nederlandse tekst over in de Engelse versie.

---

# Ronde 27, 3 september 2026

## Hero
1. **Kicker boven de kop:** "DONE-FOR-YOU E-MAIL OUTREACH VOOR B2B" in blauwe kapitalen boven de H1.
2. **Prijspil weg.** De prijs staat nu als kleine grijze regel onder de knoppen: "Vanaf €995 per maand, all-in en zonder setupfee. Gratis en vrijblijvend, je zit nergens aan vast."
3. **Twee kolommen op half scherm.** De hero klapte onder 1024px terug naar één kolom, precies de breedte van een half scherm op een groot beeldscherm. Nieuwe tussenlaag tussen 861 en 1010px houdt tekst en widget naast elkaar met kleinere typografie. Onder 861px stapelt hij pas.
4. **Nav.** Onder 1060px verdwijnen de links en de CTA nu ook via CSS, niet alleen via het script. Daarmee valt de knop niet meer een paar pixels buiten beeld als het script nog niet heeft gemeten.

## Boekingspagina
5. Twee gelijke kolommen (was 320px naast een brede widget), max 1120px breed.
6. De review is naar links verhuisd, onder de blokken, met het MIJU-logo erbij. Daaronder drie chips: geen verplichtingen, geen verkoopgesprek, concreet plan.
7. Emoji vervangen door SVG-iconen in blauwe tegels, gelijk aan de contactsectie op de homepage. De metablokken staan nu in twee kolommen naast elkaar.
8. Kaartkleuren, randen en schaduw gelijkgetrokken met de homepage. Kicker "GRATIS FITCHECK" boven de titel.
9. De kalender toont maand- en dagnamen nu in het Engels als de pagina op Engels staat.

## Logocarousel
10. Van 163 naar 85 seconden per ronde.

## SEO
11. **Titel homepage** begint met het zoekwoord in plaats van de merknaam: "Cold email bureau Nederland, done-for-you B2B afspraken | Link2Leads".
12. **Metadescription** claimde "gemiddeld 10+ gekwalificeerde afspraken per maand". Dat staat nergens anders op de site en is niet hard te maken, dus eruit. Vervangen door wat je wel levert en de prijs.
13. **"Live binnen 14 dagen"** botste met de tijdlijn (week 3 gaat de eerste mail eruit). Overal aangepast naar "setup klaar binnen twee weken, campagne live in week 3": metadescription, og- en twitterbeschrijving, Organization- en Service-schema, het garantieblok en llms.txt.
14. **/klant stond in de sitemap** terwijl de pagina op noindex staat. Uit de sitemap gehaald.
15. **lastmod** in de sitemap stond nog op 2 september, nu overal 3 september. Hetzelfde voor dateModified op de vergelijkingspagina.
16. **Titel van het nieuwe kennisartikel** miste "| Link2Leads". Toegevoegd.
17. **Algemene voorwaarden** noemde in de metadescription "Link2Leads B.V." Dat bestaat niet, de entiteit is Link2Group. Rechtgezet.
18. **Spaanse rest in de i18n-boot.** Alle 14 pagina's hadden nog `['nl','en','es']` in het script in de head. Wie ooit op Spaans had gestaan, kreeg een taal die de engine niet meer kent. Teruggebracht naar nl en en, ook in de generator.

Verder gecontroleerd en in orde: één H1 per pagina, geen sprongen in de koppenstructuur, canonical en og:url gelijk op elke pagina, alt op elke afbeelding, geldige JSON-LD (Organization, WebSite, Service, FAQPage, Article, BreadcrumbList, ItemList, CollectionPage), prijzen in het schema gelijk aan de pakketkaarten, robots.txt met de AI-crawlers, geen kapotte interne links en geen dode ankers.

7 nieuwe Engelse sleutels, dictionary staat op 1935.


---

# Ronde 28, 3 september 2026

De hero stapelde nog steeds op een half scherm. Reden: mijn grens lag op 861px en jouw venster is ongeveer 830px breed.

1. **Twee kolommen tot 700px.** De band 701 tot 1010px houdt tekst en widget naast elkaar. Pas onder 700px stapelt de hero, en dat is smaller dan een half scherm op vrijwel elke laptop.
2. **Compacte widget in die band.** Kleinere balk, kleinere avatars, kleinere labels, en de rijhoogte gaat van 88 naar 75px met de lijst van 264 naar 225px, zodat er precies drie reacties passen en de pagina niet gaat springen bij het rouleren. Gemeten over 60 samples: één hoogte, geen verschuiving.
3. **Regels blijven binnen hun rij.** Onder 1010px wordt de bedrijfsnaam op één regel afgekapt, onder 880px ook de reactietekst, zodat een lange naam niet meer over de volgende rij heen valt.
4. **Kicker** krimpt mee in letterafstand, zodat hij op de meeste breedtes op één regel past.

---

# Ronde 30, 4 september 2026

1. **Macvenster om de marktscan en om de inboxwidget in de hero.** Zelfde component als bij het dashboard en de cases: stoplichtknopjes, adresbalk met slotje. De marktscan draait op `link2leads.nl/gratis-marktscan`, de widget op `mail.jouwbedrijf.nl/inbox`. Allebei met dezelfde schaduw eronder.
2. **Reviews zonder scrollen.** De horizontale strook is vervangen door drie kolommen (twee onder 1000px, een onder 640px) waarin alle zeven reviews in een keer in beeld staan. Kaarten breken niet meer over kolommen heen en de tekst is een fractie groter.
3. **Kennisbanksectie van de homepage af.** De artikelenblokken onderaan zijn weg. De kennisbank blijft bereikbaar via de footer en via de links die al in de FAQ, de cases, de pakketten en de garantie stonden.
4. **In drie weken live is nu een echt tijdsschema.** Geen lijn met drie lijstjes meer, maar een balkenschema met een weekas: intake, verzendomgeving, warmdraaien en mails schrijven lopen over week 1 en 2, jouw akkoord is een groene markering aan het eind van week 2, en campagne live plus eerste reacties lopen vanaf week 3 door. Legenda eronder: wij bouwen, jij beslist, campagne draait. Op mobiel wordt het een lijst met een weekaanduiding per regel.
5. **Probleemiconen kloppen nu.** Het grafiekje bij "nieuwe klanten komen via-via" is een doorverwijsketen geworden (drie knopen met een gestippelde verbinding onderaan), en het rondje-met-pijlen bij "zelf koude acquisitie doen is geen optie" is een zandloper.

22 nieuwe Engelse sleutels, dictionary staat op 1958. Gecontroleerd: geen dode ankers, geen kapotte links, geen JS-fouten, geen horizontale overflow, tags in balans en geen Nederlandse tekst over in de Engelse versie.

---

# Ronde 31, 4 september 2026

1. **Boekingspagina opnieuw ingedeeld.** De agenda stond onder alle uitleg, waardoor je op mobiel en op een half scherm eerst voorbij alles moest scrollen voordat je kon plannen. Nu: kop over de volle breedte, daaronder links de review en direct de agenda, rechts een smalle kolom "Praktisch" met duur, format, beschikbaarheid en tijdzone. Op smal scherm komt die kolom onder de agenda te staan. De agenda begint nu op ongeveer 470px vanaf de bovenkant in plaats van ver onder de vouw.
2. **De drie chips zijn weg** (geen verplichtingen, geen verkoopgesprek, concreet plan).
3. **Review compacter**: logo links, sterren, citaat en naam ernaast, zodat hij weinig hoogte kost boven de agenda.
4. **Agenda op een prettige breedte.** De kolom is begrensd op 560px en de dagcellen op 46px hoog, anders werd de kalender op een breed scherm onnodig groot.
5. **Review van DefDigital toegevoegd** aan de reviewsectie op de homepage en aan de structured data. Aantal reviews in het schema van 7 naar 8. Omdat er geen logo van DefDigital is, staat er een tegel met de initialen.

3 nieuwe Engelse sleutels, dictionary staat op 1961.

---

# Ronde 32, 4 september 2026

1. **Reviews staan nu in drie vaste kolommen van drie.** De css-columns zijn vervangen door een echt raster met drie kolommen die elk hun eigen kaarten bevatten, zodat de verdeling niet meer door de browser wordt bepaald. Links Dick, Micah en Mike, midden Rafael, Arnold en Eric, rechts Marit, Lodewijk en de verwijskaart. Kolomhoogtes liggen binnen vijftig pixels van elkaar.
2. **Verwijskaart rechtsonder:** "En nog veel meer", met het Google-logo, het gemiddelde van 4,8 en een link naar de Google-reviewpagina. Gestippelde rand zodat hij als kaart hoort bij de rij maar niet voor een review wordt aangezien.
3. **Marit** staat nu als naam boven de review van DefDigital, ook in de structured data.

Op tablet twee kolommen, op mobiel een. 4 nieuwe Engelse sleutels, dictionary staat op 1965.

---

# Casepagina's, 6 september 2026

## Gekozen opzet: overzichtspagina plus drie losse pagina's

Niet alles op een pagina en ook niet alleen losse pagina's, maar allebei. `/cases` is het overzicht, en elke case heeft daarnaast een eigen URL. Reden: elke case kan los ranken op zijn eigen zoekwoorden, je kunt in een mail of een gesprek een enkele case sturen zonder dat iemand langs de andere twee moet scrollen, en het overzicht is kort genoeg om in de nav te hangen. Alles op een pagina zou een van de drie de eerste plek geven en de andere twee onder de vouw duwen.

## Nieuw

| Bestand | URL | Wat |
|---|---|---|
| `cases/index.html` | `/cases` | Overzicht met drie cases, cijferstrip bovenaan, doorklik per case |
| `cases/softwarebedrijf.html` | `/cases/softwarebedrijf` | 84.000 pipeline uit 5.085 campagne-investering |
| `cases/trainingsbedrijf.html` | `/cases/trainingsbedrijf` | 15 positieve reacties in de eerste twee weken |
| `cases/neuropage.html` | `/cases/neuropage` | Een eigen landingspagina per prospect |

De twee bestaande cases staan er inhoudelijk in zoals ze op de homepage stonden. Wat erbij is gekomen is de context: de situatie vooraf, de stappen die we hebben gezet en een feitentabel met investering, doorlooptijd en uitkomst. Geen nieuwe cijfers verzonnen.

De hub staat als `cases/index.html`, niet als `cases.html` naast een map `cases/`. Dat voorkomt de dubbelzinnigheid die bij `/kennis` nog wel bestaat.

## Neuropage-case

Deze gaat over onze eigen campagnes, niet over een klant, en is als zodanig gelabeld: "Onze eigen campagnes". De cijfers komen uit de case study die Neuropage over Link2Leads publiceerde, met bronlink onderaan de pagina.

- 1.240 prospects met een eigen pagina
- 34 procent opende zijn eigen pagina
- 9,1 procent reply rate, tegenover 3,2 procent op dezelfde lijst zonder persoonlijke pagina
- 27 afspraken in acht weken, drie nieuwe klanten op retainer

**Punt om over te beslissen:** die 9,1 procent staat naast de 7,9 procent die elders op de site het beste segment van de best draaiende campagne heet. Beide kunnen kloppen (andere campagnes, andere meting), maar een prospect die beide leest kan erover struikelen. Op de casepagina staat er nu bij waar het cijfer vandaan komt en waartegen het is afgezet. Wil je het scherper, dan zijn er twee opties: de zin op de homepage over de hoogste reply rate herformuleren, of het cijfer 9,1 van de casepagina halen en alleen het verschil ten opzichte van 3,2 noemen.

## Aangepast

1. **Homepage-carousel**: derde slide erbij (Neuropage), doorkliklink onder elke kaart, en de nep-URL's in de browserbalk kloppen nu met de echte pagina's (`/cases/...` in plaats van `/resultaten/...`). Onder de carousel staat "Alle cases op een rij".
2. **Nav op de subpagina's**: "Resultaten" wijst nu naar `/cases` in plaats van naar de anker op de homepage. Op de homepage zelf blijft het een anker, want daar staat de sectie gewoon op de pagina.
3. **Footer**: regel "Cases en resultaten" naar `/cases`, in alle pagina's.
4. **`assets/l2l-page.css`**: blok CASES onderaan, dezelfde tokens en dezelfde kaartstijl als de rest. Geen enkele bestaande regel aangeraakt.
5. **`sitemap.xml`**: vier URL's erbij, `/cases` op prioriteit 0,9.
6. **`vercel.json`**: redirects `/resultaten`, `/case-studies` en `/cases/index` naar `/cases`.
7. **`llms.txt`**: de vier pagina's toegevoegd aan de lijst met belangrijkste pagina's, met de kerncijfers erbij.

## Nog een punt om over te beslissen

Op de tweede case staat het label **Trainingsbedrijf** boven een quote van **Micah van MIJU-marketing**. Die combinatie stond zo al op de homepage. Op een losse pagina valt hij eerder op. Zeg je welk van de twee klopt, dan pas ik of het label of de quote aan.

## Schrijfstijl

Geen em dashes, geen nadruksaccenten, geen "niet X, maar Y". Het woord ruis komt er niet in voor. Loop de teksten nog even langs je eigen verbodenwoordenlijst, die zit niet in deze sessie.

## Voor je pusht

De pagina's zijn getest op een lokale server: geen dode interne links, geen horizontale scroll op mobiel, JSON-LD valideert, HTML sluit netjes. Wat je zelf nog moet checken na de eerste deploy is of `/cases` en `/cases/neuropage` allebei laden op de preview-URL.

## Ronde 2, 6 september 2026

1. **Case 2 is nu MIJU-marketing.** Het label Trainingsbedrijf is eruit, de quote van Micah blijft. De pagina heet `/cases/miju-marketing`, met een permanente redirect vanaf `/cases/trainingsbedrijf`. Doorgevoerd op de homepagekaart, de hub, de sitemap, llms.txt en de i18n-sleutels.
2. **De 7,9 procent is van die case af gehaald.** Dat cijfer hoort bij het trainingsbureau uit het kennisartikel (2.100 verzonden, 1.224 geopend, 167 reacties), niet bij MIJU. Het is vervangen door 14 dagen tot de vijftiende positieve reactie. Ik heb er geen reply rate voor MIJU voor in de plaats gezet, want die heb ik niet. Heb je hem wel, dan zet ik hem er alsnog in.
3. **De hoogste reply rate is overal 9,1 procent.** Aangepast op de homepage-FAQ, de vergelijkingspagina, het kennisartikel, llms.txt, llms-full.txt en de EN-vertalingen. Er staat nu telkens bij waar het cijfer vandaan komt: de lijsten waar elke prospect een eigen landingspagina kreeg, tegenover 3,2 procent op dezelfde lijst zonder.
4. **De segmenttabel in het kennisartikel blijft staan zoals hij is.** Daar staat 7,9 procent voor het segment coaches, therapeuten en trainers, en dat volgt uit de aantallen ernaast. Dat spreekt de 9,1 niet tegen: het is een segment, geen campagnerecord.
5. **Knop onder de carousel.** "Bekijk alle cases" naar `/cases`, in dezelfde stijl als de andere secundaire knoppen.
6. **Link naar de segmentuitsplitsing losgekoppeld van de MIJU-case**, want die cijfers gaan over een andere klant.

## Fix opmaak casepagina's, 6 september 2026

De casepagina's kwamen zonder kaartopmaak binnen: cijfers en labels plakten aan elkaar, geen kaders, geen kolommen. Oorzaak: de stijl voor die pagina's stond in `assets/l2l-page.css`, en dat bestand staat in `vercel.json` op zeven dagen cache. Browser en CDN serveerden de oude versie zonder het cases-blok, terwijl de HTML wel nieuw was.

Opgelost door de stijl niet meer uit dat bestand te halen. Elke casepagina heeft het blok nu inline in een `<style>` in de head, net zoals de secties op de homepage dat doen. Daarmee kan die opmaak nooit meer uit de pas lopen met de HTML. Het blok is uit `assets/l2l-page.css` verwijderd, en alle pagina's die dat bestand laden hebben nu `?v=2` erachter, zodat de rest ook een verse versie ophaalt.

Let op bij het testen: open de pagina's via een preview-URL of een lokale server, niet door het HTML-bestand aan te klikken. De paden naar `/assets/` zijn absoluut, dus via `file://` laden de nav- en footerstijlen sowieso niet.

## Ronde 3, 8 september 2026

**Belangrijkste vondst eerst:** de Engelse vertaling deed het helemaal niet meer. In `assets/i18n/l2l-i18n-data.js` stonden drie kapotte blokken (twee vertalingen zonder sleutel erboven, en een losse `},`). Dat bestand is JavaScript, dus een enkele syntaxfout zet de hele woordenlijst uit en viel de site bij `?lang=en` volledig terug op Nederlands. Gerepareerd, het bestand parset weer en telt nu 2.012 sleutels. De cachebusters staan op `?v=5`, anders serveert het CDN nog een week de oude versie.

1. **Reactiewidget naast de hero is twee keer zo snel.** Interval van 4.200 naar 2.100 milliseconden. De in- en uitloopanimaties zijn meegeschaald (0,34s en 0,3s) zodat een regel klaar is voordat de volgende valt.
2. **Demi en Anne-Roos staan gecentreerd.** `.team-grid` was een raster van drie kolommen met twee kaarten erin, dus die plakten links. Nu flexbox met `justify-content:center` en een kaartbreedte van 340px. Op mobiel vullen ze de breedte.
3. **Reviews verdelen zich netjes op tablet en telefoon.** De reviews stonden in drie vaste kolommen van 3, 3 en 2. Onder 1000px vielen kolom 1 en 3 samen links: 5 kaarten links, 3 rechts. Nu krijgen de kolommen `display:contents` onder 1000px, waardoor de kaarten zelf rasteritems worden en gelijk verdeeld raken (4 en 4). De Google-kaart onderaan loopt over de volle breedte.
4. **Beeld bij de cases.** Nieuw bestand `assets/l2l-visuals.css` met beeldblokken in de huisstijl: een staafdiagram met afspraken per twee weken (softwarebedrijf), drie segmentbanen met wat er per segment is gebeurd (MIJU) en een mini-landingspagina in een browservenster (Neuropage). Ze staan op de drie casepagina's, als omslag boven elke tegel op `/cases` en als strip in de carousel op de homepage. Alles is opgebouwd met CSS, dus geen externe bestanden, geen extra laadtijd en niets dat kan wegvallen.
5. **Taglines.** Weggehaald waar ze niets toevoegden, herschreven waar ze wel iets uitleggen. "Trotse feedback van onze groeipartners" werd "Dit zeggen klanten over hun campagne", "Maak kennis met het team" werd "Wie je aan de lijn krijgt", "Transparante prijzen zonder verborgen kosten" werd "Wat het kost, en wat je daarvoor krijgt", "Alles wat je wilt weten voordat je boekt" werd "Vragen die we vaak krijgen". De teamkaarten hebben nu een regel over wie wat doet.
6. **Onderlinge links tussen de drie sites.** Onderaan elke inhoudelijke pagina van Link2Leads en Link2Talent staat een blok met twee beschrijvende links naar de zusterbedrijven. Daarnaast staan er contextuele links in de tekst: bij "geen tijd om op te volgen" naar Link2Talent, bij de opstartuitleg naar Link2Talent voor het bellen, en in Over ons naar Link2Group. Link2Group heeft een nieuwe sectie "Verdiepen" met zes diepe links naar cases, kennisbanken en calculators van beide sites.
7. **Accenttekens en kastlijntjes eruit.** "één" en "óf" zijn overal herschreven, ook op Link2Talent en Link2Group.

Getest op 390, 820 en 1440 pixels: geen horizontale scroll, geen JavaScript-fouten, geen dode interne links, en de Engelse versie rendert de nieuwe teksten.

## Ronde 4, 8 september 2026: caps eruit

Alle blauwe labels in hoofdletters boven de koppen zijn weg, op alle drie de sites. Dat waren op Link2Leads dertien `section-pill`-labels (RESULTATEN, HET PROBLEEM, PAKKETTEN, KLANTREVIEWS en de rest), de `hero-kicker` boven de H1 en de regel ZO WERKT HET. Op Link2Talent zeven `tag`-labels plus de `cta-tag` en de voettekst SALESCAPACITEIT OP MAAT. Op Link2Group de twee `section-label`-regels die alleen decoratie waren. De koppen eronder zeggen al wat de sectie is, dus er gaat geen informatie verloren.

De sectie met de vier stappen had alleen dat caps-label als kop en heeft nu een echte H2 gekregen: "Van lijst naar gesprek, in vier stappen".

Verder is `text-transform:uppercase` uit 115 regelsets gehaald, verspreid over alle pagina's van de drie sites. Waar dat gebeurde is de letterafstand teruggezet van 1,5 tot 2,5 pixel naar 0,2, want die brede spatiëring is gemaakt voor kapitalen en valt uit elkaar bij kleine letters. Dat raakt onder meer de kruimelpaden, de kolomtitels in de voettekst, de labels bij formulieren, de case-labels en de stappenlabels in de calculators. Tekst die in de HTML zelf in kapitalen stond is omgezet naar normale schrijfwijze (WEEK 1, MEEST GEKOZEN, SITUATIE 1, de categorielabels in de kennisbank van Link2Talent, en zo verder). Afkortingen blijven staan: FAQ, ROI, IBAN, BIC, SPF, DKIM, DMARC, btw- en KvK-nummers en de klantnaam 2BE IT.

Ook "Eén" met accent is nog op drie plekken weggehaald die de vorige ronde miste.

Cachebusters opgehoogd omdat er weer in de stylesheets is geschreven: `l2l-page.css?v=3`, `l2l-visuals.css?v=2`, `l2l-i18n.js?v=6` en `site.css?v=3` op Link2Talent.

## Ronde 5, 8 september 2026: foto's, koppen en Link2Talent opnieuw opgebouwd

**Op Link2Leads**

De blauwe accenten in de koppen zijn nagelopen op logica. "Wie je aan de lijn krijgt" heeft het accent nu op *aan de lijn* in plaats van op het losse werkwoord, "Vragen die we vaak krijgen" op *Vragen*, "Dit werkt, maar niet voor iedereen" op *niet voor iedereen*, en de kop van de pakkettensectie en de CTA zijn zo herschreven dat het blauwe deel een afgeronde zin is. De twee teamteksten onder Demi en Anne-Roos zijn eruit, net als de zin over Link2Group onder die kop. Het lijstitem over opvolgen viel uit elkaar omdat de lijstregel een flexbox is en de link daarin een los flexitem werd; de link staat nu in de zin onder het blok.

Nieuw: een foto van jullie tweeen boven het contactblok, met een regel eronder over wie er antwoordt.

**Op Link2Group**

Eigen favicon in dezelfde stijl als de andere twee (L2G in plaats van het oude losse logo), als 32, 192 en 180 pixels. De contactknop onderaan ging naar een mailto-link en deed het bij jou niet; die wijst nu naar het contactformulier van Link2Leads, met het mailadres en telefoonnummer als tekstlink eronder. Ook een teamfoto in het fundament-blok, en accenten in twee koppen die er nog niet in zaten.

**Link2Talent, de grootste ingreep**

1. **Lettertype gelijkgetrokken.** De site draaide op Inter terwijl Link2Leads en Link2Group op DM Sans staan. Alles staat nu op DM Sans, inclusief de kennisbank en de cases. De losse DM Mono-lading is eruit.
2. **Kleuren gelijkgetrokken.** De kennis- en casepagina's gebruikten een ander blauw (#4b7cff in plaats van #2F6FED) en andere tekst- en lijnkleuren. Alle tokens komen nu overeen met Link2Leads.
3. **Een te brede CSS-regel gevonden en ingeperkt.** `section > div > div:first-child { text-align:center }` centreerde de eerste kaart in elk raster, waardoor bijvoorbeeld de eerste review als enige gecentreerd stond. Nu worden alleen de sectiekoppen gecentreerd.
4. **Reviews van een halve schuifbalk naar een net raster** van drie kolommen, met een zevende kaart die naar de Google-beoordelingen verwijst. De vierde review liep eerst gewoon het beeld uit.
5. **Teamfoto's vervangen.** Dat waren uitgeknipte figuren op een zwart vlak. Demi en Anne-Roos staan er nu op met dezelfde natuurlijke foto's als op Link2Leads; die van Lodewijk staat op een zachte achtergrond in plaats van hard zwart.
6. **Foto bij de veertien-dagen-sectie**, naast de vier stappen, zodat dat blok niet meer half leeg staat.
7. **Kaartinhoud links uitgelijnd** en de ruimte tussen de secties teruggebracht, zodat het ritme overeenkomt met Link2Leads.
8. **Zes kennisartikelen opnieuw geschreven.** Ze bevatten geen echte inhoud: onder elke kop stonden dezelfde twee alinea's, achtendertig keer over de zes artikelen heen. Ze zijn vervangen door artikelen van 700 tot 950 woorden met een besliskader, een tabel, een checklist en een FAQ, plus Article-, Breadcrumb- en FAQPage-structured-data die er helemaal niet was. Er staan bewust geen verzonnen salarisbedragen in; het kostenartikel geeft een rekenschema dat de lezer zelf invult.
9. **Kennisbank en cases in het sitemapbestand en llms.txt gezet.** Die stonden er niet in, dus die pagina's waren voor Google onvindbaar. Canonieke URL's wezen bovendien naar de .html-variant terwijl Vercel daarvan doorverwijst; alle interne links en canonicals staan nu op de schone URL.
10. **Kruimelpad, byline en een blok met verwante artikelen** onder elk kennisartikel, gelijk aan Link2Leads.
11. **Taalschakelaar en Engelse vertaling.** Dezelfde motor als op Link2Leads, met een eigen woordenboek van 687 teksten dat homepage, kennisbank, cases, calculator en boekingspagina dekt.
12. **JavaScript-fout opgelost** die bij elke scroll optrad: het navigatiescript stond boven de nav in de HTML, dus `document.querySelector('nav')` gaf null. Kwam voor op de homepage, de calculator en de boekingspagina, en dezelfde constructie stond ook op twee pagina's van Link2Leads.
13. **Encoding.** De charset-meta stond op de homepage van Link2Talent voorbij de 1024 bytes die browsers afspeuren, waardoor euro's en pijltjes verkeerd konden renderen. De charset staat nu als eerste in de head op alle pagina's van alle drie de sites.

Cachebusters opgehoogd: `site.css?v=6`, `l2t-i18n.js?v=2` op Link2Talent, en op Link2Leads staan `l2l-page.css?v=3`, `l2l-visuals.css?v=2` en `l2l-i18n.js?v=6`.

## Ronde 6, 8 september 2026

1. **Belknop in de hero.** Onder de Google-badge staat nu een even brede knop met telefoonicoon en het volledige nummer: "Bel ons: 085 080 5381". Badge en knop staan in een kolom van gelijke breedte, op mobiel over de volle breedte.
2. **Blauw accent in de stappenkop**: "Van lijst naar *gesprek*, in vier stappen".
3. **Contactfoto verplaatst.** Die stond linksboven waar hij jullie gezichten halveerde. Hij staat nu bovenaan de rechterkolom boven het formulier, waar toch lege ruimte zat, en is hoger uitgesneden zodat de gezichten er helemaal op staan.
4. **Foto's bij de cases.** Een breed beeld boven de casesoverzichtspagina en per casepagina een eigen foto met een onderschrift dat bij die case past, dus geen herhaling van hetzelfde beeld.
5. **LinkedIn onder de teamfoto's**, met het LinkedIn-icoon in merkkleur, naar jullie beide profielen.
6. **Casekaarten op de homepage compacter**: van 879 naar 655 pixels hoog. De beeldstrip is lager, het onderschrift eronder is weg omdat de tekst het al zegt, en de kop, cijfers, tekst en quote hebben minder ruimte om zich heen. De inhoud is verder ongewijzigd.

Nieuwe teksten zijn ook in het Engelse woordenboek gezet, dat nu 2.023 sleutels telt. Cachebusters op `l2l-visuals.css?v=3` en `l2l-i18n.js?v=7`.

---

## Ronde 7

### Link2Leads

1. **De twee pills onder elkaar in de hero zijn nu even breed en even hoog.** Google-badge en belknop staan allebei op 300 pixels breed en 46 hoog, met dezelfde padding en uitlijning. De verkleining die de badge op tabletbreedte kreeg is eruit, want die maakte ze juist ongelijk.
2. **De foto's in de cases zijn weg.** Zowel het brede beeld boven de casesoverzicht als de foto per casepagina, inclusief de bijbehorende opmaak en de bestanden zelf.
3. **De casekaarten op de homepage staan weer volledig, precies zoals op je screenshots.** Grote visual bovenaan, daaronder het logo met de regel "Case study, klant, pakket", de kop met het blauwe deel, een korte samenvatting, een streep, de drie cijfers naast elkaar en onderaan de link naar de volledige case. De browserbalk bovenop de kaart, het blok "Wat we deden", het onderschrift bij de visual en de quote staan er niet meer in.
4. **Alle te kleine teksten zijn opgehoogd.** Alles onder de 13,5 pixels is over de hele site verhoogd, 227 plekken in totaal: labels van 11 gaan naar 12,5, bijschriften van 12 naar 13,5 en kleine regels van 13 naar 14. Het lettertype is gecontroleerd op elke pagina van alle drie de sites: overal DM Sans, nergens iets anders.
5. **De contactkaart is in balans.** De drie contactknoppen staan nu als een rij van drie onder het formulier in plaats van in de linkerkolom. Links staat de kop, de tekst en de foto, rechts het formulier, en beide kolommen eindigen op dezelfde hoogte.
6. **De herotekst is ingekort** tot twee zinnen: wie we benaderen, waar de reacties binnenkomen en wat jij nog doet. Het pijltje achter "Doe de gratis fitcheck" is overal weg.

### Link2Group

7. Pills weg: de "B2B sales infrastructure" bovenaan en de twee labels boven Link2Leads en Link2Talent.
8. De sectie "Verdiepen" is verwijderd, inclusief het menu-item. De links naar de kennisbank en de cases blijven in de footer staan, dus voor linkbuilding verandert er niets.
9. Zelfde lettertype-gewichten als Link2Leads geladen, en de blauwe accentkleur in de koppen is nu dezelfde lichtere tint als daar.
10. De twee kaarten hadden een vaste minimumhoogte waardoor er een gat onder de opsomming stond. Die is eruit.

### Link2Talent

11. De pill "Remote salescapaciteit" boven de hero is weg.
12. **De hero heeft een rechterkolom gekregen** met een foto van jullie tweeen en een onderschrift. Daarvoor was die helft leeg en stond de tekst in een smalle kolom links.
13. **De branchestrip is geen lopende band meer** maar een nette rij chips onder elkaar gecentreerd, met leesbare tekst in plaats van 12 pixels.
14. De foto bij de aanpak is hoger afgesneden en groter, zodat het hoofd er niet meer half afloopt.
15. **De appsectie is nu een MacBook.** Browserbalk met het adres, een zijmenu met de echte onderdelen van de app en een lijst zonder verzonnen namen. De nepsetters met beschikbaarheidslabels zijn eruit.
16. De Google-score in de hero staat op 4,8 en linkt door naar de reviews, net als op Link2Leads. Ook de reviewkaart onderaan zegt nu 4,8.
17. Lodewijk is uit het team gehaald. Demi en Anne-Roos staan nu gecentreerd naast elkaar.
18. De footerkolommen blijven op tablet en telefoon naast elkaar staan in plaats van onder elkaar, en het zusterbedrijvenblok loopt nu netjes gelijk met de rest van de footer in plaats van breder.

Cachebusters: `l2l-visuals.css?v=4`, `l2l-page.css?v=4`, `l2l-i18n.js?v=8` en `l2t-i18n.js?v=3`.

---

## Ronde 8

### Link2Leads

1. **De staafgrafiek bij de softwarecase zegt nu iets.** Erboven staat waar hij over gaat, "Gekwalificeerde afspraken per twee weken", rechts het totaal "38 in 90 dagen", en boven elke staaf het aantal: 3, 5, 6, 7, 8, 9. Bij elkaar de 38 die eronder als cijfer staat. Zelfde aanpassing op de casepagina zelf.
2. **Foto's terug op de drie casepagina's**, met een onderschrift dat bij die case hoort. Dit gaat om de detailpagina's, niet om de kaarten op de homepage.
3. **Alle zes de kennisartikelen hebben een eigen foto gekregen**, elk met een korte regel eronder die aan het artikel raakt. Zes verschillende beelden, dus geen herhaling.
4. **De pakketnamen zijn groter**: Starter, Growth, Scale en Pro gaan van 14 naar 19 pixels en staan nu in de lichtere blauwtint. De regel eronder van 14 naar 15.
5. **Foto van Demi op de fitcheckpagina**, boven het blokje "Praktisch" in de zijkolom, met de regel dat je Demi of Anne-Roos spreekt en geen accountmanager.

### Link2Group

6. De regel "Twee bedrijven met hetzelfde doel: groei minder afhankelijk maken van toeval." is weg.
7. Het lettertype is DM Sans, hetzelfde als op Link2Leads en Link2Talent, met dezelfde gewichten geladen.

### Link2Talent

8. **De hero is opnieuw opgebouwd in dezelfde volgorde als Link2Leads.** Links de kop, daaronder de subtekst, twee knoppen, een korte grijze regel met de garantie en daaronder de twee gelijke pillen met de Google-score en het telefoonnummer. De blauwe garantiebox en het vinkjeslijstje zijn eruit.
9. **Rechts staat nu een widget van de app** in plaats van de foto: een venster op app.link2talent.nl/matches met drie voorgestelde matches, een uitgelichte match, en de regel dat contract, betaling en communicatie via dezelfde omgeving lopen. Rol en branche in plaats van verzonnen namen. Zelfde opbouw als de mailwidget op Link2Leads.
10. Op mobiel kreeg de blauwe knop de opmaak van de grijze knop, waardoor beide knoppen er hetzelfde uitzagen. Opgelost.

### Alle sites

11. Het Link2Talent-logo op de fitcheckpagina linkte naar Link2Leads. Dat is gecorrigeerd, en het logo in de balk op de homepage van Link2Talent was helemaal niet klikbaar. Alle logo's op alle drie de sites zijn nagelopen en wijzen nu naar hun eigen homepage.

Cachebusters: `l2l-visuals.css?v=5`, `l2l-page.css?v=5`, `l2l-i18n.js?v=9` en `l2t-i18n.js?v=4`. Woordenboeken: 2.032 sleutels op Link2Leads, 709 op Link2Talent.

**Ronde 8b.** De visuals boven de casekaarten op de homepage zijn eruit. De kaarten beginnen nu direct bij het logo en de regel "Case study", en gaan van 664 naar 384 pixels hoog. De grafiek zelf staat nog wel op de casepagina van het softwarebedrijf, waar hij bij de tekst hoort.
