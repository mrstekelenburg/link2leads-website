**Aanvulling 22 september 2026 (7): llms-full.txt liep zes artikelen achter**
- `llms-full.txt` bevatte de volledige tekst van zes kennispagina's. De pagina `wat-kost-b2b-leadgeneratie` stond er niet in, en de vijf nieuwe pagina's van vandaag ook niet. Alle zes zijn nu toegevoegd in hetzelfde formaat (scheidingslijn, titel, bronlink, kopjes, tabellen met tabs, FAQ als vetgedrukte vragen). Bestand van 69.023 naar 111.829 tekens; datum in de kop naar 22 september 2026. Dit is het bestand dat taalmodellen in zijn geheel ophalen, dus hier zat de grootste blinde vlek.
- `llms.txt` aangevuld met drie dingen die er nog niet in stonden: de omrekening naar prijs per 1.000 verzonden mails (Starter EUR 332, Growth EUR 173, Scale EUR 113, Pro EUR 67) met de vergelijking tegen 22 verzenddagen en de instructie om pakketten op mails per maand te vergelijken; koopsignalen als werkwijze; en eigendom na afloop (teksten en de eigen campagnegegevens blijven bij de klant, verzendomgeving en werkwijze bij Link2Leads).
- `sitemap.xml`: lastmod op 22 september 2026 gezet voor de twaalf pagina's die vandaag zijn gewijzigd.
- Gecontroleerd en al in orde: `robots.txt` staat GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, meta-externalagent, cohere-ai en Bytespider expliciet toe; elke kennispagina heeft Article, Organization, BreadcrumbList en FAQPage in schema.org; de homepage heeft Organization, WebSite, Service met AggregateOffer en vier losse Offers met prijs en looptijd, plus FAQPage; elke pagina opent met een sectie "Het korte antwoord".

**Correctie 22 september 2026: knoptekst blauw op de leespagina's**
- Op alle kennisartikelen, de cases en de andere leespagina's stond de tekst in de knoppen onder het artikel blauw in plaats van wit, dus blauw op een blauwe knop. Oorzaak: de eind-CTA staat binnen `article.prose`, waar de regel `.prose a` elke link blauw en onderstreept maakt. Die regel is specifieker dan `.btn-solid` en won dus. Opgelost met twee regels in `l2l-page.css`: `.prose a.btn-solid` blijft wit en `.prose a.btn-ghost` blijft licht, allebei zonder onderstreping. Cachebuster naar `l2l-page.css?v=7`.
- Nagelopen in de browser over alle leespagina's: geen blauwe knoptekst meer, geen onderstreepte knop.

**Correctie 22 september 2026: knop van de marktscan stond als enige in de ghost-stijl**
- De submitknop "Stuur mij de marktscan" had een eigen klasse `sc-ghost` die hem transparant maakte met een blauwe rand en blauwe tekst, terwijl hij als enige knop in dat formulier staat. Nu gewoon `btn-solid`, blauw met witte tekst, net als "Verstuur je vraag" in het contactformulier en "Reken direct af" op `/leads`. De regels voor `.sc-ghost` zijn uit de stijl gehaald, die klasse werd nergens anders gebruikt.
- Regel voor knoppen, gecontroleerd op alle 24 pagina's: een knop die alleen staat is blauw met witte tekst; staat er een tweede knop naast of onder, dan is de eerste blauw en de tweede transparant met een dunne rand (bijvoorbeeld "Doe de gratis fitcheck" naast "Stel eerst je vraag" in de hero, en de knoppenparen onder elk kennisartikel). Geen andere knop op de site week hiervan af.

**Aanvulling 22 september 2026 (6): kaarttitels in accentblauw**
- Kleine titels op kaarten stonden op veel plekken wit, terwijl de pakketnamen op de prijskaarten blauw zijn. Nu ook blauw (`var(--accent2)`), verder niets veranderd: de vier pakketknoppen en de drie add-on-titels in "Stel je campagne samen", de vier staptitels in "Van lijst naar gesprek" (via `.s4-grid .blk-card .blk-head h3`, de losse `.s4-t`-regel deed niets), de zes kopjes in het accordeon "Garantie en contract", de drie signaaltitels bij koopsignalen, en op `/leads` de kaarttitels (`.lz-card h3`) en optietitels (`.lz-opt-t`). Ook in `l2l-page.css` (v=6 op alle 19 pagina's die het laden): de artikeltitels op de kaarten van `/kennis` (`.kb-card h2`) en de linktitels in "Verder lezen" onder elk artikel (`.related a`). Grote sectiekoppen, FAQ-vragen en "Inbegrepen / Niet inbegrepen" blijven zoals ze waren; de casetegels op `/cases` hadden al een blauw woord in de kop.

**Aanvulling 22 september 2026 (5): maandvolume groot op de pakketkaarten**
- De badge op elke pakketkaart toont nu het maandvolume (3.000 / 7.500 / 15.000 / 30.000 mails per maand); het dagvolume, "30 verzenddagen" en het aantal bedrijven staan in de regel eronder. Reden: wie pakketten van bureaus naast elkaar legt, vergelijkt de prijs met wat er groot op de kaart staat. Bureaus die op werkdagen versturen zetten hun maandvolume groot; met het dagvolume groot viel ons volumeverschil weg in de vergelijking.
- Intro van de prijssectie heeft er een zin bij: "Vergelijk pakketten op mails per maand: wij versturen zeven dagen per week." Geen concurrent genoemd, geen waarschuwing.
- Negen i18n-sleutels. De samensteller-knoppen houden het dagvolume, dat is een keuzeknop en geen vergelijking.

**Correctie 22 september 2026: prijssectie was te druk**
- Vervolg: koopsignalen is geen prijsdetail en hoort niet in een accordeon. Het is nu een eigen sectie `#koopsignalen` tussen de prijzen en "Liever alleen de leadlijst?", in dezelfde opmaak als die leadsectie (gecentreerde kop, een kaart met de drie signalen). De weekendtabel blijft wel een accordeon-item, want dat is een rekensom bij de prijs.
- De twee blokken van vanochtend ("Wij versturen ook in het weekend" en "We mailen op het moment dat er iets verandert") stonden als volledige kaarten tussen de pakketkaarten en de configurator en tussen de configurator en de garantiebalk. De sectie werd daardoor 3.175 pixels hoog en de kaarten raakten los van de configurator waar ze naartoe scrollen. Beide blokken zijn nu accordeon-items onder "Garantie en contract", met dezelfde inhoud (tabel, drie signaalkaarten, voetnoot). Sectie terug naar 2.436 pixels, dus 240 pixels boven de oude hoogte, en dat zit in de extra regel op de pakketkaarten. Ankers `#verzenddagen` en `#koopsignalen` werken nog.
- CSS `.wknd` en `.ksig` verliezen hun eigen kaartstijl binnen `.pa-body`. Twee i18n-sleutels voor de accordeonkoppen.

**Aanvulling 22 september 2026 (4): geen portaal, alles in de eigen mailbox**
- Bewuste keuze tegenover bureaus met een klantportaal: nieuw FAQ-item op de homepage "Krijg ik een portaal of een inlog?" (ook in het FAQPage-schema). Antwoord: alle positieve reacties komen direct in de eigen mailbox, op verzoek elke reactie live, plus de wekelijkse rapportage; geen inlog bij een derde partij.
- Stap 4 van "Van lijst naar gesprek" zegt nu "Alle positieve reacties, of op verzoek elke reactie, direct in je eigen mailbox. Geen portaal, geen inlog".
- Zelfde strekking bij vraag 6 op `/kennis/leadgeneratie-bureau-kiezen` en als regel in `llms.txt`. Vier i18n-sleutels erbij.

**Aanvulling 22 september 2026 (3): eigendom na afloop**
- Artikel 9 van de algemene voorwaarden is omgedraaid. Stond: alle campagnes, teksten en systemen blijven eigendom van Link2Leads. Staat nu: de klant mag de campagneteksten na afloop blijven gebruiken en krijgt de contactgegevens en reacties van de bedrijven uit zijn eigen campagne in een gangbaar bestandsformaat mee. Van Link2Leads blijven de verzendomgeving (domeinen, mailboxen, instellingen), de werkwijze, systemen en interne documentatie. Afmeldingen worden ook na afloop bewaard. Het masterbestand als geheel valt hier bewust buiten: alleen wat in de campagne van die klant is benaderd.
- Homepage, accordeon "Garantie en contract": nieuw blokje "Wat van jou blijft als je stopt" met dezelfde strekking in twee zinnen, boven "Waarom drie maanden minimaal".
- Vier nieuwe i18n-sleutels. `algemene-voorwaarden.html` op `l2l-i18n.js?v=32`.

**Aanvulling 22 september 2026 (2): vijf nieuwe pagina's, regiovraag op /klant**
- Vijf nieuwe pagina's, gebouwd op het sjabloon van de bestaande kennisartikelen (zelfde kop, navigatie, stijlblok, schema.org Article + BreadcrumbList + FAQPage, auteursblok, CTA, "Verder lezen" en footer): `/kennis/acquisitie-uitbesteden` (wat je weggeeft, wat je houdt, kosten, tijdlijn, waar het misgaat), `/kennis/sales-uitbesteden` (drie betekenissen, no cure no pay, rekensom tegenover eigen SDR, waar wij de grens leggen), `/kennis/cold-calling-vs-cold-email` (kosten per gesprek, bereik, wanneer bellen wint, allebei in volgorde), `/kennis/leadgeneratie-bureau-kiezen` (zeven vragen met onze eigen antwoorden, vier antwoorden waarop je wegloopt) en `/leadgeneratie-amsterdam` (lokale pagina met adres, KvK en cases). Geen foto's bovenaan; alle cijfers komen van de bestaande pagina's en cases.
- Kennisbank: vier nieuwe kaarten in `kennis.html` (Amsterdam-pagina niet, die is geen artikel) plus vier extra ItemList-items in het schema. Footerblok "Meer lezen" op alle 23 pagina's uitgebreid met "Acquisitie uitbesteden" en "Bureau kiezen". Vijf url's in `sitemap.xml` en `llms.txt`.
- `/klant`, vraag 5 (regio's): de knoppen "Duitsland" en "Rest van Europa" zijn weg. Er blijven drie keuzes over (Heel Nederland, Vlaanderen en België, Alleen bepaalde provincies of steden). De hint zegt nu dat je mailen buiten Nederland en België in het veld eronder zet, en dat veld heet "Welke provincies, steden of landen precies? (optioneel)". Geen JS-wijziging: het bestaande extra veld `a5x` wordt hergebruikt, dus opslaan, herstellen en versturen werken als voorheen.
- Alle nieuwe zinnen staan met EN-vertaling in `l2l-i18n-data.js` (311 sleutels). De koppen van de acquisitie- en salespagina zijn zo opgebouwd dat het losse fragment "uitbesteden" niet in een span staat, omdat die sleutel elders al als "cost" vertaald is. Versies: `l2l-i18n.js?v=32` op de nieuwe pagina's, `kennis.html` en `klant.html`.
- Hersteld: de Engelse kop van `/klant` las "Tell us what you sell, and and to whom" doordat het fragment "aan wie" als "and to whom" vertaald was. Nu "to whom".

**Aanvulling 22 september 2026: verzenddagen, maandvolume, koopsignalen en wekelijkse rapportage**
- Overal waar "Maandrapportage" stond staat nu "Wekelijkse rapportage": de Starter-kaart, het blok "Altijd inbegrepen" onder de configurator en het accordeonblok "Wat zit er in de prijs?". Ook in `llms.txt` ("Wekelijkse rapportage met het werkelijke aantal verzonden mails"). De rapportage is sinds 17 september bij alle pakketten wekelijks, de site liep daarop achter en gaf een voordeel weg dat concurrenten niet hebben.
- Nieuwe regel `.p-volume-sub` onder de volumebadge op elke pakketkaart: het maandvolume en het aantal benaderde bedrijven. Starter 3.000 mails per maand en circa 1.000 bedrijven, Growth 7.500 en 2.500, Scale 15.000 en 5.000, Pro 30.000 en 10.000. Gerekend met 30 verzenddagen en drie mails per bedrijf (eerste mail plus twee opvolgmails).
- Nieuw blok `.wknd` (`#verzenddagen`) tussen de pakketkaarten en de configurator: "Wij versturen ook in het weekend", met een tabel die de prijs per 1.000 mails zet naast dezelfde maandprijs bij 22 verzenddagen. Starter EUR 332 tegenover EUR 452, Growth EUR 173 tegenover EUR 235, Scale EUR 113 tegenover EUR 154, Pro EUR 67 tegenover EUR 91. Op mobiel (onder 620px) valt de kolom "Per dag" weg zodat de twee prijskolommen naast elkaar passen zonder horizontaal scrollen. Geen enkele concurrent wordt bij naam genoemd.
- Onderbouwing bij dat blok: over 24 juni tot 21 september 2026 ging 27,2 procent van het verzendvolume in het weekend eruit en kwam daar 25,6 procent van de reacties uit. Weekend 0,80 procent reply rate tegenover 0,87 procent doordeweeks, z = -1,78, niet significant. Zondag (0,94 procent) scoort beter dan dinsdag en woensdag, zaterdag (0,68 procent) is de zwakste dag. Weekendvolume is dus geen lege belofte.
- Nieuw blok `.ksig` (`#koopsignalen`) onder de configurator: "We mailen op het moment dat er iets verandert", met drie aanleidingen (openstaande vacature, zichtbare groei, investeren in klanten werven) en een slotregel dat de aanleiding in de onboarding wordt bepaald. Dit benoemt wat er in campagnes al gebeurt en tot nu toe geen naam had.
- Toelichting onder "Kosten per afspraak" op de Nafite-casekaart: "Telemarketing kost in Nederland doorgaans EUR 150 tot EUR 400 per geplande afspraak." Nieuwe CSS-klasse `.cs-stats small.cs-note`. Zet de EUR 134 uit die case af tegen het alternatief in plaats van tegen niets.
- `/cold-email-bureaus-nederland`: nieuwe vraag "Dan: op hoeveel dagen per maand wordt er verstuurd?" in "Hoe je hieruit kiest", met dezelfde omrekening naar prijs per 1.000 mails. De intro van die sectie gaat van vier naar vijf vragen.
- Hersteld: in de sectie "Van lijst naar gesprek" ontbrak de afsluitende `</div>` van `.steps4-inner`, waardoor die div pas bij `</section>` werd gesloten. Browsers corrigeerden dat zelf, dus het beeld verandert niet.
- Alle nieuwe zinnen staan met EN-vertaling in `l2l-i18n-data.js` (50 sleutels). Versies: `l2l-i18n-data.js?v=30`, `l2l-i18n.js?v=32` op `index.html` en `/cold-email-bureaus-nederland`.

**Aanvulling 21 september 2026: vragenlijst op /klant, volgorde en invulvorm**
- De inhoud van de vragen blijft staan; wat verandert is de volgorde, de invulvorm en vier nieuwe vragen voor de fitcheck. Van 15 naar 18 vragen in vijf blokken: wat jullie verkopen (1 en 2), aan wie we mailen (3 t/m 6), waarom klanten kopen (7 t/m 10), de rekensom (11 t/m 14) en praktisch (15 t/m 18).
- Blok 5 is volledig optioneel, met een "Overslaan"-link per vraag: wie de gesprekken voert met telefoonnummer, mailen vanuit persoon of bedrijf, de e-mailhandtekening en de toonwensen. Die stonden eerder tussen en achter de inhoudelijke vragen. Wie ze toch invult, neemt het serieus en heeft de campagne een paar dagen sneller live.
- Samengevoegd: "Wat is het grootste probleem van jullie ideale klant" en "Wat gebeurt er als ze dit probleem niet oplossen" zijn nu vraag 7 ("Welk probleem lossen jullie op, en wat kost het als de klant niets doet?"). Die twee leverden hetzelfde antwoord. Het belangrijkste resultaat, het onderscheidend vermogen en de case met cijfers blijven eigen vragen (8, 9 en 10).
- Nieuw, alle vier aanklikken: waarde van een nieuwe klant in het eerste jaar, huidige kanalen, hoeveel gesprekken per week het team aankan en het gewenste startmoment. Daarmee eindigt het formulier op segment, volume, bedrag en startmoment, dezelfde vier dingen waarop de fitcheck eindigt.
- Van tekstveld naar aanklikknoppen (`.chips`, `.chip`): bedrijfsgrootte en regio, plus de vier nieuwe en de afzendervraag. Bij een enkele keuze schuift het formulier na 260 ms zelf door, behalve als er onder de knoppen nog een invulveld staat (vraag 5).
- "Wie is jullie ideale klant" is "Welke klant zou je morgen tien keer willen hebben" geworden, met in de hint de vraag naar branches waar ze al sterk staan. Dat dwingt segmentatie af in plaats van "iedereen met personeel".
- De referral-vraag stond op het scherm vóór de verzendknop en is naar de bedankpagina verhuisd, samen met een blok "Staat je fitcheck al in de agenda?" met knop naar `/book`. Geen rekensom of verwachting op die pagina.
- De tijdlijn op `/klant` had als laatste stap een bolletje met "15" (restant van het aantal vragen), dat is stap 5 geworden. Website is als veld toegevoegd bij de gegevens.
- Antwoorden worden tussentijds in de browser bewaard (`localStorage`, `l2l_klant_draft_v2`). Wie wegklikt en terugkomt, krijgt een blok "Je was al begonnen" met de keuze tussen verdergaan en opnieuw beginnen. Na het versturen wordt de opslag geleegd en niet opnieuw gevuld.
- `/klant` vult naam, e-mail en bedrijf vooraf in uit de link (`?naam=&email=&bedrijf=`). Alle mails en `/book` geven die parameters mee. Nieuwe helper `M.klantUrl(who)` in `api/_mail.js`, gebruikt door `prepBlock` en door de teksten in `api/book.js` en `api/remind.js`.
- Elke keuzeknop heeft `data-v` met de Nederlandse waarde, zodat wat wij binnenkrijgen Nederlands blijft ook als de bezoeker de site op Engels zet.
- `/book` stap 3: van drie naar vier korte vragen. Waren: ideale klant, regio's, doel 30-60 dagen (met een gat in de ids, `q1`, `q2`, `q4`). Nu: wat verkoop je en aan wie (open), huidige kanalen, waarde van een nieuwe klant en gewenst startmoment (`q1` t/m `q4`, de laatste drie aanklikken). Regio hoort in de volledige vragenlijst en niet in een intake van een minuut.
- De interne mail van `/klant` heeft het startmoment en de klantwaarde in de onderwerpregel en een blok "Waar je op kunt sturen" met startmoment, klantwaarde en capaciteit. Onderwerp is "Vragenlijst ingevuld" in plaats van "Volledige vragenlijst ingevuld".
- Overal waar "15 vragen, ongeveer 10 minuten" stond staat nu "18 vragen, ongeveer 8 minuten, de laatste vier optioneel": `klant.html`, `book.html`, `api/_mail.js` (ook het label "Voorbereiding · 18 vragen · 8 minuten"), `api/book.js` en `api/remind.js`. De interne boekingsmail zegt "de vier korte vragen".
- Alle nieuwe zinnen staan met EN-vertaling in `l2l-i18n-data.js`, inclusief de losse delen van de koppen die in spans staan. Versies: `l2l-i18n-data.js?v=29`, `l2l-i18n.js?v=31`.

**Aanvulling 17 september 2026: fade-in op de leespagina's**
- Nieuw bestand `assets/l2l-reveal.js`, ingeladen met `defer` op `/leads`, `/kennis`, de zes kennisartikelen, `/cases` met de drie cases, en `/cold-email-bureaus-nederland`. Het script laat de directe blokken in `main.page-wrap` een voor een opkomen, met dezelfde beweging als `.reveal` op de homepage (18px omhoog, 0,6s, 55ms tussen blokken onder elkaar).
- Bewust niet toegepast op `/book`, `/klant`, `/calculator-l2l`, `/privacy`, `/algemene-voorwaarden` en `404`. Dat zijn formulier- en naslagpagina's; daar vertraagt beweging alleen waar iemand voor komt.
- Binnen een pagina doen het kruimelpad, de metaregel, de inhoudsopgave en de lopende tekst (`.prose`) niet mee, zodat er niets beweegt terwijl je leest.
- Blokken die bij het laden al in beeld staan krijgen geen fade, dus de bovenkant van de pagina staat er direct. Bij `prefers-reduced-motion` doet het script niets en blijft alles zichtbaar. De opacity wordt alleen door het script gezet, dus zonder JS blijft de pagina gewoon leesbaar.

**Aanvulling 17 september 2026: iconen en garantiebalk op /leads**
- `#gebruik`: de vier kaarten (E-mail, Bellen, LinkedIn, Advertenties en CRM) hebben een lijnicoon in een blauw tegeltje gekregen. Nieuwe CSS: `.lz-card-h`, `.lz-card-ic`, met dezelfde maten en kleuren als `.lz-stat-ic` in de statsbalk. Voor LinkedIn staat er een neutraal netwerkicoon en niet het LinkedIn-beeldmerk.
- Nieuwe garantiebalk `.lz-gar` onder de configurator `#samenstellen`, met de ronde sticker rechtsboven, overgenomen van `.gar-bar` op de homepage. Kop: "Je betaalt alleen voor wat we echt leveren". Inhoud: de 3-procent-aanvulling en de terugstorting bij een te kleine doelgroep, met een link naar `#faq`.
- De `p.lz-sum-note` onder het totaalblok is weg; die tekst staat nu in de garantiebalk. Op mobiel stond die notitie al op `display:none`, dus daar verandert niets.
- Nieuwe en gewijzigde zinnen staan met EN-vertaling in `l2l-i18n-data.js`. Versies: `l2l-i18n-data.js?v=26`, `l2l-i18n.js?v=28`.

**Correctie 17 september 2026: vergelijkblok op /leads klopte niet**
- In "Of laat het e-mailkanaal bij ons" stond bij Campagne uitbesteden "Je krijgt nieuwe gesprekken in je agenda" en "Wij mailen en volgen op, jij voert het gesprek". Dat suggereert dat opvolging en afspraken standaard in het pakket zitten. Er staat nu wat we wel altijd doen: domeinen, mailboxen, warm-up, lijst en teksten, verzenden namens de klant, reacties in zijn eigen mailbox, en opvolging als iets dat hij zelf doet of bij ons laat.
- Kop van dat blok is "de hele campagne" geworden "het e-mailkanaal", zodat het niet klinkt alsof het hele salesproces eronder valt.
- De twee extra landingspagina's van eerder vandaag (/belijsten-kopen en /linkedin-leads-kopen) zijn weer verwijderd, met hun footerlinks, sitemapregels, redirects, llms-tekst en i18n-sleutels. De aanpassing op /leads en de homepage, waarbij leads niet meer als mailproduct worden neergezet, blijft staan.

**Aanvulling 17 september 2026: leads niet meer als mailproduct neergezet**
- `/leads`: H1 is nu "Leads kopen waar je meteen mee aan de slag kunt" (was "meteen mee kunt mailen"). De lede noemt dat telefoonnummer en LinkedIn-profiel aan te vinken zijn en dat de klant zelf bepaalt wat hij ermee doet.
- Nieuwe sectie `#gebruik` boven het gratis sample, met vier kaarten: E-mail, Bellen, LinkedIn, Advertenties en CRM. Gebruikt de bestaande `.lz-cards`/`.lz-card` (2 kolommen, 1 op mobiel), dus geen nieuwe CSS.
- Nieuwe FAQ op `/leads`: "Kan ik de leads ook bellen of via LinkedIn benaderen?", ook toegevoegd aan de FAQPage-JSON-LD. De bestaande vraag over mailen blijft ongewijzigd staan.
- Aangepaste zinnen op `/leads`: de openingszin-verrijking noemt nu ook belscript en LinkedIn-bericht, "Jij mailt en volgt zelf op" is "Jij benadert ze zelf, per mail, telefoon of LinkedIn", "te klein voor koude e-mail" is "te klein voor koude acquisitie", en de tool-FAQ noemt ook de beltool.
- Meta description, og:description en de Service-beschrijving in de JSON-LD van `/leads` noemen nu e-mail, telefoon en LinkedIn.
- Homepage: subregel van het leadblok is "alleen de bedrijven om te benaderen", de paragraaf noemt telefoonnummer en LinkedIn, er staat een extra bullet "Bruikbaar voor mail, telefoon en LinkedIn" en de FAQ "Kan ik ook alleen de leads afnemen?" opent niet meer met "Wil je zelf mailen".
- `llms.txt` en `llms-full.txt`: bij het losse-leadsproduct staat nu dat het bestand niet aan e-mail gebonden is.
- Alle nieuwe en gewijzigde zinnen staan met EN-vertaling in `l2l-i18n-data.js`. Versies: `l2l-i18n-data.js?v=25`, `l2l-i18n.js?v=27`.

**Aanvulling 17 september 2026: korte selectieregel in de mobiele prijsbalk**
- Op mobiel en bij een half scherm stonden alleen het bedrag en de subregel in de balk; de prijsrijen zijn daar verborgen, dus je zag niet meer waar dat bedrag uit bestond. Nu staat er een regel onder het bedrag met de selectie, bijvoorbeeld "Scale + Hyperpersonalisatie + LinkedIn erbij" op de homepage en "5.000 + leads + Telefoonnummer + Openingszin" op `/leads`.
- Homepage: nieuw element `<span class="cfg-sum-sel" id="cfgSel">`, gevuld door `render()` in de configurator. Op desktop verborgen, want daar staan de volledige prijsrijen al.
- `/leads`: nieuw element `<span class="lz-sum-sel" id="lzSel">`, gevuld door `render()` van de bestelconfigurator. Ook alleen zichtbaar onder 900px.
- Elk onderdeel van de regel staat in een eigen `<span>`, zodat de vertaalmachine de losse namen kan omzetten in plaats van de hele regel als een onbekende tekst te laten staan. Losse sleutels toegevoegd voor "Openingszin", "LinkedIn-profiel" en "leads"; de rest stond er al in.
- `l2l-i18n-data.js?v=24`, `l2l-i18n.js?v=26`.

# Wijzigingen, 17 september 2026 (meescrollende prijs op de homepage, LinkedIn live, taal en kennisartikelen)

**Totaalprijs blijft in beeld in "Stel je campagne zelf samen" (homepage)**
- Werkt nu hetzelfde als de configurator op `/leads`. Desktop: het totaalblok is `position:sticky; top:110px` en blijft staan terwijl je langs de pakketknoppen en de add-ons scrollt. Daarvoor is `.cfg-grid` van `align-items:stretch` naar `align-items:start` gegaan, dus het blok is niet langer even hoog als de linkerkolom.
- Mobiel (<=900px): het blok gaat met `order:-1` naar boven en blijft op `top:84px` hangen als compacte balk met bedrag, subregel en de fitcheck-knop. De prijsrijen, de lijst "altijd inbegrepen" en de voetnoot zijn in die balk verborgen.
- Nieuw wrapper-element `.cfg-sum-top` om label, bedrag en subregel, zodat de balk het bedrag en de subregel naast de knop kan zetten. Subregel heeft een korte mobiele variant (`.cfg-sum-per-m`, "per maand, excl. btw"), de lange variant staat op desktop.

**LinkedIn is een echte add-on geworden**
- In de configurator was LinkedIn een grijze regel met "Binnenkort". Nu aanvinkbaar op elk pakket voor 350 per maand (`AO.li` in het script onderaan de sectie; prijs staat op een plek). Gaat mee in de totaalprijs en in `?pakket=&addons=` naar `/book`.
- Bijgewerkt: "Niet inbegrepen" (regel over LinkedIn eruit, telefonische acquisitie blijft), de voetregel onder dat blok, de FAQ over prijzen, en in de JSON-LD de servicebeschrijving, `knowsAbout` en een eigen Offer voor LinkedIn.
- `llms.txt`: nieuw kopje over welke kanalen en modules er geleverd worden (e-mail, LinkedIn, personalisatie per prospect, Full Service op de twee grootste pakketten), LinkedIn in de prijstabel, drie extra FAQ-regels, en "voor wie het niet werkt" klopt weer (LinkedIn stond daar als iets wat we niet doen).

**Top 10-artikel cold email bureaus**
- Bij nummer 1 (wijzelf) stond "Uitsluitend e-mail. Geen LinkedIn-outreach". Dat is eruit. Kanaalkolom is nu "E-mail, LinkedIn erbij als add-on", het profiel beschrijft de drie modules, en de prijsregel noemt de drie add-ons.
- De vergelijkende zinnen elders op de pagina zetten ons op kanaal tegenover de anderen; die kloppen nu.
- Nummering: verwijzingen als "de nummers 1, 2 en 3" en "dan zijn 9 en 11 realistischer" liepen niet meer synchroon met de tabel (die gaat tot 10). Vervangen door bureaunamen, zodat het niet opnieuw stukloopt bij een wijziging.
- `llms-full.txt` had nog een elfde bureau: een profiel zonder naam als nummer 2, waardoor de nummering 1 tot 11 liep terwijl de pagina 10 bureaus heeft. Dat blok is verwijderd en de rest is hernummerd.
- `kennis/cold-email-of-sdr.html`: in de vergelijkingstabel stond bij "uitbesteed" als kanaal alleen "E-mail", nu "E-mail en LinkedIn". De bullet "Alleen e-mail is alleen e-mail" is herschreven.
- Overal "Elf aanbieders" naar "Tien aanbieders".

**Prijzen van losse leads gelijkgetrokken**
- `llms.txt` en `llms-full.txt` noemden 0,10 tot 0,05 per lead met verrijking van 0,02 / 0,03 / 0,08. De staffel op `/leads` is 0,20 / 0,15 / 0,12 / 0,10 met verrijking 0,03 / 0,05 / 0,10. De LLM-bestanden volgen nu de site, plus de gratis sample van tien leads en de suppressielijst.
- De meta description van `/leads` zei "Vanaf 0,05 per lead", en in de JSON-LD stond `lowPrice 0.05 / highPrice 0.10` met een FAQ-antwoord van 0,10 tot 0,05. Nu 0,10 tot 0,20 en het FAQ-antwoord klopt.

**Taal: alles wat tekst is, is nu vertaalbaar**
- De rand "Meest gekozen" op het Scale-pakket zat als `content:'MEEST GEKOZEN'` in de CSS (`.p-card.featured::before`). De vertaalmachine leest alleen tekstnodes en attributen, dus CSS-tekst bleef Nederlands. Nu een echt element `<span class="p-badge">Meest gekozen</span>` in de kaart, met dezelfde opmaak. In de hele repo staat geen tekst meer in `content:`.
- Er waren 443 teksten zonder Engelse versie, verspreid over vrijwel alle pagina's: de hele `/leads`-pagina, de privacyverklaring, artikel 07 van de voorwaarden, de drie cases, `cases/index`, `klant.html`, `book.html`, de navigatie ("Leads kopen", "Hoofdmenu"), de footer ("Reviews van klanten", "Losse leads kopen") en de meeste `<title>`- en meta-descriptions. Allemaal toegevoegd aan `l2l-i18n-data.js`.
- Wat bewust Nederlands blijft: bedrijfsnamen van klanten, plaatsnamen, de voorbeeldrijen in de leadtabel, IBAN en BIC, en het WhatsApp-nummer.
- Cache-busting bijgewerkt: `l2l-i18n-data.js?v=23` en `l2l-i18n.js?v=25` op alle pagina's.

**Na deploy checken**
- Homepage op mobiel: scroll door de pakketsectie en kijk of de prijsbalk blijft hangen zonder de navigatiebalk te overlappen.
- Zet de site op Engels en loop `/leads`, `/privacy`, `/algemene-voorwaarden` en de drie cases na; de rand op Scale moet "Most chosen" zeggen.
- Prijs van LinkedIn staat op 350 in `index.html` (`AO.li`), in `llms.txt`, in `llms-full.txt` en in `cold-email-bureaus-nederland.html`. Wijzigt die, dan die vier plekken.


---

# Wijzigingen, 16 september 2026 (mails uit het systeem: fitcheck overal, opmaak gelijk, herinneringen)

**Vragenlijstblok**
- In alle fitcheck-mails (bevestiging, kopie drie vragen, herinneringen) heet de knop nu "Vul de vragenlijst in" met label "Voorbereiding · 15 vragen · 10 minuten"; "gegevens achterlaten" en "2 minuten" zijn weg. Boodschap overal hetzelfde: vul /klant in voor de beste fitcheck.
- `/book` zelf verwijst nu ook door: het scherm met de drie korte vragen kondigt de vragenlijst aan, en het eindscherm (na antwoorden of overslaan) heeft een blok "Nog een stap: de vragenlijst" met knop naar /klant. Kop "Afspraak bevestigd!" is "Fitcheck bevestigd!". Vertalingen erbij (`l2l-i18n-data.js?v=22`).

**Terminologie**
- Overal in de mails uit `/api` stond "strategiecall" of "strategiegesprek"; de site zegt "fitcheck". Nu overal "gratis fitcheck": boekingsbevestiging (onderwerp, kop, badge, voettekst), interne boekingsmail, kopie van de drie korte vragen, vragenlijst-mail (`/klant`), Outlook-afspraak (onderwerp "Fitcheck Link2Leads x Bedrijf") en de .ics-fallback.
- `/klant`: tijdlijnstap 2 heet "Fitcheck" en de succestekst zegt "in de fitcheck". Engelse vertalingen toegevoegd (`l2l-i18n-data.js?v=21`, `l2l-i18n.js?v=24`).
- Tijdsaanduiding "(CET)" is nu "(Nederlandse tijd)"; CET klopte in de zomer niet.
- "Format: online, link volgt" is overal "Online via Microsoft Teams".

**Tekst- en HTML-versie gelijkgetrokken**
- Kopie van de drie korte vragen: de tekstversie zei "rond de onboarding af", de HTML-versie "vul de volledige vragenlijst in". Nu dezelfde tekst.
- Contactformulier: een aanvraag voor de marktscan of de 10 gratis leads kreeg als kop "je vraag is binnen" en een tekst over "je vraag". Nu heeft elk type (vraag, marktscan, 10 gratis leads, leadaanvraag) een eigen onderwerp, kop, uitleg, vervolgblok en voettekst, gelijk in tekst- en HTML-versie.
- Betaalbevestiging na Mollie (koper en intern) was kale platte tekst; nu dezelfde huisstijl als de andere mails, bedrag als 1.815,00. Ondertekend door Anne-Roos, zoals hij al was.
- Blokafstanden overal via `M.spacer()` in plaats van losse divs met verschillende hoogtes.

**Herinneringen (nieuw: `api/remind.js`)**
- Een dag van tevoren (tussen 23 en 25 uur) en een uur van tevoren (tussen 45 en 75 minuten) gaat er een mail naar de klant en naar NOTIFY_EMAIL. Klantmail: datum, tijd, Teams-knop, blok "vul even je gegevens in zodat we je in de fitcheck gericht kunnen helpen" (link naar /klant). Interne mail: naam, mail, bedrijf, telefoon, Teams-link, link naar de afspraak in Outlook.
- Bron is de Outlook-agenda (MS_CALENDAR_USER). Meetellen: elke afspraak met "Link2Leads" in het onderwerp (boekingen van /book en handmatige uitnodigingen, bijv. "Kennismaking Link2Leads x Bedrijf") of met de categorie "L2L herinnering aan"; de categorie "L2L geen herinnering" sluit uit. Staat er "fitcheck" in het onderwerp dan heet het in de mail fitcheck, anders kennismaking. Duur komt uit de afspraak. Alleen deelnemers van buiten het eigen team krijgen de klantmail. Uitnodigingen die Anne-Roos verstuurt en waar Demi bij zit, staan ook in zijn agenda en tellen dus mee. Na verzending krijgt de afspraak de categorie "L2L herinnering dag verstuurd" of "L2L herinnering uur verstuurd", zodat elke herinnering precies een keer gaat; die categorie zie je ook in Outlook.
- Werkt alleen voor boekingen die echt in de agenda staan (Graph). Bij de .ics-fallback is er geen afspraak en dus geen herinnering; de interne boekingsmail zegt dat er dan handmatig een link gestuurd moet worden.
- Beveiligd met REMIND_SECRET (of Vercels eigen CRON_SECRET). Aanroep: `GET https://link2leads.nl/api/remind?key=<sleutel>`.
- Het endpoint moet elk kwartier worden aangeroepen. Vercel Hobby staat alleen een dagelijkse cron toe, daarom niet in `vercel.json` gezet. Twee opties: (a) cron-job.org, gratis, elk kwartier op bovenstaande URL; (b) op Vercel Pro in `vercel.json` toevoegen: `"crons":[{"path":"/api/remind","schedule":"*/15 * * * *"}]` (dan is de sleutel automatisch CRON_SECRET).
- Bevestigingsmail en succespagina van `/book` zeggen nu dat er een dag en een uur van tevoren een herinnering komt.

**Na deploy checken**
- Env var REMIND_SECRET in Vercel zetten en de cron inrichten (zie boven), anders gaan er geen herinneringen uit.
- Een testboeking doen en beide bevestigingen (klant en intern) nalopen.
- `https://link2leads.nl/api/remind?key=<sleutel>` een keer in de browser openen: antwoord is JSON met `gecontroleerd` en `verstuurd`.

---

# Wijzigingen, 11 september 2026 (scrollen onder footer, sticker mobiel)

- Doorscrollen onder de footer op mobiel: naast de CSS-fix staat nu op elke pagina met footer een klein script dat na het laden (en na elke toevoeging aan de pagina, zoals de chatwidget) controleert of de pagina langer is dan de footer. Zo ja, dan zet het alles wat na de footer is toegevoegd vast in beeld, zodat het geen lengte meer toevoegt. Getest met een statisch blok van 520px, een absoluut blok ver onder de pagina en een schermvullend widgetvlak: pagina eindigt exact bij de footer op home, kennis, privacy en een case.
- 800.000+-sticker: op mobiel zit hij nu net als op desktop schuin over de rechterbovenhoek van de case, kleiner, met extra ruimte bovenin de kaart zodat hij geen tekst afdekt.

---

# Wijzigingen, 11 september 2026 (menubalk overal gelijk)

- Elke pagina heeft nu exact dezelfde menubalk als de homepage, ook 404, privacy, voorwaarden, calculator, /book en /klant: Zo werkt het, Resultaten, Pakketten, Reviews, Kennis, FAQ, Contact, taalkeuze en de knop Gratis fitcheck. Onder 1080px dezelfde hamburger met hetzelfde uitklapmenu.
- Opmaak en script van de balk staan in de pagina zelf (class `l2n`), naast de footerstijl. Getest op 1300, 820 en 390px: de balk staat op alle 19 pagina's op precies dezelfde plek en maat, de taalkeuze zit overal in de balk en het menu klapt overal open.
- Op subpagina's gaat Resultaten naar /cases en staat Kennis of Resultaten gemarkeerd op de eigen sectie. Op de homepage springen de links naar de secties.
- /book: meer ruimte bovenaan zodat de kop niet onder de balk valt.
- Vertaalscript: `l2l-i18n.js?v=23` (plaatst de taalkeuze in de nieuwe balk).

---

# Wijzigingen, 11 september 2026 (na feedback op de deploy)

- E-mailadressen en domeinen (info@link2leads.nl e.d.) blijven gewoon zoals ze waren, zonder aparte opmaak.
- Add-ons: Hyperpersonalisatie en Full Service zijn even breed en hebben dezelfde kaartstijl (de blauwe rand en gloed op Hyperpersonalisatie zijn weg).

---

# Wijzigingen, 11 september 2026 (merknaam, footer, tijdlijn en SEO)

**Merknaam overal hetzelfde**
- Link2Leads, Link2Talent en Link2Group staan op elke pagina als: Link wit en recht, 2 blauw en schuin, Leads/Talent/Group wit en recht. Geldt voor nav, footer en alle lopende tekst. Opmaak (class `l2b`) en de footerstijl staan als `<style id="l2l-shared">` in de head van elke pagina, zodat ze niet afhangen van een apart bestand.
- De vertaalmodule slaat de merknaam over; de tekst eromheen heeft eigen Engelse vertalingen gekregen, zodat de Engelse versie blijft werken.
- Niet aangepast: e-mailadressen en de domeinnaam (link2leads.nl), alt-teksten en paginatitels (kunnen geen opmaak hebben) en de bevestigingsmails uit `/api`.
- OG-image, favicons (32, 192, apple-touch) opnieuw gemaakt met schuine 2. Nieuw: `logo.png` (vierkant, 512px) als logo in de gestructureerde gegevens. Op het OG-image staat nu "Campagne live in week 3".

**Footer**
- Een footer voor alle pagina's, ook privacy, voorwaarden en calculator (hadden een kale versie). Mail en telefoon met icoontje.
- Kolommen: Dienst (nu met Omzetcalculator), Meer lezen, Bedrijf (Over ons, Contact, voorwaarden, privacy).
- Nieuw groepsblok "Onderdeel van Link2Group" met Link2Leads ("Je bent hier") en Link2Talent. Onderbalk met copyright, KvK, BTW en adres als losse items.
- "Over ons" en "Het Team" linkten op privacy en voorwaarden naar `#team`, dat niet meer bestaat. Nu naar `#contact`.

**Homepage**
- Dashboard onder de vier stappen weg (herhaalde de mockup in de hero). De 800.000+-sticker staat nu rechtsboven de cases.
- Tijdlijn opnieuw opgebouwd: labels met uitleg links, balken op een weekraster, legenda bovenaan in vier duidelijke kleuren (grijs wij bouwen, groen jij beslist, blauw campagne draait, blauw gestreept reacties). Week 3 gemarkeerd met "Eerste mail". Livegang als oplopende balk (start op een derde van het volume). Op half scherm blijft het een schema, op mobiel dezelfde grafiek compact onder elk label.
- Contact: sticker "Max. 3 nieuwe klanten per maand" met reden, beide kolommen even hoog, bijschrift "Anne-Roos en Demi" met LinkedIn-icoontjes.
- Chatwidget laadt pas na de pagina of bij de eerste interactie.

**Doorscrollen onder de footer op mobiel**
- Oorzaak: de regel `body > *:not(#bg-canvas):not(nav)` zette alles wat de chatwidget aan de pagina toevoegt in de normale flow, onder de footer. Getest met een nagebootste widget: pagina werd 800px langer. Regel slaat nu alles na de footer over (homepage, privacy, voorwaarden, calculator).

**SEO**
- Titels ingekort tot maximaal ongeveer 65 tekens en omschrijvingen tot ongeveer 158, op 13 pagina's.
- Klantlogo's blijven ingebakken in de homepage (base64). Een eerdere versie zette ze in losse bestanden; teruggedraaid omdat CrudenVision en Nafite na deploy wegvielen.
- FAQ-gegevens voor Google: "Hoeveel reacties kan ik verwachten?" toegevoegd, stond wel op de pagina.
- `cases/neuropage.html` verwijderd; de URL stuurde al door naar `/cases/landingspagina-per-prospect`.
- Nieuwe `404.html` (noindex) met links naar pakketten, cases en kennisbank.
- Postcode overal "1052 HL". Sitemap-datums op 11 september.
- Ontbrekende Engelse vertalingen op de homepage aangevuld (cases, kopjes, Link2Talent-zin).
- Cacheversies: `l2l-i18n.js?v=22`, data `?v=20`.

**Na deploy checken**
- Op je telefoon: kun je nog onder de footer scrollen, en verschijnt de chatknop.
- OG-image verversen in de LinkedIn Post Inspector, anders blijft de oude afbeelding hangen.

---

# Wijzigingen, 10 september 2026 (laatste ronde voor livegang)

- Scale en Pro: "Contractuele garantie op positieve reacties".
- FAQ: "Wat bespreken we in de fitcheck?" vervangen door "Wat gebeurt er nadat iemand positief reageert?" (verschil standaard en Full Service). Ook in het FAQ-schema.
- Footer: dubbele link "Resultaten" weg, "Cases en resultaten" blijft.
- Cacheversies opgehoogd (`l2l-i18n.js?v=21`, data `?v=19`).

---

# Wijzigingen, 10 september 2026 (externe feedback verwerkt)

- **Tijdlijn** staat nu direct onder de vier stappen, als compact blok in plaats van een eigen sectie: kop en subregel op een regel, lagere balken, kleinere letters. Daaronder het dashboard. Anker `#aanpak` blijft werken.
- **Hero-subtekst:** "Jij voert alleen het gesprek" wordt "Jij voert het gesprek".
- **Stap 4** heet "Jij voert de gesprekken" ("alleen" eruit, want bij het standaardpakket volgt de klant zelf op).
- **Scale en Pro:** "Garantie op reacties, in je contract" in plaats van "Garantie op positieve reacties".
- **Reviews:** subtitel "Meer referenties delen we tijdens de fitcheck" weg.
- **Afsluiter:** onder "Maximaal 3 nieuwe klanten per maand" staat weer de reden (eigen verzendomgeving die dagelijks bewaakt wordt).
- **Marktscan:** de knop is een rustige omlijnde knop en het venster heeft geen zware schaduw meer, zodat de fitcheck de hoofdroute blijft.
- Bewust niet overgenomen: marktscan voor de voor-wie-lijst, "Resultaten" hernoemen naar "Cases", andere titel voor de add-ons. Hero ongewijzigd.
- Cacheversies opgehoogd (`l2l-i18n.js?v=20`, data `?v=18`).

---

# Wijzigingen, 10 september 2026 (stappen samengevoegd)

- **"Van lijst naar gesprek, in vier stappen"** gebruikt nu de kaartstijl van de oude drie blokken (blauw nummer, vetgedrukte titel, drie punten met groen vinkje), in een raster van twee bij twee. De drie oude blokken (geen gekochte lijst, domein zonder risico, iemand leest elke reactie) zitten verwerkt in stap 1 tot 3. Stap 4 heeft een blauwe accentrand.
- De regel onder de stappen is een regel geworden: "Standaard positieve reacties in je mailbox. Met Full Service ook de afspraak in je agenda." Het stuk over Link2Talent is eruit.
- **Garantiebalk:** de stempel zit schuin over de rechterbovenhoek geplakt, met schaduw en een lichte glans. De tekst staat gewoon links uitgelijnd. Iets meer ruimte boven het blok zodat de stempel vrij staat.
- Engelse vertalingen toegevoegd, cacheversies opgehoogd (`l2l-i18n.js?v=18`, data `?v=16`).

---

# Wijzigingen, 10 september 2026 (feedbackronde)

- **Stappen "Van lijst naar gesprek":** titels, teksten en vinkjesregels staan nu per rij op dezelfde hoogte in alle vier de kolommen. Teksten ingekort; stap 4 heeft ook een vinkjesregel ("Jij keurt alleen de lijst en de mails goed").
- **Pakketkaarten:** drie korte punten per pakket in plaats van vier tot vijf. Volumeblok alleen nog "100 mails per dag" enzovoort. Minder witruimte tussen de onderdelen.
  - Starter: volledig ingerichte campagne, alleen gekwalificeerde reacties, maandrapportage.
  - Growth: alles uit Starter, segmentatie in je doelgroep, wekelijks bijsturen.
  - Scale: garantie op positieve reacties, alles uit Growth, meerdere segmenten tegelijk.
  - Pro: garantie op positieve reacties, alles uit Scale, vaste campagnemanager.
  - Weggelaten: "Prioriteit bij optimalisatie en support", "Wekelijkse rapportage per segment" (Scale), "Volledige marktdekking" en "Maandelijkse strategiesessie" (Pro).
- **Add-ons:** titel "Haal meer uit je campagne met twee add-ons". Beide kaarten ongeveer 20% lager: compacter voorbeeld, link in de lopende tekst, prijzen als kleine pillen in plaats van grote tegels.
- **Agenda:** rustiger. 7 afspraken over drie tijdsloten, zachtere kleuren, geen groene blokken meer.
- **Afsluiter:** het formulier staat in een eigen blok met de kop "Liever eerst een vraag stellen?", bovenaan uitgelijnd. Mail en telefoon staan daaronder in dezelfde kolom. Geen lege ruimte meer boven en onder het formulier.
- Engelse vertalingen toegevoegd, cacheversies opgehoogd (`l2l-i18n.js?v=16`, data `?v=14`).

---

# Wijzigingen, 10 september 2026 (later): homepage compacter

Van 15 naar 10 onderdelen (hero plus 9 secties). Hero en tijdlijn zijn ongewijzigd.

| Was | Nu |
|---|---|
| Probleemsectie "afhankelijk van via-via" | Weg |
| Vier stappen + "We starten niet met een leadlijst" (drie blokken + dashboard) | Een sectie: de vier stappen, met onder stap 1 tot 3 een bewijsregel met groen vinkje, en het dashboard met de 800.000+ sticker eronder |
| "Dit werkt, maar niet voor iedereen" + losse marktscansectie | Een sectie: de voor-wie-lijst met direct daaronder het marktscanformulier (anker `#marktscan` blijft werken) |
| 8 reviews in drie kolommen | De 4 sterkste (Dick, Micah, Rafael, Arnold) op een rij, met de Google-link als smalle balk eronder |
| 14 FAQ-vragen | 8. Weg: garantie, kosten, kwaliteit van reacties, minimale looptijd (staan in de prijssectie), aparte verzenddomeinen (zelfde als "Loopt mijn domein risico?"), "Werkt dit voor elk bedrijf?" (staat in de voor-wie-sectie). Ook uit het FAQ-schema gehaald waar ze nergens meer zichtbaar zijn |
| Contact + team + "maximaal 3 klanten" + slot-CTA | Een afsluiter: "Klaar om je acquisitie uit te besteden?", label "Maximaal 3 nieuwe klanten per maand", fitcheck-knop, foto met LinkedIn-links van Demi en Anne-Roos, het vraagformulier en mail/telefoon. Anker `#contact` blijft werken; footerlink "Over ons" wijst er nu naar |

Add-ons compacter: titel "Twee add-ons", labels "Op elk pakket" en "Op Scale en Pro" weg, een zin per add-on, "Weinig bureaus bieden dit" naast de titel, link ingekort tot "Bekijk de resultaten".

Engelse vertalingen toegevoegd, cacheversies opgehoogd (`l2l-i18n.js?v=15`, data `?v=13`).

---

# Wijzigingen, 10 september 2026: add-ons in de prijssectie

## Prijssectie (`index.html`)

- De pakketkaarten tonen alleen de pakketprijs. De Full Service-blokjes op Scale en Pro zijn eruit.
- De twee kaartjes Standaard/Full Service boven de prijzen zijn eruit.
- Direct onder de pakketten: "Uit te breiden met twee add-ons" (met "add-ons" in het blauwe accent), twee kaarten naast elkaar.
  - Hyperpersonalisatie, op elk pakket: Starter +€300, Growth +€350, Scale +€450, Pro +€550. Met een voorbeeld van een openingszin en een persoonlijke URL, en een link naar de case.
  - Full Service, op Scale en Pro: +€600 en +€800. Met een volgeplande weekagenda als visual, zodat beide kaarten even hoog zijn.
  - Onderregel: add-ons betaal je per maand, bovenop de pakketprijs. Nergens totalen.
- Opgeschoond tot vijf onderdelen: kop, pakketten, add-ons, garantiebalk, uitklapvragen.
  - Intro ingekort tot: "Een vast bedrag per maand, alles inbegrepen. Minimaal drie maanden, daarna maandelijks opzegbaar."
  - Review boven de prijzen weg (dezelfde quote staat al in de reviewsectie eronder).
  - Scale en Pro hebben als eerste punt "Garantie op positieve reacties", met een groen vinkje.
  - De vergelijking zelf doen/uitbesteden is weer weg; de link naar de rekensom staat in "Wat zit er in de prijs?".
  - Het volumeblok is een halve regel onder de add-ons geworden ("Meer volume nodig? Mail info@link2leads.nl").
  - Het grote garantieblok is een smalle balk geworden, met de stempel. De link "Hoe werkt de garantie?" opent de uitklapvraag.
  - De uitklapvraag "Wat leggen we verder vast in het contract?" heet nu "Garantie en contract" en bevat de volledige garantietekst, inclusief de kleine lettertjes en de link naar de voorwaarden.
- Tussenversies (add-ons als regels in de kaarten, de losse vergelijking zelf doen) zijn teruggedraaid.
- De garantie op positieve reacties blijft bij Scale en Pro horen, los van de add-ons.
- Uitklapvraag "Wat zit er in de prijs?", FAQ "Wat kost het precies?", FAQ-schema en het Offer-schema noemen beide add-ons.

## Case landingspagina per prospect

- `cases/neuropage.html` heet nu `cases/landingspagina-per-prospect.html`. De oude URL stuurt permanent door (`vercel.json`).
- Neuropage wordt op de case, de case-tegel op `/cases` en de case-kaart op de homepage nergens meer genoemd. De bronregel met de link naar neuropage.io is weg.
- De alinea "Dit zit standaard in onze campagnes vanaf het Growth-pakket" is vervangen: het is nu de add-on Hyperpersonalisatie, op elk pakket.
- Afbeelding hernoemd naar `assets/img/case-landingspagina.jpg`. Links in de andere cases, `sitemap.xml` en `llms.txt` bijgewerkt.

## Overig

- `llms.txt`, `llms-full.txt` en `cold-email-bureaus-nederland.html` noemen beide add-ons.
- `llms.txt` zei onder "Wat er niet bij zit" dat er geen garantie op reacties is. Dat klopte niet met de campagnegarantie op Scale en Pro; aangepast.
- Engelse vertalingen voor alle nieuwe teksten toegevoegd. Cacheversies opgehoogd (`l2l-i18n.js?v=14`, data `?v=12`), zodat bezoekers de nieuwe vertalingen direct krijgen.

## Nog open

- Neuropage staat nog als klantlogo in de logocarousel op de homepage (twee keer in de track).

---

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

## 14 september 2026 - Leadspagina

- Nieuwe pagina /leads: losse leadbestanden kopen, met configurator (aantal + verrijking, live prijs), voorbeeldbestand, staffeltabel, aanvulgarantie, herkomstblok, vergelijking met de beheerde campagne, FAQ en aanvraagformulier.
- Menu en footer: item "Leads kopen" toegevoegd op alle pagina's.
- SEO: /leads in sitemap.xml (prioriteit 0.9), canonical, OG-tags, schema (BreadcrumbList, Service met AggregateOffer, FAQPage). Redirects toegevoegd voor /leads-kopen, /b2b-leads-kopen, /leadlijst, /leadlijsten, /adressenbestand en /data. Interne links vanuit de homepage en twee kennisartikelen.
- api/contact.js: type "leads" krijgt een eigen bevestigingsmail (telling en prijs) en een eigen onderwerpregel voor de interne notificatie.
- llms.txt en llms-full.txt: sectie over losse leads toegevoegd.
- privacy.html: nieuwe secties "Waar de gegevens vandaan komen" en "Leadbestanden die wij leveren", rechtsgrond aangevuld met artikel 6 lid 1 sub f en de informatieplicht uit artikel 14, bezwaarrecht en blokkeerlijst uitgeschreven, bewaartermijn voor leaddata toegevoegd, secties hernummerd.
- algemene-voorwaarden.html: nieuw artikel 07 "Losse leadbestanden" met levering, prijs, garanties en de verplichtingen van de opdrachtgever; overige artikelen hernummerd.
