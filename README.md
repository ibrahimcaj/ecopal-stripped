# 🌱 EcoPal - Gamificirana Aplikacija za Održivost

EcoPal je **gamificirana mobilna aplikacija** dizajnirana za promociju i nagrađivanje ekološki prihvatljivih stilova života. Korisnici izvršavaju dnevne izazove održivosti, šalju dokaze koristeći kameru i zarađuju nagrade za svoje doprinose. Aplikacija koristi **AI verifikaciju**, angažman zajednice i zabavan sistem nagrađivanja kako bi potaknula stvarni uticaj.

## 🚀 Karakteristike

- 🎯 **Dnevni Ekološki Zadaci** - Korisnici izvršavaju dnevne zadatke poput reciklaže, vožnje bicikla umjesto automobila ili štednje energije.
- 📸 **AI-Potvrđena Verifikacija** - Korisnici učitavaju fotografije kao dokaz, a **Gemini AI** potvrđuje izvršenje zadatka.
- 🏆 **Gamifikacija** - Zarađujte XP, napredujte i otključavajte dostignuća za održive akcije.
- 🌍 **Angažman Zajednice** - Dijelite ekološki prihvatljive objave, lajkujte i komentarišite doprinose drugih korisnika.

## 🛠️ Tehnološki Stack

- **Frontend:** React Native (Expo)
- **Backend:** Express.js API
- **Baza Podataka i Autentifikacija:** Firebase
- **AI Verifikacija:** Google Gemini API

## 🏗️ Instalacija i Postavljanje

### Preduslovi

- Java SDK (>= 17)
- Expo CLI (`npm install -g expo-cli`)
- Firebase račun i konfiguracija
- API ključ za Google Gemini

### 1️⃣ Klonirajte repozitorij

```bash
git clone https://github.com/ibrahimcaj/ecopal.git
cd ecopal
```

### 2️⃣ Instalirajte zavisnosti

```bash
yarn
```

### 3️⃣ Konfigurišite Firebase

- Kreirajte Firebase projekat.
- Omogućite **Firestore**, **Autentifikaciju** i **Skladište**.
- Preuzmite `google-services.json` (za Android) i `GoogleService-Info.plist` (za iOS) i postavite ih u `./app` direktorij.

### 4️⃣ Postavite Gemini API ključ kao varijablu okruženja u package.json

```env
GEMINI_API_KEY=vaš_gemini_api_ključ
```

### 5️⃣ Pokrenite razvojni server

```bash
yarn android
```

### 🏆 Pokrenite backend server

```bash
cd backend
npm install
node server.js
```

## 📱 Pokretanje na Uređaju

- Koristite Expo Go aplikaciju na **Android/iOS**.
- Skenirajte QR kod iz `npx expo start` da pokrenete aplikaciju na svom telefonu.
