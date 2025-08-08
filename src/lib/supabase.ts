import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PelakuUsaha {
  id: number
  nama_pemilik: string
  jenis_lapak: 'Kios' | 'Los' | 'PKL'
  lokasi: string
  jenis_dagangan: string
  uttp_1_jenis?: string
  uttp_1_merk?: string
  uttp_1_kondisi?: 'Baik' | 'Rusak'
  uttp_1_tahun_tera?: number
  uttp_2_jenis?: string
  uttp_2_merk?: string
  uttp_2_kondisi?: 'Baik' | 'Rusak'
  uttp_2_tahun_tera?: number
  uttp_3_jenis?: string
  uttp_3_merk?: string
  uttp_3_kondisi?: 'Baik' | 'Rusak'
  uttp_3_tahun_tera?: number
  jumlah_te: number
  jumlah_tm: number
  jumlah_cb: number
  jumlah_tbi: number
  jumlah_tf: number
  jumlah_dl: number
  jumlah_at: number
  catatan?: string
  tanggal_tera_terakhir: string
  tanggal_exp_tera: string
  status_tera: 'Aktif' | 'Perlu Tera Ulang' | 'Tidak Aktif'
  created_at: string
  updated_at: string
}

export interface Artikel {
  id: number
  judul: string
  konten: string
  excerpt: string
  gambar_url?: string
  status: 'draft' | 'published'
  author: string
  created_at: string
  updated_at: string
}

export interface Notifikasi {
  pelaku_usaha: any
  id: number
  jenis: 'permohonan_baru' | 'tera_exp_warning' | 'tera_expired'
  judul: string
  pesan: string
  pelaku_usaha_id?: number
  dibaca: boolean
  created_at: string
}

export interface PermohonanTera {
  id: number
  nama_pemohon: string
  email: string
  telepon: string
  jenis_permohonan: 'tera_baru' | 'tera_ulang'
  deskripsi: string
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak'
  created_at: string
}