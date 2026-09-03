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
