import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MADRASAH_SYSTEM_INSTRUCTION = `
Anda adalah "Asisten AI SPMB Madrasah Aliyah Unggulan Al-Ikhlas", asisten pintar pendaftaran murid baru yang ramah, santun, dan islami (mengucapkan salam jika disapa).
Tugas Anda adalah melayani dan menjawab pertanyaan calon siswa atau wali murid seputar:
1. Pendaftaran Siswa Baru (SPMB / PPDB Online) Tahun Ajaran 2026/2027.
2. Jalur Pendaftaran:
   - Jalur Prestasi Tahfidz (Hafalan minimal 3 Juz, bebas tes akademik, beasiswa SPP).
   - Jalur Akademik & Rapor (Rata-rata nilai rapor min. 85 untuk IPA/Agama/Bahasa Inggris).
   - Jalur Reguler (Tes CBT & Wawancara Keislaman).
   - Jalur Afirmasi / KIP (Bantuan biaya pendidikan bagi siswa prasejahtera berprestasi).
3. Jadwal Gelombang:
   - Gelombang 1 (Early Bird): 1 November 2026 - 15 Januari 2027.
   - Gelombang 2 (Reguler): 1 Februari 2027 - 31 Maret 2027.
4. Syarat Dokumen: Scan Akta Kelahiran, Kartu Keluarga, Rapor semester 1-5 / SKL, Pas foto 3x4 latar biru/merah, sertifikat prestasi jika ada.
5. Biaya: Uang pendaftaran Rp 250.000,- (gratis untuk jalur tahfidz 5+ juz & afirmasi). Biaya SPP per bulan terjangkau dengan subsidi silang, asrama Rp 850.000/bulan (termasuk makan 3x sehari dan bimbingan kajian kitab).
6. Program Unggulan: Tahfidzul Qur'an bersanad, Madrasah Riset & Sains Robotika, International Language (Arab & Inggris), Kurikulum Kemenag terintegrasi Cambridge Science.
7. Fasilitas: Smart Classroom ber-AC, Asrama Putra & Putri terpisah, Laboratorium Sains & Komputer modern, Masjid Jami' 2 lantai, Lapangan Olahraga multifungsi, Perpustakaan Digital.

Jawablah dengan bahasa Indonesia yang jelas, ringkas, terstruktur, ramah, dan solutif.
`;

// AI SPMB Chatbot Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
  }

  // If GEMINI_API_KEY is not set, provide an intelligent polite fallback answer
  if (!process.env.GEMINI_API_KEY) {
    const lower = message.toLowerCase();
    let reply = 'Assalamu\'alaikum wr. wb. Terima kasih telah menghubungi Layanan Informasi SPMB Madrasah Unggulan Al-Ikhlas. ';
    
    if (lower.includes('biaya') || lower.includes('uang') || lower.includes('bayar') || lower.includes('spp')) {
      reply += 'Biaya pendaftaran SPMB 2026 adalah Rp 250.000,- (Gratis untuk jalur Tahfidz min. 5 Juz & Jalur Afirmasi). SPP bulanan madrasah adalah Rp 450.000,- dan biaya asrama (boarding) Rp 850.000/bulan termasuk makan 3x sehari serta bimbingan tahfidz intensif.';
    } else if (lower.includes('syarat') || lower.includes('dokumen') || lower.includes('berkas')) {
      reply += 'Dokumen yang perlu diunggah saat pendaftaran online antara lain: (1) Scan Kartu Keluarga, (2) Scan Akta Kelahiran, (3) Rapor/Surat Keterangan Lulus, (4) Pas foto resmi 3x4, dan (5) Piagam/Sertifikat prestasi jika ada.';
    } else if (lower.includes('jadwal') || lower.includes('kapan') || lower.includes('gelombang') || lower.includes('tanggal')) {
      reply += 'Jadwal SPMB 2026 terbagi dalam 2 gelombang: Gelombang 1 dibuka 1 November 2026 s/d 15 Januari 2027 (Jalur Prestasi & Minat Khusus), dan Gelombang 2 dibuka 1 Februari 2027 s/d 31 Maret 2027.';
    } else if (lower.includes('tahfidz') || lower.includes('hafal') || lower.includes('juz')) {
      reply += 'Program Tahfidz Unggulan kami memiliki target hafalan minimal 10-30 Juz bersanad. Tersedia beasiswa penuh bebas SPP bagi pendaftar dengan hafalan minimal 3 Juz saat tes seleksi!';
    } else if (lower.includes('asrama') || lower.includes('boarding') || lower.includes('pondok')) {
      reply += 'Tersedia asrama modern putra dan putri yang terpisah dengan fasilitas kamar ber-AC/ventilasi sehat, pengawasan musyrif/musyrifah 24 jam, makan 3x sehari, dan program kajian kitab kuning.';
    } else if (lower.includes('virtual tour') || lower.includes('kelas') || lower.includes('fasilitas') || lower.includes('ruangan')) {
      reply += 'Anda dapat menjelajahi seluruh sudut madrasah melalui menu "Virtual Tour 360°" di aplikasi ini! Anda bisa melihat ruang kelas digital, laboratorium, masjid, dan asrama secara interaktif 360 derajat.';
    } else {
      reply += 'Untuk informasi lebih lanjut tentang pendaftaran online, Anda bisa langsung mengisi formulir di menu "SPMB Online", atau menghubungi kontak panitia kami via WhatsApp di 0812-3456-7890. Ada hal lain yang bisa kami bantu?';
    }

    return res.json({ reply });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: MADRASAH_SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat memproses jawaban saat ini. Silakan coba kembali.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating response with Gemini:', error);
    return res.status(500).json({
      error: 'Gagal menghubungi server AI.',
      details: error?.message || 'Unknown error',
      fallback: 'Assalamu\'alaikum! Saat ini sistem asisten AI sedang sibuk. Silakan periksa menu Tanya Jawab SPMB atau hubungi panitia via WhatsApp di menu Kontak.'
    });
  }
});

// Production and Development vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Madrasah 360 Server running at http://localhost:${port}`);
  });
}

startServer();
