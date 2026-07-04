import { Hono } from "hono";

const app = new Hono();

const TRIVIA_LIST = [
  "One Piece sudah tayang sejak tahun 1999 dan memiliki lebih dari 1000 episode.",
  "Film anime pertama yang memenangkan Oscar adalah 'Spirited Away' karya Studio Ghibli.",
  "Demon Slayer: Mugen Train menjadi film anime dengan pendapatan tertinggi sepanjang masa.",
  "Nama 'Naruto' sebenarnya diambil dari nama sebuah pusaran air di Selat Naruto, Jepang.",
  "Goku (Dragon Ball) terinspirasi dari karakter Sun Wukong dalam legenda Tiongkok 'Journey to the West'.",
  "Eren Yeager (Attack on Titan) memiliki nama belakang yang berasal dari bahasa Jerman 'Jäger' yang berarti pemburu.",
  "Makoto Shinkai, sutradara Your Name, sering dianggap sebagai penerus Hayao Miyazaki.",
  "L di Death Note tidak pernah terlihat menggunakan komputer standar; dia selalu menggunakan peralatan khusus.",
  "Your Name (Kimi no Na wa) sempat menjadi film anime tersukses di dunia sebelum digeser Demon Slayer.",
  "Kualitas 1080p di Orca dioptimalkan secara cerdas untuk menghemat kuota internet Anda.",
  "Sazae-san adalah seri anime terpanjang yang masih tayang, mulai sejak tahun 1969.",
  "Nama 'Studio Ghibli' berasal dari nama Italia untuk angin Sahara yang panas.",
  "Eiichiro Oda, kreator One Piece, hanya tidur sekitar 3 jam sehari saat masa produksi komik.",
  "Roronoa Zoro adalah satu-satunya kru Topi Jerami yang namanya diambil dari bajak laut asli (Francois l'Olonnais).",
  "Monkey D. Luffy lahir pada tanggal 5 Mei, yang merupakan Hari Anak di Jepang.",
  "Astro Boy adalah seri anime pertama yang populer secara internasional dan mendefinisikan gaya estetika anime.",
  "Istilah 'Otaku' aslinya digunakan sebagai kata ganti orang kedua yang sangat sopan di Jepang.",
  "Akira (1988) menggunakan lebih dari 160.000 sel gambar buatan tangan untuk animasinya.",
  "Satu episode anime rata-rata menghabiskan biaya produksi sekitar 2-4 miliar rupiah.",
  "Sword Art Online awalnya ditulis sebagai novel web untuk mengikuti kompetisi sastra.",
  "Lelouch Vi Britannia (Code Geass) memenangkan penghargaan karakter pria terpopuler selama bertahun-tahun.",
  "Karakter Pikachu (Pokémon) sebenarnya terinspirasi dari tupai, bukan tikus.",
  "Tetsuo (Akira) memiliki jumlah kematian terbanyak dalam satu adegan transformasi.",
  "Sailor Moon awalnya direncanakan hanya tayang untuk satu musim saja.",
  "Studio Madhouse didirikan oleh mantan animator Mushi Pro, termasuk Osamu Tezuka.",
  "Fullmetal Alchemist: Brotherhood setia mengikuti alur manga aslinya, berbeda dengan versi 2003.",
  "Hunter x Hunter sering mengalami hiatus karena kondisi kesehatan pengarangnya, Yoshihiro Togashi.",
  "Saitama (One Punch Man) dinamakan sesuai dengan prefektur tempat tinggal pembuatnya (ONE).",
  "Jujutsu Kaisen menggunakan teknik kutukan yang terinspirasi dari legenda urban nyata di Jepang.",
  "Levi Ackerman (AOT) memiliki golongan darah A dan sangat terobsesi dengan kebersihan.",
  "Karakter Gojo Satoru terinspirasi dari karakter penutup mata di manga klasik Naruto.",
  "Chainsaw Man dibuat oleh Tatsuki Fujimoto yang terkenal dengan gaya penceritaan yang liar.",
  "Neon Genesis Evangelion direkayasa ulang berkali-kali untuk memberikan akhir cerita yang berbeda.",
  "A Silent Voice (Koe no Katachi) mendapatkan pujian karena representasi akurat penyandang disabilitas rungu.",
  "Cowboy Bebop adalah anime pertama yang memadukan musik Jazz dengan tema luar angkasa secara ikonik.",
  "Black Clover awalnya sering dikritik karena teriakan Asta yang terlalu kencang di awal episode.",
  "Kaguya-sama: Love is War memiliki pengisi suara yang sama untuk narator dan beberapa karakter figuran.",
  "Blue Lock dibuat untuk merefleksikan kegagalan tim nasional sepak bola Jepang di masa lalu.",
  "Spy x Family memiliki setting tempat yang terinspirasi dari Jerman pada masa Perang Dingin.",
  "Oshi no Ko membongkar sisi gelap industri hiburan Jepang yang jarang diketahui publik.",
  "Solo Leveling adalah adaptasi manhwa (Korea) pertama yang mendapatkan budget produksi raksasa di Jepang.",
  "Haikyuu!! membantu meningkatkan minat pemuda Jepang terhadap olahraga Voli secara drastis.",
  "My Hero Academia terinspirasi dari komik pahlawan super Amerika seperti Marvel dan DC.",
  "Mob Psycho 100 menekankan pada pengembangan karakter daripada sekadar pertarungan kekuatan.",
  "Vinland Saga didasarkan pada sejarah nyata bangsa Viking di Eropa Utara.",
  "Steins;Gate dianggap sebagai salah satu anime bertema penjelajahan waktu terbaik.",
  "Mushoku Tensei disebut sebagai kakek dari genre Isekai modern.",
  "Frieren: Beyond Journey's End menceritakan kehidupan setelah petualangan pahlawan selesai.",
  "Apothecary Diaries memadukan misteri medis dengan setting kerajaan Tiongkok kuno.",
  "The Boy and the Heron memenangkan Oscar kedua untuk Hayao Miyazaki pada tahun 2024.",
];

app.get("/", (c) => {
  return c.json({
    success: true,
    data: TRIVIA_LIST,
  });
});

app.get("/random", (c) => {
  const random = TRIVIA_LIST[Math.floor(Math.random() * TRIVIA_LIST.length)];
  return c.json({
    success: true,
    trivia: random,
  });
});

export default app;
