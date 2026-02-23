"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Lock, QrCode, ClipboardList, FileText, 
  LogOut, Calendar, Printer, CheckCircle, XCircle, 
  AlertTriangle, Save, Search, Menu, Trash2, X, Edit, Moon,
  Info, Loader2  // <--- Pastikan Loader2 dan Info ada di sini
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Html5QrcodeScanner } from "html5-qrcode";

// Hubungkan ke Supabase (Ganti URL dan KEY dengan milikmu dari Settings > API di Supabase)
const supabaseUrl = 'https://wpesevugtidwofhgnokz.supabase.co';
const supabaseKey = 'sb_publishable_cWPGQRaYpX830TIZ7MVIDQ_2FfG5YMC';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- KOMPONEN NOTIFIKASI (TOAST) ---
const ToastNotification = ({ toasts, removeToast }) => {
  return (
    // PERBAIKAN: Posisi fixed di tengah layar (top-1/2 left-1/2)
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-2 pointer-events-none w-full max-w-xs px-4">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`pointer-events-auto flex flex-col items-center justify-center text-center gap-2 p-6 rounded-2xl shadow-2xl text-white transform transition-all duration-300 animate-fade-in-up border-2 border-white/20 backdrop-blur-md ${
            toast.type === 'success' ? 'bg-green-600/95' : 
            toast.type === 'error' ? 'bg-red-600/95' : 'bg-blue-600/95'
          }`}
        >
          {toast.type === 'success' && <CheckCircle size={48} className="text-white mb-2" />}
          {toast.type === 'error' && <XCircle size={48} className="text-white mb-2" />}
          {toast.type === 'info' && <Info size={48} className="text-white mb-2" />}
          
          <div>
            <h4 className="font-bold text-lg">{toast.title}</h4>
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- DATA MOCK ---

const WALI_KELAS_MAP = {
  '7A': { name: 'INTAN SITI NURHAYATI, S.Pd.', nip: '197206301998022001' },
  '7B': { name: 'Dra. Hj. SITI HANAH, S.Pd.I', nip: '196706121994032003' },
  '7C': { name: 'ELIS LIDIANINGSIH, S.Pd.', nip: '198110182025212002' },
  '7D': { name: 'RENDRA PURA SETIA R., S.Pd', nip: '199004182025051002' },
  '7E': { name: 'ALIA HERNIS, S.Ag', nip: '197608112022212010' },
  '7F': { name: 'LILIS NURMILAH, S.Pd.I.', nip: '196610022025212001' },
  '7G': { name: 'ENCEP SUSANTO, S.Pd', nip: '198506122025211005' },
  '8A': { name: 'IKA MUSTIKA RASTUTI, S.Pd', nip: '198105142005012006' },
  '8B': { name: 'IKAH MUDRIKAH SRI LUCIANA, S.Ag', nip: '197110201993032001' },
  '8C': { name: 'RATU KHUMAIROH AINI, S.Pd', nip: '199606142023212035' },
  '8D': { name: 'NENENG SOLIHAH, S.Sos', nip: '197701282007102002' },
  '8E': { name: 'ROSSI RAHMAYANI, M.Pd', nip: '198101292005012006' },
  '8F': { name: 'ESA SUSANTI, S.Pd.', nip: '197502142005012004' },
  '8G': { name: 'YATI NURHAYATI, S.Pd.I', nip: '197310022025212002' },
  '8H': { name: 'RINA NURAENI, S.Pd', nip: '198609192024212023' },
  '9A': { name: 'ARIS AWALUDIN, S.Pd., M.PMat.', nip: '198002262005011004' },
  '9B': { name: 'RATNASARI, S.Pd.', nip: '198603132023212037' },
  '9C': { name: 'SENDI MAULANA, S.Pd.', nip: '199009302023211019' },
  '9D': { name: 'PIA POPIYANA, S,Pd', nip: '199006172023212034' },
  '9E': { name: 'ELIS EVI SUNDANIS, S.Pd', nip: '197107212006042008' },
  '9F': { name: 'YANTI MARYANTI, S.Pd.', nip: '197107112005012002' },
  '9G': { name: 'LILIS MARYANI, S.Ag', nip: '197210202022212005' }
};

const STUDENTS = [
  // --- KELAS 7A ---
  { id: 1, name: 'Ahza Dafi Ardani', class: '7A', code: 'Ahza Dafi Ardani - 7A' },
  { id: 2, name: 'Azrie Ariantri', class: '7A', code: 'Azrie Ariantri - 7A' },
  { id: 3, name: 'Arsy Mutia Bilqies Hidayat', class: '7A', code: 'Arsy Mutia Bilqies Hidayat - 7A' },
  { id: 4, name: 'Fairuz Zahwan', class: '7A', code: 'Fairuz Zahwan - 7A' },
  { id: 5, name: 'Faiz Ahmad Paisal', class: '7A', code: 'Faiz Ahmad Paisal - 7A' },
  { id: 6, name: 'Fathimah Ainun Sholihah', class: '7A', code: 'Fathimah Ainun Sholihah - 7A' },
  { id: 7, name: 'Fauzan Juliandaffa', class: '7A', code: 'Fauzan Juliandaffa - 7A' },
  { id: 8, name: 'Hilda Kania Maharani', class: '7A', code: 'Hilda Kania Maharani - 7A' },
  { id: 9, name: 'Hisni Meila Syamsiah', class: '7A', code: 'Hisni Meila Syamsiah - 7A' },
  { id: 10, name: 'Husna Ghoziyatun Fikriyah', class: '7A', code: 'Husna Ghoziyatun Fikriyah - 7A' },
  { id: 11, name: 'Kaila Nurazni', class: '7A', code: 'Kaila Nurazni - 7A' },
  { id: 12, name: 'Maulidina Mutiara Rezkina Alifiani', class: '7A', code: 'Maulidina Mutiara Rezkina Alifiani - 7A' },
  { id: 13, name: 'Muhammad Reyfhan Zam Zam Zainuri', class: '7A', code: 'Muhammad Reyfhan Zam Zam Z - 7A' },
  { id: 14, name: 'Naila Nurfadilah', class: '7A', code: 'Naila Nurfadilah - 7A' },
  { id: 15, name: 'Nur Aliya Maulida Adibah', class: '7A', code: 'Nur Aliya Maulida Adibah - 7A' },
  { id: 16, name: 'Raditya Muhammad Fauzi', class: '7A', code: 'Raditya Muhammad Fauzi - 7A' },
  { id: 17, name: 'Reisa Sri Rahayu', class: '7A', code: 'Reisa Sri Rahayu - 7A' },
  { id: 18, name: 'Sara Ramadani', class: '7A', code: 'Sara Ramadani - 7A' },
  { id: 19, name: 'Savana Dwi Meilanita Putri', class: '7A', code: 'Savana Dwi Meilanita Putri - 7A' },
  { id: 20, name: 'Sopyan Pebriansah', class: '7A', code: 'Sopyan Pebriansah - 7A' },
  { id: 21, name: 'Syabilla Nur Fadilah', class: '7A', code: 'Syabilla Nur Fadilah - 7A' },

  // --- KELAS 7B ---
  { id: 21, name: 'Ahzaz Riswan Maulana', class: '7B', code: 'Ahzaz Riswan Maulana - 7B' },
  { id: 22, name: 'Alika Sya\'adatullaila', class: '7B', code: 'Alika Sya\'adatullaila - 7B' },
  { id: 23, name: 'Alya Nafisatu Zahra', class: '7B', code: 'Alya Nafisatu Zahra - 7B' },
  { id: 24, name: 'Alya Nisfi Sya\'bani', class: '7B', code: 'Alya Nisfi Sya\'bani - 7B' },
  { id: 25, name: 'Anugerah Prasetya Arinaputra', class: '7B', code: 'Anugerah Prasetya Arinaputra - 7B' },
  { id: 26, name: 'Azriana Adinda Putri', class: '7B', code: 'Azriana Adinda Putri - 7B' },
  { id: 27, name: 'Balqis Rahmatulloh', class: '7B', code: 'Balqis Rahmatulloh - 7B' },
  { id: 28, name: 'Desi Rahayu Putri', class: '7B', code: 'Desi Rahayu Putri - 7B' },
  { id: 29, name: 'Dzakira Aftani Nur Cane', class: '7B', code: 'Dzakira Aftani Nur Cane - 7B' },
  { id: 30, name: 'Elsan Septiana Ismail', class: '7B', code: 'Elsan Septiana Ismail - 7B' },
  { id: 31, name: 'Farzan', class: '7B', code: 'Farzan - 7B' },
  { id: 32, name: 'Futri Sopiyah', class: '7B', code: 'Futri Sopiyah - 7B' },
  { id: 33, name: 'Khaira Alviana Nur Fadilah', class: '7B', code: 'Khaira Alviana Nur Fadilah - 7B' },
  { id: 34, name: 'Meyra Azzahra Anggraeni', class: '7B', code: 'Meyra Azzahra Anggraeni - 7B' },
  { id: 35, name: 'Muhamad Rizky Ismail', class: '7B', code: 'Muhamad Rizky Ismail - 7B' },
  { id: 36, name: 'Muhammad Jibril', class: '7B', code: 'Muhammad Jibril - 7B' },
  { id: 37, name: 'Muhammad Zam Zam Salim', class: '7B', code: 'Muhammad Zam Zam Salim - 7B' },
  { id: 38, name: 'Naijar Fadhil Rahib', class: '7B', code: 'Naijar Fadhil Rahib - 7B' },
  { id: 39, name: 'Nazwa Putri Zatnika', class: '7B', code: 'Nazwa Putri Zatnika - 7B' },
  { id: 40, name: 'Nina Novita', class: '7B', code: 'Nina Novita - 7B' },
  { id: 41, name: 'Raffa Adlhan Davika', class: '7B', code: 'Raffa Adlhan Davika - 7B' },
  { id: 42, name: 'Ramdan Nurzaman', class: '7B', code: 'Ramdan Nurzaman - 7B' },
  { id: 43, name: 'Rania Anila Nazwa', class: '7B', code: 'Rania Anila Nazwa - 7B' },
  { id: 44, name: 'Revan Istiyan', class: '7B', code: 'Revan Istiyan - 7B' },
  { id: 45, name: 'Rijky Sugian', class: '7B', code: 'Rijky Sugian - 7B' },
  { id: 46, name: 'Sa\'ban Hilal', class: '7B', code: 'Sa\'ban Hilal - 7B' },
  { id: 47, name: 'Sulastika Mahesa', class: '7B', code: 'Sulastika Mahesa - 7B' },
  { id: 48, name: 'Syabiq Nur Awali susanto', class: '7B', code: 'Syabiq Nur Awali susanto - 7B' },
  { id: 49, name: 'Tasya Ayunda Permatasari', class: '7B', code: 'Tasya Ayunda Permatasari - 7B' },
  { id: 50, name: 'Tazkia Nuril Haq', class: '7B', code: 'Tazkia Nuril Haq - 7B' },
  { id: 51, name: 'Wildan Fadilah', class: '7B', code: 'Wildan Fadilah - 7B' },
  { id: 52, name: 'Zulfa Maulidya Rustandi', class: '7B', code: 'Zulfa Maulidya Rustandi - 7B' },

  // --- KELAS 7C ---
  { id: 53, name: 'Abiya Galih Al Mukti', class: '7C', code: 'Abiya Galih Al Mukti - 7C' },
  { id: 54, name: 'Akhdan Kafie El Azzam', class: '7C', code: 'Akhdan Kafie El Azzam - 7C' },
  { id: 55, name: 'Alika Zahra Aulia', class: '7C', code: 'Alika Zahra Aulia - 7C' },
  { id: 56, name: 'Alzena Nur Arnilda Setiawan', class: '7C', code: 'Alzena Nur Arnilda Setiawan - 7C' },
  { id: 57, name: 'Alzeta Nur Arnilda Setiawan', class: '7C', code: 'Alzeta Nur Arnilda Setiawan - 7C' },
  { id: 58, name: 'Andara Sri Intania', class: '7C', code: 'Andara Sri Intania - 7C' },
  { id: 59, name: 'Anisa Aprilia Anjani', class: '7C', code: 'Anisa Aprilia Anjani - 7C' },
  { id: 60, name: 'Anugrah', class: '7C', code: 'Anugrah - 7C' },
  { id: 61, name: 'Azkiya Mei Kirana', class: '7C', code: 'Azkiya Mei Kirana - 7C' },
  { id: 62, name: 'Dewi Lestari', class: '7C', code: 'Dewi Lestari - 7C' },
  { id: 63, name: 'Fazar Alfatih', class: '7C', code: 'Fazar Alfatih - 7C' },
  { id: 64, name: 'Ghofar Maulana', class: '7C', code: 'Ghofar Maulana - 7C' },
  { id: 65, name: 'Hafiz Muhammad Haq', class: '7C', code: 'Hafiz Muhammad Haq - 7C' },
  { id: 66, name: 'Hafizh Firdaus Pratama Putra', class: '7C', code: 'Hafizh Firdaus Pratama Putra - 7C' },
  { id: 67, name: 'Mahda Ajaura Sya\'bani', class: '7C', code: 'Mahda Ajaura Sya\'bani - 7C' },
  { id: 68, name: 'Maidar Faujiah', class: '7C', code: 'Maidar Faujiah - 7C' },
  { id: 69, name: 'Muhamad Akbar Maulidan', class: '7C', code: 'Muhamad Akbar Maulidan - 7C' },
  { id: 70, name: 'Muhamad Akhdan Aufa Amrullah', class: '7C', code: 'Muhamad Akhdan Aufa Amrullah - 7C' },
  { id: 71, name: 'Muhamad Akmal Dwi Putra', class: '7C', code: 'Muhamad Akmal Dwi Putra - 7C' },
  { id: 72, name: 'Muhammad Akbar Fauzan', class: '7C', code: 'Muhammad Akbar Fauzan - 7C' },
  { id: 73, name: 'Muhammad Aufa', class: '7C', code: 'Muhammad Aufa - 7C' },
  { id: 74, name: 'Muhammad Fatan Maulidi', class: '7C', code: 'Muhammad Fatan Maulidi - 7C' },
  { id: 75, name: 'Mulyani Rahmawati', class: '7C', code: 'Mulyani Rahmawati - 7C' },
  { id: 76, name: 'Nadhilah Nurjannah', class: '7C', code: 'Nadhilah Nurjannah - 7C' },
  { id: 77, name: 'Naira Layalia', class: '7C', code: 'Naira Layalia - 7C' },
  { id: 78, name: 'Naufal Syamsul Nurwahid', class: '7C', code: 'Naufal Syamsul Nurwahid - 7C' },
  { id: 79, name: 'Rara Cahaya Fitri', class: '7C', code: 'Rara Cahaya Fitri - 7C' },
  { id: 80, name: 'Ridho Fauzan Awaludin', class: '7C', code: 'Ridho Fauzan Awaludin - 7C' },
  { id: 81, name: 'Rifan Perdinan', class: '7C', code: 'Rifan Perdinan - 7C' },
  { id: 82, name: 'Sabila Humaira Ramadhani', class: '7C', code: 'Sabila Humaira Ramadhani - 7C' },
  { id: 83, name: 'Tirta Rizqi Pratama', class: '7C', code: 'Tirta Rizqi Pratama - 7C' },
  { id: 84, name: 'Zaqia Fiqri Maulana', class: '7C', code: 'Zaqia Fiqri Maulana - 7C' },

  // --- KELAS 7D ---
  { id: 85, name: 'Agni Pebriani Epriani', class: '7D', code: 'Agni Pebriani Epriani - 7D' },
  { id: 86, name: 'Alya Kalimatunnisa', class: '7D', code: 'Alya Kalimatunnisa - 7D' },
  { id: 87, name: 'Putri indah permata', class: '7D', code: 'Putri indah permata - 7D' },
  { id: 88, name: 'Ardan Septian', class: '7D', code: 'Ardan Septian - 7D' },
  { id: 89, name: 'Bayu Suryana', class: '7D', code: 'Bayu Suryana - 7D' },
  { id: 90, name: 'Billy Febian Pratama', class: '7D', code: 'Billy Febian Pratama - 7D' },
  { id: 91, name: 'Dini Yanti', class: '7D', code: 'Dini Yanti - 7D' },
  { id: 92, name: 'M. Dava Alamsyah', class: '7D', code: 'M. Dava Alamsyah - 7D' },
  { id: 93, name: 'Miftah mulyana fauzi', class: '7D', code: 'Miftah mulyana fauzi - 7D' },
  { id: 94, name: 'Muhamad Arfan Abdillah', class: '7D', code: 'Muhamad Arfan Abdillah - 7D' },
  { id: 95, name: 'Muhammad Abinaya Alkhalifi', class: '7D', code: 'Muhammad Abinaya Alkhalifi - 7D' },
  { id: 96, name: 'Muhammad Afdad Al Farizi', class: '7D', code: 'Muhammad Afdad Al Farizi - 7D' },
  { id: 97, name: 'Muhammad Alhif Alyari', class: '7D', code: 'Muhammad Alhif Alyari - 7D' },
  { id: 98, name: 'Muhammad Alif Al Kafi', class: '7D', code: 'Muhammad Alif Al Kafi - 7D' },
  { id: 99, name: 'Muhammad Azfar Al Kahfi', class: '7D', code: 'Muhammad Azfar Al Kahfi - 7D' },
  { id: 100, name: 'Muhammad Dabbas Mubarok', class: '7D', code: 'Muhammad Dabbas Mubarok - 7D' },
  { id: 101, name: 'Muhammad Rifki Algani', class: '7D', code: 'Muhammad Rifki Algani - 7D' },
  { id: 102, name: 'Muhammad Zhafran Aqila Firmansyah', class: '7D', code: 'Muhammad Zhafran Aqila Firmansyah - 7D' },
  { id: 103, name: 'Nabila Anandiva Naura', class: '7D', code: 'Nabila Anandiva Naura - 7D' },
  { id: 104, name: 'Naizar Haikal Ilham', class: '7D', code: 'Naizar Haikal Ilham - 7D' },
  { id: 105, name: 'Naufa Dzikria Rabbani', class: '7D', code: 'Naufa Dzikria Rabbani - 7D' },
  { id: 106, name: 'Pirda Novia Septiani', class: '7D', code: 'Pirda Novia Septiani - 7D' },
  { id: 107, name: 'Ragisha Ahmad Gipari', class: '7D', code: 'Ragisha Ahmad Gipari - 7D' },
  { id: 108, name: 'Raka Aprilian', class: '7D', code: 'Raka Aprilian - 7D' },
  { id: 109, name: 'Reihana Adhatul Hidayat', class: '7D', code: 'Reihana Adhatul Hidayat - 7D' },
  { id: 110, name: 'Resti Nurfadillah', class: '7D', code: 'Resti Nurfadillah - 7D' },
  { id: 111, name: 'Restiana Haifa', class: '7D', code: 'Restiana Haifa - 7D' },
  { id: 112, name: 'Reyisa putri', class: '7D', code: 'Reyisa putri - 7D' },
  { id: 113, name: 'Rifal Maulana Malik', class: '7D', code: 'Rifal Maulana Malik - 7D' },
  { id: 114, name: 'Rima Asyaluna', class: '7D', code: 'Rima Asyaluna - 7D' },
  { id: 115, name: 'Syifa Rania', class: '7D', code: 'Syifa Rania - 7D' },
  { id: 116, name: 'Tania Tahtiatul Zannah', class: '7D', code: 'Tania Tahtiatul Zannah - 7D' },

  // --- KELAS 7E ---
  { id: 117, name: 'Amelia Nur Afifah', class: '7E', code: 'Amelia Nur Afifah - 7E' },
  { id: 118, name: 'Annisa Zahra Putri Ependi', class: '7E', code: 'Annisa Zahra Putri Ependi - 7E' },
  { id: 119, name: 'Azril Musyahid', class: '7E', code: 'Azril Musyahid - 7E' },
  { id: 120, name: 'Cepi Angga Hidayat', class: '7E', code: 'Cepi Angga Hidayat - 7E' },
  { id: 121, name: 'Desela Jasnin', class: '7E', code: 'Desela Jasnin - 7E' },
  { id: 122, name: 'Erfina Ash Shila Nugraha', class: '7E', code: 'Erfina Ash Shila Nugraha - 7E' },
  { id: 123, name: 'Mahira Hasna Kamila', class: '7E', code: 'Mahira Hasna Kamila - 7E' },
  { id: 124, name: 'Maisya Kartikasari', class: '7E', code: 'Maisya Kartikasari - 7E' },
  { id: 125, name: 'Mohammad Tsamair Abdul Nasser', class: '7E', code: 'Mohammad Tsamair Abdul Nasser - 7E' },
  { id: 126, name: 'Muhammad Affan Al Farizi', class: '7E', code: 'Muhammad Affan Al Farizi - 7E' },
  { id: 127, name: 'Muhammad Azkiya Banu Wahdan', class: '7E', code: 'Muhammad Azkiya Banu Wahdan - 7E' },
  { id: 128, name: 'Muhammad Fadhil Alfarizky', class: '7E', code: 'Muhammad Fadhil Alfarizky - 7E' },
  { id: 129, name: 'Muhammad Fauzan', class: '7E', code: 'Muhammad Fauzan - 7E' },
  { id: 130, name: 'Muhammad Zaky Mahadika', class: '7E', code: 'Muhammad Zaky Mahadika - 7E' },
  { id: 131, name: 'Nazriel azmi muharram', class: '7E', code: 'Nazriel azmi muharram - 7E' },
  { id: 132, name: 'Perceka Humaira', class: '7E', code: 'Perceka Humaira - 7E' },
  { id: 133, name: 'Raffa Ahsan Assabiq', class: '7E', code: 'Raffa Ahsan Assabiq - 7E' },
  { id: 134, name: 'Raffi Ihsan Assabiq', class: '7E', code: 'Raffi Ihsan Assabiq - 7E' },
  { id: 135, name: 'Raisa Azkia', class: '7E', code: 'Raisa Azkia - 7E' },
  { id: 136, name: 'Rendi Safarudin', class: '7E', code: 'Rendi Safarudin - 7E' },
  { id: 137, name: 'Reyza Aulia', class: '7E', code: 'Reyza Aulia - 7E' },
  { id: 138, name: 'Rifki Fabian Nugraha', class: '7E', code: 'Rifki Fabian Nugraha - 7E' },
  { id: 139, name: 'Rijal Muttaqin', class: '7E', code: 'Rijal Muttaqin - 7E' },
  { id: 140, name: 'Salni Alyani Nugraha', class: '7E', code: 'Salni Alyani Nugraha - 7E' },
  { id: 141, name: 'Salwa Sahila Rhamdani', class: '7E', code: 'Salwa Sahila Rhamdani - 7E' },
  { id: 142, name: 'Sanya Gistian Hadi', class: '7E', code: 'Sanya Gistian Hadi - 7E' },
  { id: 143, name: 'Siti Navisatul Huliyah', class: '7E', code: 'Siti Navisatul Huliyah - 7E' },
  { id: 144, name: 'Syaqila Refa Febriani', class: '7E', code: 'Syaqila Refa Febriani - 7E' },
  { id: 145, name: 'Triana Raisa Hidayanti', class: '7E', code: 'Triana Raisa Hidayanti - 7E' },
  { id: 146, name: 'Vadil Nur Ridwan', class: '7E', code: 'Vadil Nur Ridwan - 7E' },
  { id: 147, name: 'Vicky Vinarya Fahreza', class: '7E', code: 'Vicky Vinarya Fahreza - 7E' },
  { id: 148, name: 'Zahra Uswatun Nisa', class: '7E', code: 'Zahra Uswatun Nisa - 7E' },

  // --- KELAS 7F ---
  { id: 149, name: 'Ai Hanip Robiatul Mahmudah', class: '7F', code: 'Ai Hanip Robiatul Mahmudah - 7F' },
  { id: 150, name: 'Amar Ramdani', class: '7F', code: 'Amar Ramdani - 7F' },
  { id: 151, name: 'Arumsari', class: '7F', code: 'Arumsari - 7F' },
  { id: 152, name: 'Aryo guna saputra', class: '7F', code: 'Aryo guna saputra - 7F' },
  { id: 153, name: 'Azka Danish Alamsyah', class: '7F', code: 'Azka Danish Alamsyah - 7F' },
  { id: 154, name: 'Erlinda Rijabilah Putri', class: '7F', code: 'Erlinda Rijabilah Putri - 7F' },
  { id: 155, name: 'Fauziah Nurul Kamil', class: '7F', code: 'Fauziah Nurul Kamil - 7F' },
  { id: 156, name: 'Ferdiansyah Adriyanto', class: '7F', code: 'Ferdiansyah Adriyanto - 7F' },
  { id: 157, name: 'Fika Kusmana', class: '7F', code: 'Fika Kusmana - 7F' },
  { id: 158, name: 'Gisela Sasabila', class: '7F', code: 'Gisela Sasabila - 7F' },
  { id: 159, name: 'Hafidz Adika Fauzi', class: '7F', code: 'Hafidz Adika Fauzi - 7F' },
  { id: 160, name: 'Haykal Faturahman Awwalin', class: '7F', code: 'Haykal Faturahman Awwalin - 7F' },
  { id: 161, name: 'Herfin Herfandi', class: '7F', code: 'Herfin Herfandi - 7F' },
  { id: 162, name: 'Kenji Alfarizi', class: '7F', code: 'Kenji Alfarizi - 7F' },
  { id: 163, name: 'Keyla Indah Ramadhani', class: '7F', code: 'Keyla Indah Ramadhani - 7F' },
  { id: 164, name: 'Muhammad Ahla Alhijazi', class: '7F', code: 'Muhammad Ahla Alhijazi - 7F' },
  { id: 165, name: 'Muhammad Alif Rizki Maulana', class: '7F', code: 'Muhammad Alif Rizki Maulana - 7F' },
  { id: 166, name: 'Muhammad Azhar Maulidan', class: '7F', code: 'Muhammad Azhar Maulidan - 7F' },
  { id: 167, name: 'Muhammad Rafly Nadhif Pranaja', class: '7F', code: 'Muhammad Rafly Nadhif Pranaja - 7F' },
  { id: 168, name: 'Najma Laila Putri Jamhari', class: '7F', code: 'Najma Laila Putri Jamhari - 7F' },
  { id: 169, name: 'Putri Yasmin Nurfadillah', class: '7F', code: 'Putri Yasmin Nurfadillah - 7F' },
  { id: 170, name: 'Rahma Sakila', class: '7F', code: 'Rahma Sakila - 7F' },
  { id: 171, name: 'Rangga Nugraha', class: '7F', code: 'Rangga Nugraha - 7F' },
  { id: 172, name: 'Reifana Nur Affiani', class: '7F', code: 'Reifana Nur Affiani - 7F' },
  { id: 173, name: 'Reva Mardiatul Wahyuni', class: '7F', code: 'Reva Mardiatul Wahyuni - 7F' },
  { id: 174, name: 'Rifqi Septian', class: '7F', code: 'Rifqi Septian - 7F' },
  { id: 175, name: 'Salwa Mutiara Agustin', class: '7F', code: 'Salwa Mutiara Agustin - 7F' },
  { id: 176, name: 'Tamara Awalia Putri', class: '7F', code: 'Tamara Awalia Putri - 7F' },
  { id: 177, name: 'Waris Muhammad Nasir', class: '7F', code: 'Waris Muhammad Nasir - 7F' },
  { id: 178, name: 'Yasmina Halwa Nurmalina', class: '7F', code: 'Yasmina Halwa Nurmalina - 7F' },
  { id: 179, name: 'Yuris Rahardian Arraji', class: '7F', code: 'Yuris Rahardian Arraji - 7F' },
  { id: 180, name: 'Zahra Aliya Rahma', class: '7F', code: 'Zahra Aliya Rahma - 7F' },

  // --- KELAS 7G ---
  { id: 181, name: 'Adelia Novita Sari', class: '7G', code: 'Adelia Novita Sari - 7G' },
  { id: 182, name: 'Airlangga Abidzar Algifary', class: '7G', code: 'Airlangga Abidzar Algifary - 7G' },
  { id: 183, name: 'Ameera Zalfa Khairunnisa', class: '7G', code: 'Ameera Zalfa Khairunnisa - 7G' },
  { id: 184, name: 'Anisya Lestari Oktavia', class: '7G', code: 'Anisya Lestari Oktavia - 7G' },
  { id: 185, name: 'Ashilla Zafran Nurhafizah', class: '7G', code: 'Ashilla Zafran Nurhafizah - 7G' },
  { id: 186, name: 'Azqia amalia ubaidillah', class: '7G', code: 'Azqia amalia ubaidillah - 7G' },
  { id: 187, name: 'Bilqis Aqila Khairunnisa', class: '7G', code: 'Bilqis Aqila Khairunnisa - 7G' },
  { id: 188, name: 'Fanni Salsabilla', class: '7G', code: 'Fanni Salsabilla - 7G' },
  { id: 189, name: 'Farhan Muzaki', class: '7G', code: 'Farhan Muzaki - 7G' },
  { id: 190, name: 'Ifki Rizqul Barokah', class: '7G', code: 'Ifki Rizqul Barokah - 7G' },
  { id: 191, name: 'Iqbal Sya\'bani Nursalam', class: '7G', code: 'Iqbal Sya\'bani Nursalam - 7G' },
  { id: 192, name: 'Karla Nur Raisa Ganjar Fatimah', class: '7G', code: 'Karla Nur Raisa Ganjar Fatimah - 7G' },
  { id: 193, name: 'Lestari Maulidia', class: '7G', code: 'Lestari Maulidia - 7G' },
  { id: 194, name: 'Muhammad Alif Pratama', class: '7G', code: 'Muhammad Alif Pratama - 7G' },
  { id: 195, name: 'Muhammad Azzam Maula', class: '7G', code: 'Muhammad Azzam Maula - 7G' },
  { id: 196, name: 'Muhammad Farhan Hanafi', class: '7G', code: 'Muhammad Farhan Hanafi - 7G' },
  { id: 197, name: 'Muhammad Taufiq Albaihaqi', class: '7G', code: 'Muhammad Taufiq Albaihaqi - 7G' },
  { id: 198, name: 'Muhammad Wafa Jamil', class: '7G', code: 'Muhammad Wafa Jamil - 7G' },
  { id: 199, name: 'Muhammad Zaidan Sintoarazi', class: '7G', code: 'Muhammad Zaidan Sintoarazi - 7G' },
  { id: 200, name: 'Nizar Abdul Rohim', class: '7G', code: 'Nizar Abdul Rohim - 7G' },
  { id: 201, name: 'Novia Siti Azizah', class: '7G', code: 'Novia Siti Azizah - 7G' },
  { id: 202, name: 'Raissya Anatasya', class: '7G', code: 'Raissya Anatasya - 7G' },
  { id: 203, name: 'Rio Satrio', class: '7G', code: 'Rio Satrio - 7G' },
  { id: 204, name: 'Rizki Saputra', class: '7G', code: 'Rizki Saputra - 7G' },
  { id: 205, name: 'Rizky Aditya Pratama', class: '7G', code: 'Rizky Aditya Pratama - 7G' },
  { id: 206, name: 'Silvie Ananda', class: '7G', code: 'Silvie Ananda - 7G' },
  { id: 207, name: 'Sophan Joehari', class: '7G', code: 'Sophan Joehari - 7G' },
  { id: 208, name: 'Syahila Nur Aprilia', class: '7G', code: 'Syahila Nur Aprilia - 7G' },
  { id: 209, name: 'Taskia Azvi Ramadani Putri', class: '7G', code: 'Taskia Azvi Ramadani Putri - 7G' },
  { id: 210, name: 'Wildan Nugraha', class: '7G', code: 'Wildan Nugraha - 7G' },
  { id: 211, name: 'Zaskia Amelia', class: '7G', code: 'Zaskia Amelia - 7G' },
  { id: 212, name: 'Zulaika Febriani', class: '7G', code: 'Zulaika Febriani - 7G' },

  // --- KELAS 8A ---
  { id: 213, name: 'Agni Syifa Nur Halizza Putri', class: '8A', code: 'Agni Syifa Nur Halizza Putri - 8A' },
  { id: 214, name: 'Alifa Zira Sya\'diah', class: '8A', code: 'Alifa Zira Sya\'diah - 8A' },
  { id: 215, name: 'Alya Febriani Utami', class: '8A', code: 'Alya Febriani Utami - 8A' },
  { id: 216, name: 'Azka Akasyah Abdudi', class: '8A', code: 'Azka Akasyah Abdudi - 8A' },
  { id: 217, name: 'Badruzzaman Al Manaf', class: '8A', code: 'Badruzzaman Al Manaf - 8A' },
  { id: 218, name: 'Dinda Rahmatillah Tsamrotul F', class: '8A', code: 'Dinda Rahmatillah Tsamrotul F - 8A' },
  { id: 219, name: 'Diva Nuraeni Utami', class: '8A', code: 'Diva Nuraeni Utami - 8A' },
  { id: 220, name: 'Fahma Mumtaza ‘Ilma', class: '8A', code: 'Fahma Mumtaza ‘Ilma - 8A' },
  { id: 221, name: 'Firya Aribah Kamila', class: '8A', code: 'Firya Aribah Kamila - 8A' },
  { id: 222, name: 'Linda', class: '8A', code: 'Linda  - 8A' },
  { id: 223, name: 'Meila Farida', class: '8A', code: 'Meila Farida - 8A' },
  { id: 224, name: 'Mochammad Hafidzh Al Mi\'raj', class: '8A', code: 'Mochammad Hafidzh Al Mi\'raj - 8A' },
  { id: 225, name: 'Mochammad Syafiq Sauqi', class: '8A', code: 'Mochammad Syafiq Sauqi - 8A' },
  { id: 226, name: 'Muhammad Faisal Kamil', class: '8A', code: 'Muhammad Faisal Kamil - 8A' },
  { id: 227, name: 'Muharram Akbar Nusantara', class: '8A', code: 'Muharram Akbar Nusantara - 8A' },
  { id: 228, name: 'Rahmi Aulia Nursabani', class: '8A', code: 'Rahmi Aulia Nursabani - 8A' },
  { id: 229, name: 'Razani Aquina Chairunnisa', class: '8A', code: 'Razani Aquina Chairunnisa  - 8A' },
  { id: 230, name: 'Rezira Desclara', class: '8A', code: 'Rezira Desclara - 8A' },
  { id: 231, name: 'Salsa Marisa', class: '8A', code: 'Salsa Marisa - 8A' },
  { id: 232, name: 'Zahira Oktaviani Wahyudi Putri', class: '8A', code: 'Zahira Oktaviani Wahyudi Putri - 8A' },

  // --- KELAS 8B ---
  { id: 233, name: 'Abieladhi Pramana', class: '8B', code: 'Abieladhi Pramana - 8B' },
  { id: 234, name: 'Alzena Husnia Zaida', class: '8B', code: 'Alzena Husnia Zaida - 8B' },
  { id: 235, name: 'Callisa Putri Indarabbihi', class: '8B', code: 'Callisa Putri Indarabbihi - 8B' },
  { id: 236, name: 'Destya Dzakiatunnisa', class: '8B', code: 'Destya Dzakiatunnisa - 8B' },
  { id: 237, name: 'Fatia Muftafilah Khaeriah', class: '8B', code: 'Fatia Muftafilah Khaeriah - 8B' },
  { id: 238, name: 'Fikri Putra Maulana', class: '8B', code: 'Fikri Putra Maulana - 8B' },
  { id: 239, name: 'Ilham Putra Romansyah', class: '8B', code: 'Ilham Putra Romansyah - 8B' },
  { id: 240, name: 'Indira Aprilia', class: '8B', code: 'Indira Aprilia - 8B' },
  { id: 241, name: 'Irdina Shakila', class: '8B', code: 'Irdina Shakila - 8B' },
  { id: 242, name: 'Keisha Senandung Putri Rahayu', class: '8B', code: 'Keisha Senandung Putri Rahayu - 8B' },
  { id: 243, name: 'Muhamad Akhdan Sapari', class: '8B', code: 'Muhamad Akhdan Sapari - 8B' },
  { id: 244, name: 'Muhamad Rafli Ramdani', class: '8B', code: 'Muhamad Rafli Ramdani - 8B' },
  { id: 245, name: 'Muhamad Razka Pratama', class: '8B', code: 'Muhamad Razka Pratama - 8B' },
  { id: 246, name: 'Muhammad Azfa Albara', class: '8B', code: 'Muhammad Azfa Albara - 8B' },
  { id: 247, name: 'Muhammad Khaizuran Ripai Hakim', class: '8B', code: 'Muhammad Khaizuran Ripai Hakim - 8B' },
  { id: 248, name: 'Muhammad Rizky Azka Gunawan', class: '8B', code: 'Muhammad Rizky Azka Gunawan - 8B' },
  { id: 249, name: 'Mustaqim Aziz Husni', class: '8B', code: 'Mustaqim Aziz Husni - 8B' },
  { id: 250, name: 'Najwa Batrisyia Iskandar', class: '8B', code: 'Najwa Batrisyia Iskandar - 8B' },
  { id: 251, name: 'Nisfa Irsa Epsa Matih', class: '8B', code: 'Nisfa Irsa Epsa Matih - 8B' },
  { id: 252, name: 'Olivia Sugara', class: '8B', code: 'Olivia Sugara - 8B' },
  { id: 253, name: 'Prissa Azzhura', class: '8B', code: 'Prissa Azzhura - 8B' },
  { id: 254, name: 'Resa Ananda', class: '8B', code: 'Resa Ananda - 8B' },
  { id: 255, name: 'Revalin Mulki Mutia', class: '8B', code: 'Revalin Mulki Mutia - 8B' },
  { id: 256, name: 'Rifaz Faruq Rahman', class: '8B', code: 'Rifaz Faruq Rahman - 8B' },
  { id: 257, name: 'Riza Pratama', class: '8B', code: 'Riza Pratama - 8B' },
  { id: 258, name: 'Rizki Trimawad Saputra', class: '8B', code: 'Rizki Trimawad Saputra - 8B' },
  { id: 259, name: 'Widiyawati', class: '8B', code: 'Widiyawati - 8B' },
  { id: 260, name: 'Wildan Mubarok', class: '8B', code: 'Wildan Mubarok - 8B' },

  // --- KELAS 8C ---
  { id: 261, name: 'Adhi Putra Yusriansyah', class: '8C', code: 'Adhi Putra Yusriansyah - 8C' },
  { id: 262, name: 'Afrina Hilmi Putri', class: '8C', code: 'Afrina Hilmi Putri - 8C' },
  { id: 263, name: 'Agni Ramdanah', class: '8C', code: 'Agni Ramdanah - 8C' },
  { id: 264, name: 'Ahmad Fikri', class: '8C', code: 'Ahmad Fikri - 8C' },
  { id: 265, name: 'Albani Muhammad Kurniawan', class: '8C', code: 'Albani Muhammad Kurniawan - 8C' },
  { id: 266, name: 'Alya Sandira Putri', class: '8C', code: 'Alya Sandira Putri - 8C' },
  { id: 267, name: 'Alya Shakila Gumilar', class: '8C', code: 'Alya Shakila Gumilar - 8C' },
  { id: 268, name: 'Aris Rizki Akbari', class: '8C', code: 'Aris Rizki Akbari - 8C' },
  { id: 269, name: 'Athaya Nuranjani Krisman', class: '8C', code: 'Athaya Nuranjani Krisman - 8C' },
  { id: 270, name: 'Fathir Syabani Malik Putra', class: '8C', code: 'Fathir Syabani Malik Putra - 8C' },
  { id: 271, name: 'Fawaz Maoludi Akbar', class: '8C', code: 'Fawaz Maoludi Akbar - 8C' },
  { id: 272, name: 'Hafiza Putri Yasmin', class: '8C', code: 'Hafiza Putri Yasmin - 8C' },
  { id: 273, name: 'Hana Lutfiyah', class: '8C', code: 'Hana Lutfiyah - 8C' },
  { id: 274, name: 'Ihsan Suparman', class: '8C', code: 'Ihsan Suparman - 8C' },
  { id: 275, name: 'Irfan Maulana', class: '8C', code: 'Irfan Maulana - 8C' },
  { id: 276, name: 'Laisya Agnia Salsabila', class: '8C', code: 'Laisya Agnia Salsabila - 8C' },
  { id: 277, name: 'Muhammad Arfan Siddiq', class: '8C', code: 'Muhammad Arfan Siddiq - 8C' },
  { id: 278, name: 'Muhammad Rahman Sidik', class: '8C', code: 'Muhammad Rahman Sidik - 8C' },
  { id: 279, name: 'Nandika Ristiawan', class: '8C', code: 'Nandika Ristiawan - 8C' },
  { id: 280, name: 'Nina Jaqiyatu Huda', class: '8C', code: 'Nina Jaqiyatu Huda - 8C' },
  { id: 281, name: 'Rahayu Natali Zahwa', class: '8C', code: 'Rahayu Natali Zahwa - 8C' },
  { id: 282, name: 'Sena Hajniati', class: '8C', code: 'Sena Hajniati - 8C' },
  { id: 283, name: 'Silvana Nur Cahya', class: '8C', code: 'Silvana Nur Cahya - 8C' },
  { id: 284, name: 'Sinta Sri Oktaviani', class: '8C', code: 'Sinta Sri Oktaviani - 8C' },
  { id: 285, name: 'Ulfa Faujiyah', class: '8C', code: 'Ulfa Faujiyah - 8C' },
  { id: 286, name: 'Wiken Alfazri Okta Permana', class: '8C', code: 'Wiken Alfazri Okta Permana - 8C' },

  // --- KELAS 8D ---
  { id: 287, name: 'Adika Imtinan Aminudin', class: '8D', code: 'Adika Imtinan Aminudin - 8D' },
  { id: 288, name: 'Aisha Naqa Qatrunada', class: '8D', code: 'Aisha Naqa Qatrunada - 8D' },
  { id: 289, name: 'Alfin Ramadhan', class: '8D', code: 'Alfin Ramadhan - 8D' },
  { id: 290, name: 'Alip Muzakki', class: '8D', code: 'Alip Muzakki - 8D' },
  { id: 291, name: 'Angga Husaeni Pratama', class: '8D', code: 'Angga Husaeni Pratama - 8D' },
  { id: 292, name: 'Arpan Azka Saputra', class: '8D', code: 'Arpan Azka Saputra - 8D' },
  { id: 293, name: 'Aulia Halimatun Syadiah', class: '8D', code: 'Aulia Halimatun Syadiah - 8D' },
  { id: 294, name: 'Aulia Satwati Anwar', class: '8D', code: 'Aulia Satwati Anwar - 8D' },
  { id: 295, name: 'Devan Mahadika Putra', class: '8D', code: 'Devan Mahadika Putra - 8D' },
  { id: 296, name: 'Fahmi Abdul Azis', class: '8D', code: 'Fahmi Abdul Azis - 8D' },
  { id: 297, name: 'Faiz Akmal Abdilah', class: '8D', code: 'Faiz Akmal Abdilah - 8D' },
  { id: 298, name: 'Faiz Maulana Shiddiq', class: '8D', code: 'Faiz Maulana Shiddiq - 8D' },
  { id: 299, name: 'Fauziah Kamilah', class: '8D', code: 'Fauziah Kamilah - 8D' },
  { id: 300, name: 'Gempar Farhanul Hakim', class: '8D', code: 'Gempar Farhanul Hakim - 8D' },
  { id: 301, name: 'Haura \'Adn', class: '8D', code: 'Haura \'Adn - 8D' },
  { id: 302, name: 'Intan Azzahra Ramadani', class: '8D', code: 'Intan Azzahra Ramadani - 8D' },
  { id: 303, name: 'Karina Septia Sumaryo', class: '8D', code: 'Karina Septia Sumaryo - 8D' },
  { id: 304, name: 'Nadia Amelia Nurshadrina', class: '8D', code: 'Nadia Amelia Nurshadrina - 8D' },
  { id: 305, name: 'Nadiya Intania Apriani', class: '8D', code: 'Nadiya Intania Apriani - 8D' },
  { id: 306, name: 'Natalia Tanjung Safa Kamila', class: '8D', code: 'Natalia Tanjung Safa Kamila - 8D' },
  { id: 307, name: 'Nurdiansyah Suhendar', class: '8D', code: 'Nurdiansyah Suhendar - 8D' },
  { id: 308, name: 'Rifqi Ramdhani C', class: '8D', code: 'Rifqi Ramdhani C - 8D' },
  { id: 309, name: 'Santia Purmalinda', class: '8D', code: 'Santia Purmalinda - 8D' },
  { id: 310, name: 'Shafwa Kamilah Nazhipa', class: '8D', code: 'Shafwa Kamilah Nazhipa - 8D' },
  { id: 311, name: 'Suci Siswati', class: '8D', code: 'Suci Siswati - 8D' },
  { id: 312, name: 'Uli Azni', class: '8D', code: 'Uli Azni - 8D' },

  // --- KELAS 8E ---
  { id: 313, name: 'Abdi Jabar Hidayat', class: '8E', code: 'Abdi Jabar Hidayat - 8E' },
  { id: 314, name: 'Alhya Nur Faadhilah', class: '8E', code: 'Alhya Nur Faadhilah - 8E' },
  { id: 315, name: 'Altisa Oktaviani', class: '8E', code: 'Altisa Oktaviani - 8E' },
  { id: 316, name: 'Andini Nurul Fadilah', class: '8E', code: 'Andini Nurul Fadilah - 8E' },
  { id: 317, name: 'Aqwan Nurzamzam Purnawan', class: '8E', code: 'Aqwan Nurzamzam Purnawan - 8E' },
  { id: 318, name: 'Arfan Maulana Irmawan', class: '8E', code: 'Arfan Maulana Irmawan - 8E' },
  { id: 319, name: 'Azahra Pratami Putri Maulida', class: '8E', code: 'Azahra Pratami Putri Maulida - 8E' },
  { id: 320, name: 'Dhafa Fuji Hamdani', class: '8E', code: 'Dhafa Fuji Hamdani - 8E' },
  { id: 321, name: 'Haesa Putri Kusumah', class: '8E', code: 'Haesa Putri Kusumah - 8E' },
  { id: 322, name: 'Hafiz Harya Ma\'Rufi', class: '8E', code: 'Hafiz Harya Ma\'Rufi - 8E' },
  { id: 323, name: 'Inka Putri Saraswati', class: '8E', code: 'Inka Putri Saraswati - 8E' },
  { id: 324, name: 'Jayin Zahril Vriady', class: '8E', code: 'Jayin Zahril Vriady - 8E' },
  { id: 325, name: 'Kautsar Al Marogi Mukhtar', class: '8E', code: 'Kautsar Al Marogi Mukhtar - 8E' },
  { id: 326, name: 'Marco Arfan Ali', class: '8E', code: 'Marco Arfan Ali - 8E' },
  { id: 327, name: 'Muhamad Fazri Al\'amin', class: '8E', code: 'Muhamad Fazri Al\'amin - 8E' },
  { id: 328, name: 'Muhammad Nizam Hidayatulloh', class: '8E', code: 'Muhammad Nizam Hidayatulloh - 8E' },
  { id: 329, name: 'Muhammad Rizky Noor Hikmah', class: '8E', code: 'Muhammad Rizky Noor Hikmah - 8E' },
  { id: 330, name: 'Naila Maulida', class: '8E', code: 'Naila Maulida - 8E' },
  { id: 331, name: 'Nayra Nurfadillah', class: '8E', code: 'Nayra Nurfadillah - 8E' },
  { id: 332, name: 'Nuri Latifah', class: '8E', code: 'Nuri Latifah  - 8E' },
  { id: 333, name: 'Pahmi Gilang Pratama', class: '8E', code: 'Pahmi Gilang Pratama - 8E' },
  { id: 334, name: 'Rendy Saputra', class: '8E', code: 'Rendy Saputra - 8E' },
  { id: 335, name: 'Reza Aditya', class: '8E', code: 'Reza Aditya - 8E' },
  { id: 336, name: 'Solihatul Ulfah', class: '8E', code: 'Solihatul Ulfah - 8E' },
  { id: 337, name: 'Thalia Fairuz Saori', class: '8E', code: 'Thalia Fairuz Saori - 8E' },
  { id: 338, name: 'Zahra Aprilia', class: '8E', code: 'Zahra Aprilia - 8E' },

  // --- KELAS 8F ---
  { id: 339, name: 'Aliya Rabiyatul Sholihat', class: '8F', code: 'Aliya Rabiyatul Sholihat - 8F' },
  { id: 340, name: 'Allysa Saputri Hermansyah', class: '8F', code: 'Allysa Saputri Hermansyah - 8F' },
  { id: 341, name: 'Alpin Nugraha', class: '8F', code: 'Alpin Nugraha - 8F' },
  { id: 342, name: 'Amelia', class: '8F', code: 'Amelia - 8F' },
  { id: 343, name: 'Arya Pratama', class: '8F', code: 'Aryya Pratama - 8F' },
  { id: 344, name: 'Bilqis Anastasya Gumilar', class: '8F', code: 'Bilqis Anastasya Gumilar - 8F' },
  { id: 345, name: 'Deri Nugraha Ramdani', class: '8F', code: 'Deri Nugraha Ramdani - 8F' },
  { id: 346, name: 'Despa Asipa', class: '8F', code: 'Despa Asipa - 8F' },
  { id: 347, name: 'Dinan Bagja Nugraha', class: '8F', code: 'Dinan Bagja Nugraha - 8F' },
  { id: 348, name: 'Elsa Salsabila', class: '8F', code: 'Elsa Salsabila - 8F' },
  { id: 349, name: 'Fahmi Wahyu Bastian Saputra', class: '8F', code: 'Fahmi Wahyu Bastian Saputra - 8F' },
  { id: 350, name: 'Gathan Albani Pratama', class: '8F', code: 'Gathan Albani Pratama - 8F' },
  { id: 351, name: 'Haikal Mughni Nurdiana', class: '8F', code: 'Haikal Mughni Nurdiana - 8F' },
  { id: 352, name: 'Keysa Munawar', class: '8F', code: 'Keysa Munawar - 8F' },
  { id: 353, name: 'Maulida Nur Fadilah', class: '8F', code: 'Maulida Nur Fadilah - 8F' },
  { id: 354, name: 'Miptah Fauzy', class: '8F', code: 'Miptah Fauzy - 8F' },
  { id: 355, name: 'Muhamad Habil Octa Sopiaji', class: '8F', code: 'Muhamad Habil Octa Sopiaji - 8F' },
  { id: 356, name: 'Muhammad Apsar', class: '8F', code: 'Muhammad Apsar - 8F' },
  { id: 357, name: 'Muhammad Arfa Rizqulloh Saftari', class: '8F', code: 'Muhammad Arfa Rizqulloh Saftari - 8F' },
  { id: 358, name: 'Muhammad Ridwan Basyuni', class: '8F', code: 'Muhammad Ridwan Basyuni - 8F' },
  { id: 359, name: 'Muhammad Rizky Maulana', class: '8F', code: 'Muhammad Rizky Maulana - 8F' },
  { id: 360, name: 'Naya Adella Kasyafani', class: '8F', code: 'Naya Adella Kasyafani - 8F' },
  { id: 361, name: 'Neng Syfa Fitriani Apriliani', class: '8F', code: 'Neng Syfa Fitriani Apriliani - 8F' },
  { id: 362, name: 'Nurul Rohmah Ramadhani', class: '8F', code: 'Nurul Rohmah Ramadhani - 8F' },
  { id: 363, name: 'Raghieb Mukhtar', class: '8F', code: 'Raghieb Mukhtar - 8F' },
  { id: 364, name: 'Salsa Mursyida', class: '8F', code: 'Salsa Mursyida - 8F' },
  { id: 365, name: 'Suci Aprilia Putri Indriani', class: '8F', code: 'Suci Aprilia Putri Indriani - 8F' },
  { id: 366, name: 'Vania Ramadina', class: '8F', code: 'Vania Ramadina - 8F' },

  // --- KELAS 8G ---
  { id: 367, name: 'Adwia Farrennisa', class: '8G', code: 'Adwia Farrennisa - 8G' },
  { id: 368, name: 'Agus Mandiri', class: '8G', code: 'Agus Mandiri - 8G' },
  { id: 369, name: 'Amel Septia Maharani', class: '8G', code: 'Amel Septia Maharani - 8G' },
  { id: 370, name: 'Arfan Muhammad Mahmudin', class: '8G', code: 'Arfan Muhammad Mahmudin - 8G' },
  { id: 371, name: 'Denia Adelia Putri', class: '8G', code: 'Denia Adelia Putri - 8G' },
  { id: 372, name: 'Dzikri Firmansyah', class: '8G', code: 'Dzikri Firmansyah - 8G' },
  { id: 373, name: 'Eva Fauziah Apriliani', class: '8G', code: 'Eva Fauziah Apriliani - 8G' },
  { id: 374, name: 'Fathir Maula', class: '8G', code: 'Fathir Maula - 8G' },
  { id: 375, name: 'Keysha Natasha Putri', class: '8G', code: 'Keysha Natasha Putri - 8G' },
  { id: 376, name: 'Maprisa Nur Rijqiah', class: '8G', code: 'Maprisa Nur Rijqiah - 8G' },
  { id: 377, name: 'Muhammad Alwi Taftazani', class: '8G', code: 'Muhammad Alwi Taftazani - 8G' },
  { id: 378, name: 'Muhammad Azmi Ali Sya\'ban', class: '8G', code: 'Muhammad Azmi Ali Sya\'ban - 8G' },
  { id: 379, name: 'Muhammad Hakam Al Birsa', class: '8G', code: 'Muhammad Hakam Al Birsa - 8G' },
  { id: 380, name: 'Muhammad Irsyad Bahir', class: '8G', code: 'Muhammad Irsyad Bahir - 8G' },
  { id: 381, name: 'Muhammad Najman Azmanil Kirom', class: '8G', code: 'Muhammad Najman Azmanil Kirom - 8G' },
  { id: 382, name: 'Muhammad Sahal', class: '8G', code: 'Muhammad Sahal - 8G' },
  { id: 383, name: 'Muhammad Yusuf Arghabilly', class: '8G', code: 'Muhammad Yusuf Arghabilly - 8G' },
  { id: 384, name: 'Najma Aulia Destia Sopiyani', class: '8G', code: 'Najma Aulia Destia Sopiyani - 8G' },
  { id: 385, name: 'Nazwan Azhim Muntazhar', class: '8G', code: 'Nazwan Azhim Muntazhar - 8G' },
  { id: 386, name: 'Nuri Maulida', class: '8G', code: 'Nuri Maulida - 8G' },
  { id: 387, name: 'Putri Mahasin', class: '8G', code: 'Putri Mahasin - 8G' },
  { id: 388, name: 'Radhika Mulya Anggadipraja', class: '8G', code: 'Radhika Mulya Anggadipraja - 8G' },
  { id: 389, name: 'Resi Fauziah', class: '8G', code: 'Resi Fauziah - 8G' },
  { id: 390, name: 'Rizky Fauzan Al\'rasid', class: '8G', code: 'Rizky Fauzan Al\'rasid - 8G' },
  { id: 391, name: 'Syaadatu Setiawan', class: '8G', code: 'Syaadatu Setiawan - 8G' },
  { id: 392, name: 'Tita Aprillia Uswatun Hasanah', class: '8G', code: 'Tita Aprillia Uswatun Hasanah - 8G' },
  { id: 393, name: 'Veby Puji Ramadhani', class: '8G', code: 'Veby Puji Ramadhani - 8G' },

  // --- KELAS 8H ---
  { id: 394, name: 'Atha Jamila Nurkamila', class: '8H', code: 'Atha Jamila Nurkamila - 8H' },
  { id: 395, name: 'Azka Muhammad Dzakir', class: '8H', code: 'Azka Muhammad Dzakir - 8H' },
  { id: 396, name: 'Azmi Muhammad', class: '8H', code: 'Azmi Muhammad - 8H' },
  { id: 397, name: 'Deviona Liu Claudia', class: '8H', code: 'Deviona Liu Claudia - 8H' },
  { id: 398, name: 'Dzulhyans Fuziady Mulyawan', class: '8H', code: 'Dzulhyans Fuziady Mulyawan - 8H' },
  { id: 399, name: 'Fahrisa Zahwa Maharani', class: '8H', code: 'Fahrisa Zahwa Maharani - 8H' },
  { id: 400, name: 'Fikri Firmansyah', class: '8H', code: 'Fikri Firmansyah - 8H' },
  { id: 401, name: 'Fitra Ramadhan', class: '8H', code: 'Fitra Ramadhan - 8H' },
  { id: 402, name: 'Indri Nuraini', class: '8H', code: 'Indri Nuraini - 8H' },
  { id: 403, name: 'Jani Agus Ramdani', class: '8H', code: 'Jani Agus Ramdani - 8H' },
  { id: 404, name: 'Latika Laxmi', class: '8H', code: 'Latika Laxmi - 8H' },
  { id: 405, name: 'Mahesa Agastya', class: '8H', code: 'Mahesa Agastya - 8H' },
  { id: 406, name: 'Muhamad Febri Rahmi Aminulloh', class: '8H', code: 'Muhamad Febri Rahmi Aminulloh - 8H' },
  { id: 407, name: 'Muhamad Syahlan Abdul Latif', class: '8H', code: 'Muhamad Syahlan Abdul Latif - 8H' },
  { id: 408, name: 'Muhammad Ari Pratama', class: '8H', code: 'Muhammad Ari Pratama - 8H' },
  { id: 409, name: 'Muhammad Khoirul Azam', class: '8H', code: 'Muhammad Khoirul Azam - 8H' },
  { id: 410, name: 'Mutifa Almusawa Nurawaliah', class: '8H', code: 'Mutifa Almusawa Nurawaliah - 8H' },
  { id: 411, name: 'Naysha Marfuatun Nasiah', class: '8H', code: 'Naysha Marfuatun Nasiah - 8H' },
  { id: 412, name: 'Nita Oktavia Sudrajat', class: '8H', code: 'Nita Oktavia Sudrajat - 8H' },
  { id: 413, name: 'Nizam Abdussalam', class: '8H', code: 'Nizam Abdussalam - 8H' },
  { id: 414, name: 'Nur Ihsan Pamungkas', class: '8H', code: 'Nur Ihsan Pamungkas - 8H' },
  { id: 415, name: 'Putri Zahra Ramadani', class: '8H', code: 'Putri Zahra Ramadani - 8H' },
  { id: 416, name: 'Qodwa Kaizen Munawir', class: '8H', code: 'Qodwa Kaizen Munawir - 8H' },
  { id: 417, name: 'Rafka Karvin', class: '8H', code: 'Rafka Karvin - 8H' },
  { id: 418, name: 'Runa Anisatul Asma', class: '8H', code: 'Runa Anisatul Asma - 8H' },
  { id: 419, name: 'Salsa Zafirah', class: '8H', code: 'Salsa Zafirah - 8H' },
  { id: 420, name: 'Silmi Kaffah', class: '8H', code: 'Silmi Kaffah - 8H' },
  { id: 421, name: 'Tubagus Ramadan', class: '8H', code: 'Tubagus Ramadan - 8H' },

  // --- KELAS 9A ---
  { id: 422, name: 'Acep Akbar Rizkika', class: '9A', code: 'Acep Akbar Rizkika - 9A' },
  { id: 423, name: 'Alif Malik Maulana', class: '9A', code: 'Alif Malik Maulana - 9A' },
  { id: 424, name: 'Alifa Nawal Aghla', class: '9A', code: 'Alifa Nawal Aghla - 9A' },
  { id: 425, name: 'Amira Widiya', class: '9A', code: 'Amira Widiya - 9A' },
  { id: 426, name: 'Andini Noer Vitaloka', class: '9A', code: 'Andini Noer Vitaloka - 9A' },
  { id: 427, name: 'Astri Sulis Setiawati', class: '9A', code: 'Astri Sulis Setiawati - 9A' },
  { id: 428, name: 'Ataya Fikli Rizqulloh', class: '9A', code: 'Ataya Fikli Rizqulloh - 9A' },
  { id: 429, name: 'Cindy Aulia Ramadani', class: '9A', code: 'Cindy Aulia Ramadani - 9A' },
  { id: 430, name: 'Damia Dwi Agustin', class: '9A', code: 'Damia Dwi Agustin - 9A' },
  { id: 431, name: 'Faiz Abdul Razzaq', class: '9A', code: 'Faiz Abdul Razzaq - 9A' },
  { id: 432, name: 'Kiana Shabiyyah Hasna', class: '9A', code: 'Kiana Shabiyyah Hasna - 9A' },
  { id: 433, name: 'Muhammad Arfan Fahriza', class: '9A', code: 'Muhammad Arfan Fahriza - 9A' },
  { id: 434, name: 'Nazia Amalia', class: '9A', code: 'Nazia Amalia - 9A' },
  { id: 435, name: 'Rafif Jiyadul Husni', class: '9A', code: 'Rafif Jiyadul Husni - 9A' },
  { id: 436, name: 'Ratu Aliza', class: '9A', code: 'Ratu Aliza - 9A' },
  { id: 437, name: 'Riksa Sandikha', class: '9A', code: 'Riksa Sandikha - 9A' },
  { id: 438, name: 'Ristha Mauludha', class: '9A', code: 'Ristha Mauludha - 9A' },
  { id: 439, name: 'Siti Nurvita Apriliani', class: '9A', code: 'Siti Nurvita Apriliani - 9A' },
  { id: 440, name: 'Vanessa Suci Febriana', class: '9A', code: 'Vanessa Suci Febriana - 9A' },
  { id: 441, name: 'Ziya Nazmi', class: '9A', code: 'Ziya Nazmi - 9A' },

  // --- KELAS 9B ---
  { id: 442, name: 'Aghny Ghaisani', class: '9B', code: 'Aghny Ghaisani - 9B' },
  { id: 443, name: 'Angga Nugraha', class: '9B', code: 'Angga Nugraha - 9B' },
  { id: 444, name: 'Arby Ridwan Syukur', class: '9B', code: 'Arby Ridwan Syukur - 9B' },
  { id: 445, name: 'Asti Aidila', class: '9B', code: 'Asti Aidila - 9B' },
  { id: 446, name: 'Aufa Farhatunnajah', class: '9B', code: 'Aufa Farhatunnajah - 9B' },
  { id: 447, name: 'Khosyi Izaz Alhaq', class: '9B', code: 'Khosyi Izaz Alhaq - 9B' },
  { id: 448, name: 'Muhammad Hilmi Khairul Azam K', class: '9B', code: 'Muhammad Hilmi Khairul Azam K - 9B' },
  { id: 449, name: 'Muhammad Nurul Kamil', class: '9B', code: 'Muhammad Nurul Kamil - 9B' },
  { id: 450, name: 'Muhammad Radhitya Abhipraya', class: '9B', code: 'Muhammad Radhitya Abhipraya - 9B' },
  { id: 451, name: 'Muhammad Rafi Allatif', class: '9B', code: 'Muhammad Rafi Allatif - 9B' },
  { id: 452, name: 'Muhammad Riyadussolihin', class: '9B', code: 'Muhammad Riyadussolihin - 9B' },
  { id: 453, name: 'Nadia Lidiawati', class: '9B', code: 'Nadia Lidiawati - 9B' },
  { id: 454, name: 'Naifa Anggraini Mulya', class: '9B', code: 'Naifa Anggraini Mulya - 9B' },
  { id: 455, name: 'Nazhifa Hylma Auliya', class: '9B', code: 'Nazhifa Hylma Auliya - 9B' },
  { id: 456, name: 'Raya Oktavia Akhira', class: '9B', code: 'Raya Oktavia Akhira - 9B' },
  { id: 457, name: 'Regina Firli Fitria', class: '9B', code: 'Regina Firli Fitria - 9B' },
  { id: 458, name: 'Saskia', class: '9B', code: 'Saskia - 9B' },
  { id: 459, name: 'Sela Aprillia', class: '9B', code: 'Sela Aprillia - 9B' },
  { id: 460, name: 'Zahwa Qothrunnada', class: '9B', code: 'Zahwa Qothrunnada - 9B' },

  // --- KELAS 9C ---
  { id: 461, name: 'Albi Riski Pratama', class: '9C', code: 'Albi Riski Pratama - 9C' },
  { id: 462, name: 'Alexa Nurul Zahra', class: '9C', code: 'Alexa Nurul Zahra - 9C' },
  { id: 463, name: 'Alita Azrin', class: '9C', code: 'Alita Azrin - 9C' },
  { id: 464, name: 'Arya Anugrah', class: '9C', code: 'Arya Anugrah - 9C' },
  { id: 465, name: 'Arya Muhammad Fahlevin', class: '9C', code: 'Arya Muhammad Fahlevin - 9C' },
  { id: 466, name: 'Azmi Alfarizi Ramdani', class: '9C', code: 'Azmi Alfarizi Ramdani - 9C' },
  { id: 467, name: 'Azri Lutfilah Ahsan', class: '9C', code: 'Azri Lutfilah Ahsan - 9C' },
  { id: 468, name: 'Cantika Lutfia Nisa', class: '9C', code: 'Cantika Lutfia Nisa - 9C' },
  { id: 469, name: 'Fadlan Abdurahman', class: '9C', code: 'Fadlan Abdurahman - 9C' },
  { id: 470, name: 'Firdan Fahri Harizqillah', class: '9C', code: 'Firdan Fahri Harizqillah - 9C' },
  { id: 471, name: 'Hilmi', class: '9C', code: 'Hilmi - 9C' },
  { id: 472, name: 'Ilham Nasrulloh', class: '9C', code: 'Ilham Nasrulloh - 9C' },
  { id: 473, name: 'Indra Jaya', class: '9C', code: 'Indra Jaya - 9C' },
  { id: 474, name: 'Khaerunnisa Ramadini', class: '9C', code: 'Khaerunnisa Ramadini - 9C' },
  { id: 475, name: 'Muhamad Fahmi Fauji', class: '9C', code: 'Muhamad Fahmi Fauji - 9C' },
  { id: 476, name: 'Muhammad Fauzan Al Khairy', class: '9C', code: 'Muhammad Fauzan Al Khairy - 9C' },
  { id: 477, name: 'Muhammad Sapa Rizki', class: '9C', code: 'Muhammad Sapa Rizki - 9C' },
  { id: 478, name: 'Nadia Fauziah', class: '9C', code: 'Nadia Fauziah - 9C' },
  { id: 479, name: 'Naima Nurfatwa', class: '9C', code: 'Naima Nurfatwa - 9C' },
  { id: 480, name: 'Nasyim Awalludin Rahmatullah', class: '9C', code: 'Nasyim Awalludin Rahmatullah - 9C' },
  { id: 481, name: 'Nayumi Lailatul Fa\'izah', class: '9C', code: 'Nayumi Lailatul Fa\'izah - 9C' },
  { id: 482, name: 'Nida Maharani', class: '9C', code: 'Nida Maharani - 9C' },
  { id: 483, name: 'Rifki Khusnul Ma\'ab', class: '9C', code: 'Rifki Khusnul Ma\'ab - 9C' },
  { id: 484, name: 'Sahrini Septia Aprilia', class: '9C', code: 'Sahrini Septia Aprilia - 9C' },
  { id: 485, name: 'Winda Aura Madura', class: '9C', code: 'Winda Aura Madura - 9C' },
  { id: 486, name: 'Yusup Maulana', class: '9C', code: 'Yusup Maulana - 9C' },
  { id: 487, name: 'Zahira Nurfadilah', class: '9C', code: 'Zahira Nurfadilah - 9C' },
  { id: 488, name: 'Zahratussifa Alsami', class: '9C', code: 'Zahratussifa Alsami - 9C' },

  // --- KELAS 9D ---
  { id: 489, name: 'Adhietya Putra Rachmawan', class: '9D', code: 'Adhietya Putra Rachmawan - 9D' },
  { id: 490, name: 'Akbar Dilawar', class: '9D', code: 'Akbar Dilawar - 9D' },
  { id: 491, name: 'Ardhi Sirojuddin', class: '9D', code: 'Ardhi Sirojuddin - 9D' },
  { id: 492, name: 'Ayla Novalia Anggraeni', class: '9D', code: 'Ayla Novalia Anggraeni - 9D' },
  { id: 493, name: 'Cep Nizar Sya\'ban Ramdani', class: '9D', code: 'Cep Nizar Sya\'ban Ramdani - 9D' },
  { id: 494, name: 'Cipta Adam Tri Jiyadi', class: '9D', code: 'Cipta Adam Tri Jiyadi - 9D' },
  { id: 495, name: 'Dika Rama Saputra Mutakin', class: '9D', code: 'Dika Rama Saputra Mutakin - 9D' },
  { id: 496, name: 'Firli Syafik Muafa', class: '9D', code: 'Firli Syafik Muafa - 9D' },
  { id: 497, name: 'Gisyela Rahmadani', class: '9D', code: 'Gisyela Rahmadani - 9D' },
  { id: 498, name: 'Ikrima Zadharotun Nisa', class: '9D', code: 'Ikrima Zadharotun Nisa - 9D' },
  { id: 499, name: 'Kiran Chandra Narendra', class: '9D', code: 'Kiran Chandra Narendra - 9D' },
  { id: 500, name: 'Mita Nuraini', class: '9D', code: 'Mita Nuraini - 9D' },
  { id: 501, name: 'Muhamad Pazri Taufik Qurohman', class: '9D', code: 'Muhamad Pazri Taufik Qurohman - 9D' },
  { id: 502, name: 'Muhamad Rapa Al Parizi', class: '9D', code: 'Muhamad Rapa Al Parizi - 9D' },
  { id: 503, name: 'Muhammad Raihan Hidayat', class: '9D', code: 'Muhammad Raihan Hidayat - 9D' },
  { id: 504, name: 'Muhammad Syakirinal Hamidin', class: '9D', code: 'Muhammad Syakirinal Hamidin - 9D' },
  { id: 505, name: 'Muhammad Yunizar Pratama', class: '9D', code: 'Muhammad Yunizar Pratama - 9D' },
  { id: 506, name: 'Nabil Jahran Fauzan', class: '9D', code: 'Nabil Jahran Fauzan - 9D' },
  { id: 507, name: 'Nadira Salwa Clarisa', class: '9D', code: 'Nadira Salwa Clarisa - 9D' },
  { id: 508, name: 'Nazril Maulana', class: '9D', code: 'Nazril Maulana - 9D' },
  { id: 509, name: 'Nazwa Nurazizah', class: '9D', code: 'Nazwa Nurazizah - 9D' },
  { id: 510, name: 'Neli', class: '9D', code: 'Neli - 9D' },
  { id: 511, name: 'Rosifa Aulia Putri', class: '9D', code: 'Rosifa Aulia Putri - 9D' },
  { id: 512, name: 'Sakinah', class: '9D', code: 'Sakinah - 9D' },
  { id: 513, name: 'San San Aidil Hamzah', class: '9D', code: 'San San Aidil Hamzah - 9D' },
  { id: 514, name: 'Saskia Putri Nuraeni', class: '9D', code: 'Saskia Putri Nuraeni - 9D' },
  { id: 515, name: 'Siti Hafizah Dwi Marwati', class: '9D', code: 'Siti Hafizah Dwi Marwati - 9D' },
  { id: 516, name: 'Vina Muyasaroh', class: '9D', code: 'Vina Muyasaroh - 9D' },

  // --- KELAS 9E ---
  { id: 517, name: 'Ahmad Gias', class: '9E', code: 'Ahmad Gias - 9E' },
  { id: 518, name: 'Aiman Difa Almahesa Putra', class: '9E', code: 'Aiman Difa Almahesa Putra - 9E' },
  { id: 519, name: 'Aisri Romadon', class: '9E', code: 'Aisri Romadon - 9E' },
  { id: 520, name: 'Akhdan Stani Juniar', class: '9E', code: 'Akhdan Stani Juniar - 9E' },
  { id: 521, name: 'Bagas Maulana Taziri', class: '9E', code: 'Bagas Maulana Taziri - 9E' },
  { id: 522, name: 'Cecep Pasa Husnuloh', class: '9E', code: 'Cecep Pasa Husnuloh - 9E' },
  { id: 523, name: 'Fajri Muhammad Salva', class: '9E', code: 'Fajri Muhammad Salva - 9E' },
  { id: 524, name: 'Farhan Irzillahi Azda', class: '9E', code: 'Farhan Irzillahi Azda - 9E' },
  { id: 525, name: 'Firmansyah', class: '9E', code: 'Firmansyah - 9E' },
  { id: 526, name: 'Haikal Pabian', class: '9E', code: 'Haikal Pabian - 9E' },
  { id: 527, name: 'Hani Anggraeni', class: '9E', code: 'Hani Anggraeni - 9E' },
  { id: 528, name: 'Lutfi Muhammad Fauzi', class: '9E', code: 'Lutfi Muhammad Fauzi - 9E' },
  { id: 529, name: 'Muhamad Aditya Sapari', class: '9E', code: 'Muhamad Aditya Sapari - 9E' },
  { id: 530, name: 'Muhamad Zildan Ziki Putra', class: '9E', code: 'Muhamad Zildan Ziki Putra - 9E' },
  { id: 531, name: 'Muhammad Akbar Maulidan', class: '9E', code: 'Muhammad Akbar Maulidan - 9E' },
  { id: 532, name: 'Naeli Rahmatuss`adah', class: '9E', code: 'Naeli Rahmatuss`adah - 9E' },
  { id: 533, name: 'Nesa Sintia', class: '9E', code: 'Nesa Sintia - 9E' },
  { id: 534, name: 'Pardan Raditya Hidayat', class: '9E', code: 'Pardan Raditya Hidayat - 9E' },
  { id: 535, name: 'Rakha Fajri Akbar Karsony', class: '9E', code: 'Rakha Fajri Akbar Karsony - 9E' },
  { id: 536, name: 'Rizki Muhamad Ramdan', class: '9E', code: 'Rizki Muhamad Ramdan - 9E' },
  { id: 537, name: 'Salma Oktavia', class: '9E', code: 'Salma Oktavia - 9E' },
  { id: 538, name: 'Silvi Fitri Ramdani', class: '9E', code: 'Silvi Fitri Ramdani - 9E' },
  { id: 539, name: 'Sulisti Wulansari', class: '9E', code: 'Sulisti Wulansari - 9E' },
  { id: 540, name: 'Syazqiya Suhendar', class: '9E', code: 'Syazqiya Suhendar - 9E' },
  { id: 541, name: 'Venny Syahirakina', class: '9E', code: 'Venny Syahirakina - 9E' },
  { id: 542, name: 'Yulia Rahmawati', class: '9E', code: 'Yulia Rahmawati - 9E' },
  { id: 543, name: 'Zahra Oktaviani', class: '9E', code: 'Zahra Oktaviani - 9E' },

  // --- KELAS 9F ---
  { id: 544, name: 'Akbar Anugrah Ramadhan', class: '9F', code: 'Akbar Anugrah Ramadhan - 9F' },
  { id: 545, name: 'Akbar Sidik', class: '9F', code: 'Akbar Sidik - 9F' },
  { id: 546, name: 'Aldo', class: '9F', code: 'Aldo - 9F' },
  { id: 547, name: 'Azka Raditya Pratama', class: '9F', code: 'Azka Raditya Pratama - 9F' },
  { id: 548, name: 'Dias Al Fazri', class: '9F', code: 'Dias Al Fazri - 9F' },
  { id: 549, name: 'Elpa Dila Sri Maulida', class: '9F', code: 'Elpa Dila Sri Maulida - 9F' },
  { id: 550, name: 'Fariz Ahmad Rifa\'i', class: '9F', code: 'Fariz Ahmad Rifa\'i - 9F' },
  { id: 551, name: 'Indra Lesmana', class: '9F', code: 'Indra Lesmana - 9F' },
  { id: 552, name: 'Keysa Ramadani', class: '9F', code: 'Keysa Ramadani - 9F' },
  { id: 553, name: 'Lidia Nurosydah', class: '9F', code: 'Lidia Nurosydah - 9F' },
  { id: 554, name: 'Marwah Putri Syakila', class: '9F', code: 'Marwah Putri Syakila - 9F' },
  { id: 555, name: 'Muhamad Rapi Bagja Nugraha', class: '9F', code: 'Muhamad Rapi Bagja Nugraha - 9F' },
  { id: 556, name: 'Muhammad Dzikri Arifin', class: '9F', code: 'Muhammad Dzikri Arifin - 9F' },
  { id: 557, name: 'Muhammad Zeni Adrian', class: '9F', code: 'Muhammad Zeni Adrian - 9F' },
  { id: 558, name: 'Muhammad Ziyad Rojabul Mubarok', class: '9F', code: 'Muhammad Ziyad Rojabul Mubarok - 9F' },
  { id: 559, name: 'Nasya Mutiara Fadilah', class: '9F', code: 'Nasya Mutiara Fadilah - 9F' },
  { id: 560, name: 'Putri Sobni Nurfadillah', class: '9F', code: 'Putri Sobni Nurfadillah - 9F' },
  { id: 561, name: 'Ranti Bunga Lestari', class: '9F', code: 'Ranti Bunga Lestari - 9F' },
  { id: 562, name: 'Reno Fauzan', class: '9F', code: 'Reno Fauzan - 9F' },
  { id: 563, name: 'Ristian Rustandi', class: '9F', code: 'Ristian Rustandi - 9F' },
  { id: 564, name: 'Rivan Maulana Fahreza', class: '9F', code: 'Rivan Maulana Fahreza - 9F' },
  { id: 565, name: 'Rizki Febrian Pratama', class: '9F', code: 'Rizki Febrian Pratama - 9F' },
  { id: 566, name: 'Rizky Septian Ramdani', class: '9F', code: 'Rizky Septian Ramdani - 9F' },
  { id: 567, name: 'Seni Nur Samsi', class: '9F', code: 'Seni Nur Samsi - 9F' },
  { id: 568, name: 'Tiara Gustapiani', class: '9F', code: 'Tiara Gustapiani - 9F' },
  { id: 569, name: 'Wafaa Nurul Akmaliah', class: '9F', code: 'Wafaa Nurul Akmaliah - 9F' },
  { id: 570, name: 'Zara Khanza Aqila Putri Lusyani', class: '9F', code: 'Zara Khanza Aqila Putri Lusyani - 9F' },

  // --- KELAS 9G ---
  { id: 571, name: 'Adam Ramdiana', class: '9G', code: 'Adam Ramdiana - 9G' },
  { id: 572, name: 'Bima Pratama', class: '9G', code: 'Bima Pratama - 9G' },
  { id: 573, name: 'Dede Pajar', class: '9G', code: 'Dede Pajar - 9G' },
  { id: 574, name: 'Derry Nugraha Hidayat', class: '9G', code: 'Derry Nugraha Hidayat - 9G' },
  { id: 575, name: 'Fais Rivaldi', class: '9G', code: 'Fais Rivaldi - 9G' },
  { id: 576, name: 'Fiska Sri Lestari', class: '9G', code: 'Fiska Sri Lestari - 9G' },
  { id: 577, name: 'Haidar Rafif Permana', class: '9G', code: 'Haidar Rafif Permana - 9G' },
  { id: 578, name: 'Keysa Salsabela', class: '9G', code: 'Keysa Salsabela - 9G' },
  { id: 579, name: 'Luthfiana Sa\'diyah Asysyifa', class: '9G', code: 'Luthfiana Sa\'diyah Asysyifa - 9G' },
  { id: 580, name: 'Maisya Fuzia Azhara', class: '9G', code: 'Maisya Fuzia Azhara - 9G' },
  { id: 581, name: 'Muhammad Aldzam', class: '9G', code: 'Muhammad Aldzam - 9G' },
  { id: 582, name: 'Muhammad Azzkia Habibi', class: '9G', code: 'Muhammad Azzkia Habibi - 9G' },
  { id: 583, name: 'Muhammad Ghiffari Al-Matturidzi', class: '9G', code: 'Muhammad Ghiffari Al-Matturidzi - 9G' },
  { id: 584, name: 'Muhammad Rofi Fathul Ginan', class: '9G', code: 'Muhammad Rofi Fathul Ginan - 9G' },
  { id: 585, name: 'Nazilla Rachman', class: '9G', code: 'Nazilla Rachman - 9G' },
  { id: 586, name: 'Neng Tiara Febriyanti', class: '9G', code: 'Neng Tiara Febriyanti - 9G' },
  { id: 587, name: 'Opal Valianto', class: '9G', code: 'Opal Valianto - 9G' },
  { id: 588, name: 'Parhan Maulana', class: '9G', code: 'Parhan Maulana - 9G' },
  { id: 589, name: 'Rafael Syifa Ibrahim', class: '9G', code: 'Rafael Syifa Ibrahim - 9G' },
  { id: 590, name: 'Rahma Adelia', class: '9G', code: 'Rahma Adelia - 9G' },
  { id: 591, name: 'Rehan Abdul Zenal', class: '9G', code: 'Rehan Abdul Zenal - 9G' },
  { id: 592, name: 'Romdon Nugraha', class: '9G', code: 'Romdon Nugraha - 9G' },
  { id: 593, name: 'Salma Sa\'baniah', class: '9G', code: 'Salma Sa\'baniah - 9G' },
  { id: 594, name: 'Salma Wati', class: '9G', code: 'Salma Wati - 9G' },
  { id: 595, name: 'Septi Maulana', class: '9G', code: 'Septi Maulana - 9G' },
  { id: 596, name: 'Syifa Nur Auliya', class: '9G', code: 'Syifa Nur Auliya - 9G' },
  { id: 597, name: 'Wulan Cahyani', class: '9G', code: 'Wulan Cahyani - 9G' },
  { id: 598, name: 'Yumna Artanti', class: '9G', code: 'Yumna Artanti - 9G' },

  // --- TAMBAHAN / MISC ---
  { id: 599, name: 'Ghifar Maulana', class: '7C', code: 'Ghifar Maulana - 7C' },
  { id: 600, name: 'Muhammad Salsa', class: '8D', code: 'Muhammad Salsa - 8D' },
  { id: 601, name: 'Rakhsandrina Ari Beevan Safaraz', class: '8D', code: 'Rakhsandrina Ari B.S. - 8D' },
  { id: 602, name: 'M Rifki Ramadan', class: '8E', code: 'M Rifki Ramadan - 8E' },
  { id: 603, name: 'Adam Malik Gofarullah', class: '8E', code: 'Adam Malik Gofarullah - 8E' },
  { id: 604, name: 'Rizki Maulidani', class: '8G', code: 'Rizki Maulidani - 8G' },
  { id: 605, name: 'M Makhdum Ibrahim', class: '7C', code: 'M Makhdum Ibrahim - 7C' },
  { id: 606, name: 'M Tegar Galunggung Ma\'ruf', class: '8F', code: 'M Tegar Galunggung M. - 8F' },
  { id: 607, name: 'Ahsan Nurul Adli', class: '8F', code: 'Ahsan Nurul Adli - 8F' },
  { id: 608, name: 'M Irham Attaopik', class: '8C', code: 'M Irham Attaopik - 8C' },
  { id: 609, name: 'M Rasydan Assyauqi', class: '8C', code: 'M Rasydan Assyauqi - 8C' },
  { id: 610, name: 'M Arbaz', class: '7E', code: 'M Arbaz - 7E' },
  { id: 611, name: 'Anggita', class: '7E', code: 'Anggita - 7E' },
  { id: 612, name: 'Rajwa', class: '8F', code: 'Rajwa - 8F' },
];

const GOLONGAN_MAP = {
  'III.a': { pangkat: 'Penata Muda', jabatan: 'Guru Ahli Pertama' },
  'III.b': { pangkat: 'Penata Muda Tk. 1', jabatan: 'Guru Ahli Pertama' },
  'III.c': { pangkat: 'Penata', jabatan: 'Guru Ahli Muda' },
  'III.d': { pangkat: 'Penata Tk. 1', jabatan: 'Guru Ahli Muda' },
  'IV.a': { pangkat: 'Pembina', jabatan: 'Guru Ahli Madya' },
  'IV.b': { pangkat: 'Pembina Tk. 1', jabatan: 'Guru Ahli Madya' },
  'IV.c': { pangkat: 'Pembina Utama Muda', jabatan: 'Guru Ahli Madya' },
  'IV.d': { pangkat: 'Pembina Utama Madya', jabatan: 'Guru Ahli Utama' },
  'IV.e': { pangkat: 'Pembina Utama', jabatan: 'Guru Ahli Utama' }
};

const ACTIVITIES_LIST = [
  { name: 'Menyusun perangkat pembelajaran', unit: 'perangkat', doc: 'Dokumen perangkat pembelajaran' },
  { name: 'Melaksanakan kegiatan pembelajaran', unit: 'JP', doc: 'Dokumen kegiatan pembelajaran' },
  { name: 'Menyusun perangkat penilaian', unit: 'perangkat', doc: 'Dokumen perangkat penilaian' },
  { name: 'Melaksanakan penilaian', unit: 'JP', doc: 'Dokumen kegiatan penilaian' },
  { name: 'Menganalisis hasil penilaian', unit: 'rombel', doc: 'Dokumen hasil analisis penilaian' },
  { name: 'Menindaklanjuti hasil analisis penilaian', unit: 'rombel', doc: 'Dokumen kegiatan remedial/pengayaan' },
  { name: 'Mendampingi siswa dalam kegiatan pembiasaan Tadarrus', unit: 'kegiatan', doc: 'Dokumen kegiatan pembiasaan' },
  { name: 'Mendampingi siswa dalam kegiatan pembiasaan Murojaah', unit: 'kegiatan', doc: 'Dokumen kegiatan pembiasaan' },
  { name: 'Membimbing siswa dalam kegiatan kokurikuler', unit: 'JP', doc: 'Dokumen kegiatan kokurikuler' },
  { name: 'Membimbing siswa dalam kegiatan ekstrakurikuler', unit: 'kegiatan', doc: 'Dokumen kegiatan pembimbingan ekstrakurikuler' },
  { name: 'Membimbing siswa dalam kegiatan kompetisi', unit: 'kegiatan', doc: 'Dokumen kegiatan pembimbingan kompetisi siswa' },
  { name: 'Mengikuti upacara bendera', unit: 'kegiatan', doc: 'Dokumen kegiatan upacara bendera' },
  { name: 'Melaksanakan piket', unit: 'JP', doc: 'Dokumen kegiatan piket' },
  { name: 'Melaksanakan kegiatan wakil kepala madrasah', unit: 'kegiatan', doc: 'Dokumen kegiatan wakil kepala madrasah' },
  { name: 'Melaksanakan kegiatan kewalikelasan', unit: 'kegiatan', doc: 'Dokumen kegiatan kewalikelasan' },
  { name: 'Melaksanakan kegiatan kepala laboratorium', unit: 'kegiatan', doc: 'Dokumen kegiatan kepala laboratorium' },
  { name: 'Melaksanakan kegiatan kepala perpustakaan', unit: 'kegiatan', doc: 'Dokumen kegiatan kepala perpustakaan' },
  { name: 'Mengikuti kegiatan MGMP', unit: 'kegiatan', doc: 'Undangan dan dokumen kegiatan MGMP' },
  { name: 'Mengikuti pelatihan, workshop, maupun seminar', unit: 'JP', doc: 'Undangan, resume dan dokumen kegiatan pelatihan' },
  { name: 'Mengikuti kegiatan rapat dan kordinasi lainnya', unit: 'kegiatan', doc: 'Undangan dan dokumen kegiatan rapat' },
  { name: 'Mengikuti kegiatan kelembagaan Kemenag', unit: 'kegiatan', doc: 'Undangan dan dokumen kegiatan' },
  { name: 'Melaksanakan kegiatan lain-lain', unit: 'kegiatan', doc: 'Dokumen kegiatan' },
  { name: 'Mendampingi siswa dalam kegiatan pembiasaan Dhuha', unit: 'kegiatan', doc: 'Dokumen kegiatan' },
  { name: 'Menjadi panitia dalam kegiatan madrasah', unit: 'kegiatan', doc: 'Dokumen kegiatan' },
  { name: 'Mendampingi siswa dalam kegiatan pembiasaan Literasi', unit: 'kegiatan', doc: 'Dokumen kegiatan pembiasaan' },
  { name: 'Libur semester', unit: 'hari', doc: 'Dokumen kalender pendidikan' },
  { name: 'Mengikuti kegiatan PHBI', unit: 'kegiatan', doc: 'Dokumen kegiatan PHBI' },
  { name: 'Mengikuti kegiatan PHBN', unit: 'kegiatan', doc: 'Dokumen kegiatan PHBN' },
  { name: 'Mendampingi siswa dalam kegiatan pembiasaan olahraga', unit: 'kegiatan', doc: 'Dokumen kegiatan PHBN' },
];

const HEADMASTER_ACTIVITIES = [
  { name: 'Apel dan pembinaan di kemenag', unit: 'kegiatan', doc: 'Dokumen apel dan pembinaa' },
  { name: 'Monitoring kegiatan', unit: 'kegiatan', doc: 'Dokumen monitoring' },
  { name: 'Menandatangani Dokumen madrasah', unit: 'dokumen', doc: 'Dokumen penandatangan' },
  { name: 'Menerima tamu', unit: 'kegiatan', doc: 'Dokumen penerimaan tamu' },
  { name: 'Mengerjakan Ekin', unit: 'dokumen', doc: 'Dokumen Ekin' },
  { name: 'Menandatangani dokumen Ekin, LCKH dan LKB', unit: 'dokumen', doc: 'Dokumen Ekin, LCKH dan LKB' },
  { name: 'Mengikuti kegiatan PHBI', unit: 'kegiatan', doc: 'Dokumen kegiatan PHBI' },
  { name: 'Mengikuti kegiatan PHBN', unit: 'kegiatan', doc: 'Dokumen kegiatan PHBN' },
  { name: 'Mengikuti pelatihan, workshop, maupun seminar', unit: 'JP', doc: 'Undangan, resume dan dokumen kegiatan pelatihan' },
  { name: 'Mengikuti kegiatan rapat dan kordinasi lainnya', unit: 'kegiatan', doc: 'Undangan dan dokumen kegiatan rapat' },
  { name: 'Mengikuti kegiatan kelembagaan Kemenag', unit: 'kegiatan', doc: 'Undangan dan dokumen kegiatan' },
];

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const YEARS = [2025, 2026, 2027, 2028];

// --- HELPER FUNCTIONS ---
const getLocalISOString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // Format YYYY-MM-DD sesuai lokal
};

const getFormattedDate = (dateObj) => {
  return dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const getTitimangsa = (dateObj) => {
  return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getShortDate = (d) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2,'0')}-${String(dt.getMonth()+1).padStart(2,'0')}-${dt.getFullYear()}`;
};

// --- HELPER BARU UNTUK HITUNG HARI EFEKTIF (ALFA OTOMATIS) ---
const countEffectiveDays = (startDate, endDate, holidays, allowedDays) => {
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Loop dari tanggal mulai sampai akhir
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay(); // 0=Minggu, 1=Senin, ..., 6=Sabtu
    const dateStr = d.toISOString().split('T')[0];
    
    // Jika hari termasuk hari kerja (allowedDays) DAN bukan hari libur
    if (allowedDays.includes(dayOfWeek) && !holidays.includes(dateStr)) {
      count++;
    }
  }
  return count;
};

// --- STYLES ---
// --- STYLES ---
// --- STYLES (VERSI FIX CETAK & MOBILE) ---
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');

/* --- GLOBAL RESET --- */
* { box-sizing: border-box; }

body, html { 
  margin: 0; 
  padding: 0;
  font-family: 'Times New Roman', serif;
  -webkit-print-color-adjust: exact !important; 
  print-color-adjust: exact !important;
}

/* --- KERTAS A4 (Layout Dasar) --- */
.sheet {
  background: white;
  width: 210mm; 
  /* min-height dihapus agar fleksibel saat konten sedikit/banyak */
  padding: 15mm 15mm 20mm 15mm; 
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
}

/* --- STYLE KHUSUS TAMPILAN MOBILE (HP) - AGAR TAMPAK FULL --- */
@media screen and (max-width: 768px) {
  .preview-wrapper {
    padding: 10px !important;
    background: #52525b; 
    overflow: hidden; 
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 500px;
  }
  
  /* ZOOM OUT di HP: Agar kertas A4 terlihat utuh */
  .sheet {
    transform: scale(0.45); /* Perkecil tampilan */
    transform-origin: top center; 
    margin-bottom: -150mm; /* Tarik margin bawah agar tidak bolong */
  }

  /* Rapikan tombol print di HP */
  .print-controls {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }
  .print-controls select, .print-controls button, .print-controls input {
    width: 100% !important;
  }
}

/* --- STYLE TAMPILAN DESKTOP --- */
@media screen and (min-width: 769px) {
  .preview-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    background: #52525b;
    border-radius: 8px;
    margin: 20px;
    overflow: auto;
  }
}

/* --- MODE CETAK (PRINT) - DIKEMBALIKAN AGAR TIDAK LONCAT --- */
@media print {
  @page { 
    size: A4; 
    margin: 0mm !important; /* Gunakan margin 0, kita atur padding di .sheet */
  }
  
  .no-print, nav, aside, header, footer, button, .mobile-header, .sidebar, ::-webkit-scrollbar { 
    display: none !important; 
  }
  
  body, html, main, .app-layout { 
    background: white !important; 
    height: auto !important; 
    width: auto !important; 
    margin: 0 !important; 
    padding: 0 !important; 
    overflow: visible !important;
  }
  
  .preview-wrapper { 
    display: block !important; 
    position: absolute !important; 
    top: 0 !important; 
    left: 0 !important; 
    width: 100% !important; 
    margin: 0 !important; 
    padding: 0 !important; 
    background: white !important; 
    z-index: 9999 !important; 
  }
  
  .sheet { 
    margin: 0 !important; 
    box-shadow: none !important; 
    page-break-after: always !important; 
    width: 210mm !important; 
    
    /* PERBAIKAN UTAMA: */
    height: auto !important;      /* Tinggi menyesuaikan isi */
    min-height: auto !important;  /* Jangan dipaksa 297mm */
    
    padding: 15mm 15mm 20mm 15mm !important; 
    transform: none !important;   /* Reset zoom mobile saat print */
    margin-bottom: 0 !important; 
  }
  
  /* Cegah halaman kosong berlebih */
  .sheet:last-child { page-break-after: auto !important; }
  
  /* Pastikan Tanda Tangan tidak terpotong (PENTING) */
  .signature-section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  
  /* Pastikan baris tabel tidak terpotong jelek */
  tr {
    page-break-inside: avoid;
  }
}

/* --- TABEL --- */
table { width: 100%; border-collapse: collapse; margin-top: 5px; margin-bottom: 10px; font-size: 10pt; }
thead th { background-color: #e5e7eb !important; font-weight: bold; text-align: center; border: 1px solid #000; vertical-align: middle; padding: 5px 2px; }
tbody td { border: 1px solid #000; vertical-align: top; padding: 4px 4px; line-height: 1.1; }

.text-center { text-align: center; }
.text-left { text-align: left; }
.font-bold { font-weight: bold; }
`;

// --- SUB-COMPONENTS ---

// 1. LOGIN SCREEN (REDESAIN LEBIH MENARIK)
const LoginScreen = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi loading sedikit agar terasa prosesnya
    setTimeout(() => {
      onLogin(id, pass);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex w-full relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-200/50 rounded-full blur-3xl"></div>

      <div className="w-full flex items-center justify-center p-4 z-10">
        <div className="glass-card w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
          
          {/* Kolom Kiri: Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white/80">
            <div className="mb-8 text-center md:text-left">
              <div className="inline-block p-3 bg-green-50 rounded-xl mb-4 shadow-sm">
                <Image src="/logo kemenag.png" alt="Logo" width={60} height={60} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h1>
              <p className="text-gray-500 text-sm">Masuk untuk mengakses Sistem Informasi Madrasah</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">NIP / NISN</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input 
                    type="text" value={id} onChange={e => setId(e.target.value)} 
                    className="pl-10 w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    placeholder="Nomor Induk" required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input 
                    type="password" value={pass} onChange={e => setPass(e.target.value)} 
                    className="pl-10 w-full bg-gray-50 border border-gray-200 p-3 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    placeholder="••••••••" required 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={20}/> : "Masuk Aplikasi"}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">&copy; 2026 MTs Negeri 3 Kota Tasikmalaya</p>
            </div>
          </div>

          {/* Kolom Kanan: Visual */}
          <div className="hidden md:flex flex-col justify-center items-center bg-green-900 relative p-12 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20">
               <Image src="/gerbang madrasah.jpeg" layout="fill" objectFit="cover" alt="Background" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-900/15 to-transparent"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-6 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mx-auto">
                <QrCode size={40} className="text-yellow-300" />
              </div>
              <h2 className="text-3xl font-bold mb-2">MTs Negeri 3<br/>Kota Tasikmalaya</h2>
              <p className="text-green-100 text-sm leading-relaxed max-w-xs mx-auto">
                Mewujudkan madrasah yang maju, bermutu, dan mendunia melalui teknologi terintegrasi.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const SidebarContent = ({ user, currentView, setView, logout }) => {
  // Cek Permission berdasarkan role user saat ini
  const permissions = ROLE_PERMISSIONS[user?.role] || [];

  const menuClass = (id) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === id ? 'bg-green-700 shadow-md font-medium translate-x-1' : 'hover:bg-green-800/50 text-green-100'}`;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-900 to-green-950 text-white shadow-xl">
      <div className="p-6 flex flex-col items-center border-b border-green-800/50">
        <div className="w-16 h-16 bg-white p-1 rounded-full shadow-lg mb-3">
          <Image src="/logo kemenag.png" alt="Logo" width={60} height={60} className="object-contain" />
        </div>
        <p className="text-[10px] font-bold tracking-widest opacity-80">MTSN 3 KOTA TASIKMALAYA</p>
      </div>

      <div className="p-4 border-b border-green-800/50 bg-green-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {user?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate w-32">{user?.name}</p>
            <span className="text-[10px] bg-green-800 px-2 py-0.5 rounded-full uppercase tracking-wide text-green-200">{user?.role}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {permissions.includes('dashboard') && (
          <button onClick={() => setView('dashboard')} className={menuClass('dashboard')}><Menu size={18} /> Dashboard</button>
        )}
        
        {permissions.includes('absen-berjamaah') && (
          <button onClick={() => setView('absen-berjamaah')} className={menuClass('absen-berjamaah')}><QrCode size={18} /> Absen Berjamaah</button>
        )}
        
        {permissions.includes('absen-kesiangan') && (
          <button onClick={() => setView('absen-kesiangan')} className={menuClass('absen-kesiangan')}><AlertTriangle size={18} /> Absen Kesiangan</button>
        )}
        
        {permissions.includes('absen-ramadhan') && (
          <button onClick={() => setView('absen-ramadhan')} className={menuClass('absen-ramadhan')}><Moon size={18} /> Absen Ramadhan</button>
        )}
        
        {permissions.includes('lckh') && (
          <button onClick={() => setView('lckh')} className={menuClass('lckh')}><ClipboardList size={18} /> LCKH & LKB</button>
        )}

        {permissions.includes('user-management') && (
          <button onClick={() => setView('user-management')} className={menuClass('user-management')}><User size={18} /> Manajemen User</button>
        )}
      </nav>

      <div className="p-4">
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-600/90 hover:bg-red-600 text-white transition-colors shadow-lg group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform"/> Keluar
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => (
  <div className="space-y-6 animate-fade-in-up">
    <div className="bg-gradient-to-r from-green-700 to-teal-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
      <h2 className="text-3xl font-bold mb-2 relative z-10">Halo, {user.name.split(',')[0]}! 👋</h2>
      <p className="text-green-100 relative z-10">Selamat datang kembali di Dashboard Sistem Informasi.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div><p className="text-sm text-gray-500 font-medium">Absensi Hari Ini</p><h3 className="text-2xl font-bold text-gray-800">Hadir</h3></div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CheckCircle size={24}/></div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div><p className="text-sm text-gray-500 font-medium">Tanggal</p><h3 className="text-xl font-bold text-gray-800">{getFormattedDate(new Date())}</h3></div>
          <div className="p-2 bg-green-50 rounded-lg text-green-600"><Calendar size={24}/></div>
        </div>
      </div>
      {user.role !== 'staff' && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <div className="flex justify-between items-start mb-4">
             <div><p className="text-sm text-gray-500 font-medium">Laporan Kinerja</p><h3 className="text-lg font-bold text-gray-800">Isi LCKH</h3></div>
             <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><ClipboardList size={24}/></div>
           </div>
         </div>
      )}
    </div>
  </div>
);

// --- 1. KOMPONEN MODAL EDIT (Letakkan di atas LCKHManager atau di luar komponen apapun) ---
// --- 1. KOMPONEN MODAL EDIT (DIPERBAIKI) ---
const ModalEditLCKH = ({ onClose, data, onSave, activityList, nip }) => {
  // HAPUS baris: if (!isOpen) return null; agar Hooks selalu jalan
  
  const [formData, setFormData] = useState(data || {});
  const [unit, setUnit] = useState(data?.unit || '');

  useEffect(() => {
    if(data) {
        setFormData(data);
        const list = nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST;
        const act = list.find(a => a.name === data.activity);
        if (act) setUnit(act.unit);
    }
  }, [data, nip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'activity') {
        const list = nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST;
        const act = list.find(a => a.name === value);
        if (act) setUnit(act.unit);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, unit });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-green-700 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2"><Edit size={18}/> Edit LCKH</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded"><X size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" required /></div>
          <div>
            <label className="block text-sm font-medium mb-1">Kegiatan</label>
            <select name="activity" value={formData.activity || ''} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" required>
                <option value="">-- Pilih --</option>
                {activityList.map((a, i) => <option key={i} value={a.name}>{a.name}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Uraian</label><textarea name="desc" value={formData.desc || ''} onChange={handleChange} rows="3" className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" required></textarea></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Volume</label><input type="number" name="volume" min="1" value={formData.volume || 0} onChange={handleChange} className="w-full border p-2 rounded" required /></div>
            <div><label className="block text-sm font-medium mb-1">Satuan</label><input type="text" value={unit} readOnly className="w-full bg-gray-100 border p-2 rounded" /></div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Batal</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-md">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AbsenBerjamaah = ({ user, data, setData, holidays, setHolidays, addToast }) => {
  const [tab, setTab] = useState('scan');
  const [scanInput, setScanInput] = useState('');
  const [manualSearch, setManualSearch] = useState("");
  const [selectedClassRecap, setSelectedClassRecap] = useState('7A');
  const [startDate, setStartDate] = useState(getLocalISOString());
  const [endDate, setEndDate] = useState(getLocalISOString());
  const [isPrintAllClasses, setIsPrintAllClasses] = useState(false);

  const currentDate = getLocalISOString();
  const lastScanRef = useRef({ code: '', timestamp: 0 });
  const isPrivileged = user.role === 'admin' || user.role === 'teacher';
  const tabs = isPrivileged ? ['scan', 'manual', 'rekap-harian', 'rekap-range'] : ['scan', 'manual'];

  // HARI KERJA BERJAMAAH: SENIN(1) s.d KAMIS(4)
  const BERJAMAAH_DAYS = [1, 2, 3, 4]; 

  const isWorkingDay = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    // Hanya Senin-Kamis dan bukan hari libur
    if (!BERJAMAAH_DAYS.includes(day)) return false; 
    if (holidays.includes(dateStr)) return false;
    return true;
  };

  const processAttendance = async (studentId, status, viaMethod) => {
    if (!isWorkingDay(currentDate)) { 
        addToast('error', 'Layanan Tutup', 'Hari ini libur/bukan jadwal (Hanya Senin-Kamis).'); 
        return false; 
    }
    
    const student = STUDENTS.find(s => s.id === studentId);
    const localCheck = data.find(d => d.date === currentDate && d.studentId === studentId);
    
    if (localCheck) { 
        if (viaMethod === 'Scan') {
            addToast('info', 'Sudah Absen', `Siswa ${student.name} sudah tercatat hadir.`);
        } else {
            addToast('error', 'Gagal', `Siswa ${student.name} SUDAH absen hari ini!`);
        }
        return false; 
    }

    const { data: inserted, error } = await supabase.from('attendance').insert([{
      student_id: studentId, student_name: student.name, student_class: student.class,
      date: currentDate, status, category: 'berjamaah', method: viaMethod, officer: user.name
    }]).select();

    if (!error && inserted && inserted.length > 0) {
      const newRecord = { ...inserted[0], studentId: inserted[0].student_id };
      setData(prev => [...prev, newRecord]);

      if(viaMethod === 'Scan') {
        addToast('success', 'Scan Berhasil', `${student.name} - ${student.class}`);
      } else {
        addToast('success', 'Manual Berhasil', `Siswa ${student.name} tercatat ${status}.`);
      }
      return true;
    } else {
      addToast('error', 'Gagal', 'Koneksi Database Bermasalah.'); 
      return false;
    }
  };

  // Logic Scanner & Input Manual (TIDAK BERUBAH)
  useEffect(() => {
    let scanner = null;
    if (tab === 'scan') {
      import("html5-qrcode").then((plugin) => {
        scanner = new plugin.Html5Qrcode("reader");
        scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 300, height: 300 } }, 
          async (decodedText) => {
            const now = Date.now();
            if (decodedText === lastScanRef.current.code && (now - lastScanRef.current.timestamp < 2500)) return;
            lastScanRef.current = { code: decodedText, timestamp: now };
            
            const student = STUDENTS.find(s => s.code === decodedText);
            if (student) {
              scanner.pause();
              await processAttendance(student.id, 'Hadir', 'Scan');
              setTimeout(() => scanner.resume(), 1000);
            } else {
               addToast('error', 'QR Tidak Dikenal', 'Kode QR tidak terdaftar.');
            }
          }, () => {}).catch(console.error);
      });
    }
    return () => { if (scanner && scanner.isScanning) scanner.stop().catch(console.error); };
  }, [tab, data]);

  const handleScanInput = async (e) => {
    e.preventDefault();
    const student = STUDENTS.find(s => s.code === scanInput);
    if (!student) { addToast('error', 'Tidak Ditemukan', 'Barcode siswa tidak valid.'); return; }
    const success = await processAttendance(student.id, 'Hadir', 'Scan');
    if (success) setScanInput('');
  };

  const getStatus = (studentId, date) => data.find(d => d.date === date && d.studentId === studentId)?.status || '-';
  const manualStudents = STUDENTS.filter(s => s.name.toLowerCase().includes(manualSearch.toLowerCase()) || s.class.toLowerCase().includes(manualSearch.toLowerCase()));
  const classesToPrint = isPrintAllClasses ? Object.keys(WALI_KELAS_MAP) : [selectedClassRecap];

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><QrCode className="text-green-600"/> Absensi Berjamaah</h2>
        <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium text-gray-600">{getFormattedDate(new Date(currentDate))}</div>
      </div>

      <div className="flex space-x-2 border-b no-print overflow-x-auto pb-2 whitespace-nowrap">
        {tabs.map(t => (
           <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-t-lg transition-all ${tab === t ? 'bg-white border-b-2 border-green-600 text-green-700 font-bold shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}>
             {t === 'rekap-range' ? 'Rekap Mingguan/Range' : t.replace('-', ' ')}
           </button>
        ))}
        {isPrivileged && <button onClick={() => setTab('settings')} className="px-4 py-2 text-gray-500 hover:text-green-600">Libur</button>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm min-h-[400px] border border-gray-100">
        {tab === 'scan' && (
          <div className="max-w-lg mx-auto text-center space-y-6">
             <div className="w-full h-[400px] bg-black rounded-2xl overflow-hidden border-4 border-green-500 shadow-xl relative">
                <div id="reader" className="w-full h-full"></div>
                <div className="absolute bottom-4 left-0 right-0 text-white text-xs bg-black/50 py-1">Arahkan kamera ke QR Code Siswa</div>
             </div>
             <form onSubmit={handleScanInput} className="flex gap-2">
               <input type="text" value={scanInput} onChange={e => setScanInput(e.target.value)} placeholder="Scan Barcode Manual..." className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" autoFocus />
               <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-lg font-bold shadow-md transition-colors">Cek</button>
             </form>
          </div>
        )}

        {tab === 'manual' && (
          <div>
            <div className="mb-4 relative group">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-green-500" />
                <input type="text" className="pl-10 w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Cari Siswa (Nama / Kelas)..." value={manualSearch} onChange={(e) => setManualSearch(e.target.value)} />
            </div>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold text-left"><tr><th className="p-3">Nama</th><th className="p-3">Kelas</th><th className="p-3">Status Hari Ini</th></tr></thead>
                <tbody className="divide-y">
                  {manualStudents.slice(0, 50).map(s => { 
                    const st = getStatus(s.id, currentDate);
                    const isRec = data.some(d => d.date === currentDate && d.studentId === s.id);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="p-3">{s.name}</td><td className="p-3">{s.class}</td>
                        <td className="p-3 flex gap-2">
                          {/* TOMBOL HADIR DIHILANGKAN DI SINI SESUAI REQUEST */}
                          {['Sakit', 'Izin', 'Alfa', 'Haid'].map(status => (
                            <button 
                                key={status} 
                                disabled={isRec} 
                                onClick={() => processAttendance(s.id, status, 'Manual')} 
                                className={`px-3 py-1 text-xs rounded-full border transition-all 
                                    ${st === status ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-600'} 
                                    ${isRec ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                {status}
                            </button>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'rekap-harian' && isPrivileged && (
          <div className="animate-fade-in-up w-full">
             {/* PERBAIKAN: Style Mobile untuk controls */}
             <div className="flex flex-wrap items-center gap-2 mb-4 no-print bg-gray-50 p-3 rounded-lg border print-controls">
               <label className="font-bold text-gray-700">Kelas:</label>
               <select value={selectedClassRecap} onChange={(e) => setSelectedClassRecap(e.target.value)} className="border p-2 rounded bg-white">{Object.keys(WALI_KELAS_MAP).map(cls => <option key={cls} value={cls}>{cls}</option>)}</select>
               <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded ml-auto flex items-center gap-2 shadow-sm hover:bg-blue-700 justify-center"><Printer size={16}/> Print</button>
             </div>
             
             <div className="preview-wrapper">
               <div className="sheet">
                  <h3 className="text-center font-bold text-lg mb-4 uppercase">Rekap Absensi Berjamaah Harian ({getFormattedDate(new Date(currentDate))})</h3>
                  <p className="text-center font-bold mb-2">Kelas: {selectedClassRecap}</p>
                  <table className="w-full border-collapse border border-black text-sm">
                    <thead><tr className="bg-gray-200"><th className="border border-black p-2">No</th><th className="border border-black p-2">Nama</th><th className="border border-black p-2">Status</th><th className="border border-black p-2">Petugas</th></tr></thead>
                    <tbody>
                      {STUDENTS.filter(s => s.class === selectedClassRecap).map((s, idx) => {
                        const rec = data.find(d => d.date === currentDate && d.studentId === s.id);
                        return <tr key={s.id}><td className="border border-black p-1 text-center">{idx+1}</td><td className="border border-black p-1">{s.name}</td><td className="border border-black p-1 text-center">{rec?.status || (isWorkingDay(currentDate) ? 'Alfa' : '-')}</td><td className="border border-black p-1 text-center">{rec?.officer || '-'}</td></tr>;
                      })}
                    </tbody>
                  </table>
               </div>
             </div>
          </div>
        )}

        {tab === 'rekap-range' && isPrivileged && (
          <div className="animate-fade-in-up w-full">
            {/* PERBAIKAN: Style Mobile untuk controls */}
            <div className="flex flex-wrap items-center gap-4 mb-6 no-print bg-gray-50 p-4 rounded-lg border print-controls">
                <div className="flex flex-col w-full md:w-auto"><label className="text-xs font-bold mb-1">Mulai:</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
                <div className="flex flex-col w-full md:w-auto"><label className="text-xs font-bold mb-1">Sampai:</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
                <div className="flex flex-col w-full md:w-auto"><label className="text-xs font-bold mb-1">Kelas:</label><select value={selectedClassRecap} onChange={(e) => setSelectedClassRecap(e.target.value)} disabled={isPrintAllClasses} className="border p-2 rounded bg-white disabled:bg-gray-200">{Object.keys(WALI_KELAS_MAP).map(cls => <option key={cls} value={cls}>{cls}</option>)}</select></div>
                <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="printAll" checked={isPrintAllClasses} onChange={e => setIsPrintAllClasses(e.target.checked)} className="w-5 h-5 accent-green-600"/><label htmlFor="printAll" className="font-bold text-gray-700 cursor-pointer select-none">Cetak Semua Kelas</label></div>
                <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded ml-auto flex items-center gap-2 shadow-lg hover:bg-blue-700 font-bold justify-center"><Printer size={18}/> Print Laporan</button>
            </div>
            
            <div className="preview-wrapper">
               {classesToPrint.map((className) => {
                 const classStudents = STUDENTS.filter(s => s.class === className);
                 const wk = WALI_KELAS_MAP[className];
                 return (
                   <div key={className} className="sheet">
                      <div className="text-center border-b-2 border-black pb-4 mb-4">
                        <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                        <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                      </div>
                      <h3 className="text-center font-bold text-lg mb-1 uppercase">Rekap Absensi Berjamaah</h3>
                      <p className="text-center text-sm mb-4">Periode: {getShortDate(startDate)} s.d {getShortDate(endDate)}</p>
                      <p className="font-bold mb-2">Kelas: {className}</p>

                      {/* --- HITUNG HARI EFEKTIF UNTUK PERIODE INI --- */}
                      {(() => {
                          const totalEffectiveDays = countEffectiveDays(startDate, endDate, holidays, BERJAMAAH_DAYS);

                          return (
                            <table className="w-full border-collapse border border-black text-sm">
                                <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                                    <th className="border border-black p-2" style={{width: '40%'}}>Nama Siswa</th>
                                    <th className="border border-black p-2" style={{width: '11%'}}>Hadir</th>
                                    <th className="border border-black p-2" style={{width: '11%'}}>Sakit</th>
                                    <th className="border border-black p-2" style={{width: '11%'}}>Izin</th>
                                    {/* PERBAIKAN: Alfa dihitung otomatis */}
                                    <th className="border border-black p-2" style={{width: '11%'}}>Alfa</th>
                                    <th className="border border-black p-2" style={{width: '11%'}}>Haid</th>
                                </tr>
                                </thead>
                                <tbody>
                                {classStudents.map((s, idx) => {
                                    const stats = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0, Haid: 0 };
                                    data.filter(d => d.studentId === s.id && d.date >= startDate && d.date <= endDate).forEach(r => { 
                                        if(stats[r.status] !== undefined) stats[r.status]++ 
                                    });
                                    
                                    // HITUNG ALFA OTOMATIS: Total Hari Efektif - (Kehadiran + Alasan lain)
                                    // Alfa di database (jika ada input manual Alfa) tetap dihitung, tapi biasanya Alfa adalah sisa.
                                    // Jika Anda ingin Alfa MURNI sisa, gunakan rumus ini:
                                    const recordedDays = stats.Hadir + stats.Sakit + stats.Izin + stats.Haid; // + stats.Alfa (jika ada input manual alfa)
                                    // Kita asumsikan Alfa = (Hari Efektif - Recorded). Jika < 0 maka 0.
                                    // Namun, jika ada input manual "Alfa", itu harusnya ditambah.
                                    // Cara paling aman: Alfa = (TotalEffectiveDays - recordedDays). 
                                    // Jika ada input manual 'Alfa', itu berarti user secara eksplisit menandai alfa.
                                    
                                    // LOGIKA REQUEST: "otomatis alfa". Jadi yang tidak ada data = Alfa.
                                    let calculatedAlfa = totalEffectiveDays - recordedDays;
                                    if (calculatedAlfa < 0) calculatedAlfa = 0;
                                    
                                    // Tambahkan dengan alfa yang diinput manual (jika ada)
                                    const totalAlfa = calculatedAlfa + stats.Alfa; 

                                    return (
                                    <tr key={s.id}>
                                        <td className="border border-black p-1 text-center">{idx+1}</td>
                                        <td className="border border-black p-1">{s.name}</td>
                                        <td className="border border-black p-1 text-center">{stats.Hadir}</td>
                                        <td className="border border-black p-1 text-center">{stats.Sakit}</td>
                                        <td className="border border-black p-1 text-center">{stats.Izin}</td>
                                        <td className="border border-black p-1 text-center font-bold text-red-600">{totalAlfa}</td>
                                        <td className="border border-black p-1 text-center">{stats.Haid}</td>
                                    </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                          );
                      })()}

                      <div className="signature-section mt-8 flex justify-end">
                        <div className="text-center w-64">
                          <p>Tasikmalaya, {getTitimangsa(new Date())}</p>
                          <p>Wali Kelas {className}</p>
                          <br /><br /><br />
                          <p className="font-bold underline whitespace-nowrap">{wk.name}</p>
                          <p>NIP. {wk.nip}</p>
                        </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>
        )}
        
        {tab === 'settings' && isPrivileged && (
          <div><h3 className="font-bold mb-4">Pengaturan Hari Libur</h3><div className="flex gap-2 mb-4"><input type="date" id="holidayInput" className="border p-2 rounded" /><button onClick={() => { const val = document.getElementById('holidayInput').value; if(val) { setHolidays([...holidays, val]); addToast('success','Disimpan','Hari libur ditambahkan'); } }} className="bg-red-600 text-white px-4 py-2 rounded">Tambah</button></div><ul className="list-disc pl-5">{holidays.map(h => <li key={h} className="text-red-600">{getFormattedDate(new Date(h))} <button onClick={() => setHolidays(holidays.filter(x => x !== h))} className="ml-2 text-gray-400 text-xs">(Hapus)</button></li>)}</ul></div>
        )}
      </div>
    </div>
  );
};

const AbsenKesiangan = ({ user, data, setData, addToast }) => {
  // Tambah mode 'daily-print'
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'daily-print', 'monthly'
  const [selectedDate, setSelectedDate] = useState(getLocalISOString());
  const [studentId, setStudentId] = useState('');
  const [reason, setReason] = useState('');
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState('All'); 
  const [rekapMonth, setRekapMonth] = useState(new Date().getMonth());
  const [rekapYear, setRekapYear] = useState(new Date().getFullYear());

  const isPrivileged = user.role === 'admin' || user.role === 'teacher';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) { addToast('error', 'Belum Dipilih', 'Silakan pilih siswa terlebih dahulu.'); return; }
    
    const student = STUDENTS.find(s => s.id === parseInt(studentId));
    if (!student) return;

    const { data: inserted, error } = await supabase.from('attendance').insert([{
      student_id: student.id, student_name: student.name, student_class: student.class,
      date: selectedDate, reason, category: 'kesiangan', officer: user.name
    }]).select();

    if (!error) {
      setData([...data, { ...inserted[0], studentId: student.id, studentName: student.name, class: student.class }]);
      addToast('success', 'Tersimpan', `Siswa ${student.name} tercatat kesiangan.`);
      setStudentId(''); setReason(''); setStudentSearch('');
    } else {
      addToast('error', 'Gagal', 'Terjadi kesalahan sistem.');
    }
  };

  const filteredStudentOptions = STUDENTS.filter(s => (s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.class.toLowerCase().includes(studentSearch.toLowerCase())) && (selectedClass === 'All' || s.class === selectedClass));
  
  const dailyData = data.filter(d => d.date === selectedDate && (selectedClass === 'All' || d.class === selectedClass));
  const monthlyData = data.filter(d => {
    const rd = new Date(d.date);
    return rd.getMonth() === rekapMonth && rd.getFullYear() === rekapYear && (selectedClass === 'All' || d.class === selectedClass);
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><AlertTriangle className="text-orange-500"/> Absensi Kesiangan</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setViewMode('daily')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'daily' || viewMode === 'daily-print' ? 'bg-white text-orange-600 shadow-sm font-bold' : 'text-gray-500'}`}>Harian</button>
          {isPrivileged && <button onClick={() => setViewMode('monthly')} className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'monthly' ? 'bg-white text-orange-600 shadow-sm font-bold' : 'text-gray-500'}`}>Rekap Bulanan</button>}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 no-print bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <label className="text-xs font-bold text-gray-500 uppercase">Filter Kelas:</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border p-2 rounded-md text-sm bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none">
          <option value="All">Semua Kelas</option>
          {Object.keys(WALI_KELAS_MAP).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {viewMode === 'monthly' && (
          <>
            <select value={rekapMonth} onChange={e => setRekapMonth(parseInt(e.target.value))} className="border p-2 rounded-md text-sm bg-gray-50">{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
            <select value={rekapYear} onChange={e => setRekapYear(parseInt(e.target.value))} className="border p-2 rounded-md text-sm bg-gray-50">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
          </>
        )}
      </div>
      
      {/* --- MODE HARIAN & CETAK HARIAN --- */}
      {(viewMode === 'daily' || viewMode === 'daily-print') && (
        <>
          {/* Tampilan Input & List di Layar (Mode: daily) */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${viewMode === 'daily-print' ? 'hidden' : ''}`}>
            {/* Form Input */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h3 className="font-bold mb-4 text-orange-700 flex items-center gap-2"><Edit size={18}/> Input Siswa Terlambat</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" /></div>
                 <div><label className="block text-sm font-medium mb-1">Cari Siswa</label><input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Ketik nama untuk memfilter..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Pilih Siswa</label>
                   <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white" required size={5}>
                      {filteredStudentOptions.length === 0 && <option disabled>Tidak ada siswa ditemukan</option>}
                      {filteredStudentOptions.map(s => <option key={s.id} value={s.id} className="p-1">{s.name} - {s.class}</option>)}
                   </select>
                 </div>
                 <div><label className="block text-sm font-medium mb-1">Alasan</label><input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Contoh: Bangun kesiangan" required /></div>
                 <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-md transition-all">Simpan Data</button>
              </form>
            </div>

            {/* Daftar Harian */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                  <h3 className="font-bold text-gray-700">Daftar Terlambat ({getFormattedDate(new Date(selectedDate))})</h3>
                  {/* Tombol ini sekarang mengubah mode ke 'daily-print' agar masuk mode kertas A4 */}
                  <button onClick={() => setViewMode('daily-print')} className="no-print text-blue-600 hover:bg-blue-50 p-2 rounded-lg text-sm flex gap-1 transition-colors"><Printer size={16}/> Preview & Print</button>
              </div>
              <div className="overflow-y-auto max-h-[500px]">
                  {dailyData.length === 0 ? <p className="text-center text-gray-400 py-10 italic">Tidak ada data keterlambatan.</p> : (
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-white"><tr className="bg-orange-50 text-orange-800"><th className="p-3 text-left rounded-l-lg">Nama</th><th className="p-3 text-left">Kelas</th><th className="p-3 text-left rounded-r-lg">Alasan</th></tr></thead>
                        <tbody className="divide-y">
                            {dailyData.map(d => <tr key={d.id} className="hover:bg-gray-50"><td className="p-3 font-medium">{d.studentName}</td><td className="p-3 text-gray-500">{d.class}</td><td className="p-3 text-gray-600 italic">{d.reason}</td></tr>)}
                        </tbody>
                      </table>
                  )}
              </div>
            </div>
          </div>

          {/* Tampilan CETAK HARIAN (Mode: daily-print) - Mirip Sheet LCKH */}
          {viewMode === 'daily-print' && (
             <div className="w-full animate-fade-in-up">
                <div className="no-print flex justify-between bg-gray-100 p-4 rounded-lg mb-4 items-center">
                   <button onClick={() => setViewMode('daily')} className="text-gray-600 hover:text-black font-bold flex gap-2 items-center"><X size={18}/> Kembali</button>
                   <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2"><Printer size={18}/> Cetak Sekarang</button>
                </div>
                
                <div className="preview-wrapper">
                   <div className="sheet">
                      <div className="text-center border-b-2 border-black pb-4 mb-4">
                         <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                         <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                      </div>
                      <h3 className="text-center font-bold text-lg mb-4 uppercase">Laporan Siswa Terlambat Harian</h3>
                      <p className="text-center mb-4">Tanggal: {getFormattedDate(new Date(selectedDate))}</p>
                      
                      <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                            <th className="border border-black p-2" style={{width: '40%'}}>Nama Siswa</th>
                            <th className="border border-black p-2" style={{width: '15%'}}>Kelas</th>
                            <th className="border border-black p-2" style={{width: '40%'}}>Alasan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dailyData.length === 0 ? (
                             <tr><td colSpan="4" className="border border-black p-4 text-center italic">Tidak ada siswa terlambat hari ini.</td></tr>
                          ) : (
                             dailyData.map((d, i) => (
                               <tr key={d.id}>
                                 <td className="border border-black p-2 text-center">{i+1}</td>
                                 <td className="border border-black p-2">{d.studentName}</td>
                                 <td className="border border-black p-2 text-center">{d.class}</td>
                                 <td className="border border-black p-2">{d.reason}</td>
                               </tr>
                             ))
                          )}
                        </tbody>
                      </table>
                      
                      <div className="mt-8 flex justify-end no-break-inside">
                         <div className="text-center w-64">
                            <p>Tasikmalaya, {getTitimangsa(new Date(selectedDate))}</p>
                            <p>Petugas Piket,</p>
                            <br/><br/><br/>
                            <p className="font-bold underline">{user.name}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </>
      )}

      {/* --- MODE REKAP BULANAN --- */}
      {viewMode === 'monthly' && isPrivileged && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
             <div className="flex justify-end mb-4 no-print"><button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"><Printer size={16} /> Print Laporan</button></div>
             <div className="print-area overflow-x-auto">
               {/* Gunakan class 'sheet' agar style print konsisten */}
               <div className="sheet mx-auto shadow-none"> 
                   <div className="text-center border-b-2 border-black pb-4 mb-4">
                      <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                      <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                   </div>
                   <h3 className="text-center font-bold text-lg mb-4 uppercase">Rekap Absensi Kesiangan ({MONTHS[rekapMonth]} {rekapYear})</h3>
                   <table className="w-full text-sm border-collapse border border-black min-w-[600px]">
                     <thead><tr className="bg-gray-200"><th className="border border-black p-2">No</th><th className="border border-black p-2">Tanggal</th><th className="border border-black p-2">Nama</th><th className="border border-black p-2">Kelas</th><th className="border border-black p-2">Alasan</th></tr></thead>
                     <tbody>{monthlyData.map((d, idx) => <tr key={d.id}><td className="border border-black p-2 text-center">{idx+1}</td><td className="border border-black p-2 text-center">{getShortDate(d.date)}</td><td className="border border-black p-2">{d.studentName}</td><td className="border border-black p-2 text-center">{d.class}</td><td className="border border-black p-2">{d.reason}</td></tr>)}</tbody>
                   </table>
               </div>
             </div>
          </div>
      )}
    </div>
  );
};

const AbsenRamadhan = ({ user, data, setData, holidays, setHolidays, addToast }) => {
  const [tab, setTab] = useState('scan');
  const [selectedClass, setSelectedClass] = useState('7A');
  const [manualSearch, setManualSearch] = useState("");
  const [scanInput, setScanInput] = useState('');
  const [startDate, setStartDate] = useState(getLocalISOString());
  const [endDate, setEndDate] = useState(getLocalISOString());
  const [isPrintAllClasses, setIsPrintAllClasses] = useState(false);

  const currentDate = getLocalISOString();
  const lastScanRef = useRef({ code: '', timestamp: 0 });
  const isPrivileged = user.role === 'admin' || user.role === 'teacher';
  const tabs = isPrivileged ? ['scan', 'manual', 'rekap-harian', 'rekap-range'] : ['scan', 'manual'];

  // HARI KERJA RAMADHAN: SENIN(1) s.d JUMAT(5)
  const RAMADHAN_DAYS = [1, 2, 3, 4, 5];

  const isRamadhanDay = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    // Hanya Senin-Jumat dan bukan libur
    if (!RAMADHAN_DAYS.includes(day)) return false;
    if (holidays.includes(dateStr)) return false;
    return true;
  };

  const processAttendance = async (studentId, status, viaMethod) => {
    if (!isRamadhanDay(currentDate)) { addToast('error', 'Bukan Jadwal', 'Hari ini bukan jadwal kegiatan Ramadhan.'); return false; }
    
    const student = STUDENTS.find(s => s.id === studentId);
    
    // CEK DUPLIKASI
    const localCheck = data.find(d => d.date === currentDate && d.studentId === studentId);
    if (localCheck) { 
        if(viaMethod !== 'Scan') addToast('error', 'Gagal', `Siswa ${student.name} sudah absen.`);
        else addToast('info', 'Sudah Hadir', `Siswa ${student.name} sudah tercatat.`);
        return false; 
    }

    const { data: inserted, error } = await supabase.from('attendance').insert([{
      student_id: studentId, student_name: student.name, student_class: student.class,
      date: currentDate, status, category: 'ramadhan', method: viaMethod, officer: user.name
    }]).select();

    if (!error && inserted && inserted.length > 0) {
      const newRecord = { ...inserted[0], studentId: inserted[0].student_id };
      setData(prev => [...prev, newRecord]);

      if (viaMethod === 'Scan') addToast('success', 'Ramadhan', `${student.name} Hadir`);
      else addToast('success', 'Manual Berhasil', `Siswa ${student.name} tercatat ${status}.`);
      return true;
    } else {
      addToast('error', 'Gagal', 'Koneksi Database Bermasalah.'); 
      return false;
    }
  };

  // Logic Scan & Manual (Sama seperti sebelumnya)
  useEffect(() => {
    let scanner = null;
    if (tab === 'scan') {
      import("html5-qrcode").then((plugin) => {
        scanner = new plugin.Html5Qrcode("reader-ramadhan");
        scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, 
          async (decodedText) => {
            const now = Date.now();
            if (decodedText === lastScanRef.current.code && (now - lastScanRef.current.timestamp < 3000)) return; 
            lastScanRef.current = { code: decodedText, timestamp: now };
            const student = STUDENTS.find(s => s.code === decodedText);
            if (student) {
              scanner.pause();
              await processAttendance(student.id, 'Hadir', 'Scan');
              setTimeout(() => scanner.resume(), 1500);
            }
          }, () => {}).catch(console.error);
      });
    }
    return () => { if (scanner && scanner.isScanning) scanner.stop().catch(console.error); };
  }, [tab, data]);

  const handleScanInput = async (e) => {
      e.preventDefault();
      const student = STUDENTS.find(s => s.code === scanInput);
      if (!student) { addToast('error', 'Salah', 'Barcode tidak ditemukan'); return; }
      const success = await processAttendance(student.id, 'Hadir', 'Scan');
      if (success) setScanInput('');
  };

  const getStatus = (studentId, date) => data.find(d => d.date === date && d.studentId === studentId)?.status || '-';
  const manualStudents = STUDENTS.filter(s => s.name.toLowerCase().includes(manualSearch.toLowerCase()));
  const classesToPrint = isPrintAllClasses ? Object.keys(WALI_KELAS_MAP) : [selectedClass];

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Header & Tabs ... */}
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Moon className="text-purple-600"/> Absen Ramadhan</h2>
        <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm text-gray-600">{getFormattedDate(new Date(currentDate))}</div>
      </div>

      <div className="flex space-x-2 border-b no-print overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize transition-all rounded-t-lg ${tab===t ? 'bg-white border-b-2 border-purple-600 font-bold text-purple-700 shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}>{t === 'rekap-range' ? 'Rekap Mingguan/Range' : t.replace('-', ' ')}</button>)}
        {isPrivileged && <button onClick={() => setTab('settings')} className="px-4 py-2 text-gray-500 hover:text-purple-600">Libur</button>}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm min-h-[400px] border border-gray-100">
        {tab === 'scan' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-full h-[350px] bg-black rounded-2xl overflow-hidden border-4 border-purple-500 shadow-xl relative">
                <div id="reader-ramadhan" className="w-full h-full"></div>
                <div className="absolute bottom-2 left-0 right-0 text-white text-xs bg-black/50 py-1">Mode Ramadhan Aktif</div>
            </div>
            <form onSubmit={handleScanInput} className="flex gap-2">
              <input type="text" value={scanInput} onChange={e => setScanInput(e.target.value)} placeholder="Scan Alat Tembak..." className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" autoFocus />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg font-bold shadow-md">Cek</button>
            </form>
          </div>
        )}

        {/* --- BAGIAN MANUAL (PERBAIKAN: HAPUS TOMBOL HADIR) --- */}
        {tab === 'manual' && (
          <div>
            <div className="mb-4 relative group">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" className="w-full border p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Cari Siswa..." value={manualSearch} onChange={e => setManualSearch(e.target.value)} />
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-50"><tr className="text-left text-gray-600"><th className="p-3">Nama</th><th className="p-3">Kls</th><th className="p-3">Status Hari Ini</th></tr></thead>
                  <tbody className="divide-y">
                    {manualStudents.slice(0,50).map(s => {
                        const st = getStatus(s.id, currentDate);
                        const isRec = data.some(d => d.date === currentDate && d.studentId === s.id);
                        return (
                            <tr key={s.id} className="hover:bg-purple-50/30">
                                <td className="p-3 font-medium">{s.name}</td><td className="p-3">{s.class}</td>
                                <td className="p-3 flex gap-1">
                                    {/* PERBAIKAN: Array status tidak ada 'Hadir' */}
                                    {['Sakit', 'Izin', 'Alfa', 'Haid'].map(status => (
                                        <button 
                                            key={status} 
                                            disabled={isRec} 
                                            onClick={() => processAttendance(s.id, status, 'Manual')} 
                                            className={`px-2 py-1 border rounded text-xs transition-all 
                                                ${st === status ? 'bg-purple-600 text-white border-purple-600' : 'bg-white hover:bg-purple-100 text-gray-600'} 
                                                ${isRec ? 'opacity-30 cursor-not-allowed' : 'hover:bg-purple-100'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </td>
                            </tr>
                        )
                    })}
                  </tbody>
                </table>
            </div>
          </div>
        )}

        {/* REKAP HARIAN RAMADHAN - FULL RENDER LOGIC */}
        {tab === 'rekap-harian' && isPrivileged && (
             <div className="animate-fade-in-up w-full">
                 <div className="flex flex-wrap items-center gap-2 mb-4 no-print bg-gray-50 p-3 rounded-lg border print-controls">
                    <label className="font-bold text-gray-700">Kelas:</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-1 rounded">{Object.keys(WALI_KELAS_MAP).map(c => <option key={c} value={c}>{c}</option>)}</select>
                    <button onClick={() => window.print()} className="ml-auto bg-blue-600 text-white px-4 py-1 rounded flex gap-2 justify-center"><Printer size={16}/> Print</button>
                 </div>
                 
                 {/* PREVIEW WRAPPER */}
                 <div className="preview-wrapper">
                    <div className="sheet">
                        <h3 className="text-center font-bold mb-4 uppercase">Rekap Absensi Ramadhan ({getFormattedDate(new Date(currentDate))})</h3>
                        <p className="text-center font-bold mb-2">Kelas: {selectedClass}</p>
                        <table className="w-full border-collapse border border-black text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                              <th className="border border-black p-2" style={{width: '45%'}}>Nama</th>
                              <th className="border border-black p-2" style={{width: '20%'}}>Status</th>
                              <th className="border border-black p-2" style={{width: '30%'}}>Petugas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {STUDENTS.filter(s => s.class === selectedClass).map((s, i) => {
                              const rec = data.find(d => d.date === currentDate && d.studentId === s.id);
                              return (
                                <tr key={s.id}>
                                  <td className="border border-black p-1 text-center">{i+1}</td>
                                  <td className="border border-black p-1">{s.name}</td>
                                  <td className="border border-black p-1 text-center">{rec?.status || (isRamadhanDay(currentDate) ? 'Alfa' : '-')}</td>
                                  <td className="border border-black p-1 text-center">{rec?.officer || '-'}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                    </div>
                 </div>
             </div>
        )}

        {/* REKAP RANGE RAMADHAN - FULL RENDER LOGIC */}
        {tab === 'rekap-range' && isPrivileged && (
             <div className="animate-fade-in-up w-full">
                 <div className="flex flex-wrap items-center gap-4 mb-6 no-print bg-gray-50 p-4 rounded-lg border print-controls">
                    <div className="flex flex-col w-full md:w-auto"><label className="text-xs font-bold mb-1">Mulai:</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
                    <div className="flex flex-col w-full md:w-auto"><label className="text-xs font-bold mb-1">Sampai:</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
                    <div className="flex flex-col w-full md:w-auto"><label className="text-xs font-bold mb-1">Kelas:</label><select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={isPrintAllClasses} className="border p-2 rounded bg-white disabled:bg-gray-200">{Object.keys(WALI_KELAS_MAP).map(cls => <option key={cls} value={cls}>{cls}</option>)}</select></div>
                    <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="printAllRamadhan" checked={isPrintAllClasses} onChange={e => setIsPrintAllClasses(e.target.checked)} className="w-5 h-5 accent-green-600"/><label htmlFor="printAllRamadhan" className="font-bold text-gray-700 cursor-pointer select-none">Cetak Semua Kelas</label></div>
                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded ml-auto flex items-center gap-2 shadow-lg hover:bg-blue-700 font-bold justify-center"><Printer size={18}/> Print Laporan</button>
                 </div>
                 
                 <div className="preview-wrapper">
                    {classesToPrint.map((className) => {
                       const classStudents = STUDENTS.filter(s => s.class === className);
                       const wk = WALI_KELAS_MAP[className];
                       return (
                         <div key={className} className="sheet">
                            <div className="text-center border-b-2 border-black pb-4 mb-4">
                              <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                              <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                            </div>
                            <h3 className="text-center font-bold text-lg mb-1 uppercase">Rekap Absensi Ramadhan</h3>
                            <p className="text-center text-sm mb-4">Periode: {getShortDate(startDate)} s.d {getShortDate(endDate)}</p>
                            <p className="font-bold mb-2">Kelas: {className}</p>
                            
                            {(() => {
                                const totalEffectiveDays = countEffectiveDays(startDate, endDate, holidays, RAMADHAN_DAYS);
                                return (
                                <table className="w-full border-collapse border border-black text-sm">
                                  <thead>
                                    <tr className="bg-gray-200">
                                      <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                                      <th className="border border-black p-2" style={{width: '40%'}}>Nama Siswa</th>
                                      <th className="border border-black p-2" style={{width: '13%'}}>Hadir</th>
                                      <th className="border border-black p-2" style={{width: '13%'}}>Sakit</th>
                                      <th className="border border-black p-2" style={{width: '13%'}}>Izin</th>
                                      <th className="border border-black p-2" style={{width: '16%'}}>Alfa</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {classStudents.map((s, idx) => {
                                       const stats = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 };
                                       data.filter(d => d.studentId === s.id && d.date >= startDate && d.date <= endDate).forEach(r => { if(stats[r.status] !== undefined) stats[r.status]++ });
                                       
                                       const recordedDays = stats.Hadir + stats.Sakit + stats.Izin;
                                       let calculatedAlfa = totalEffectiveDays - recordedDays;
                                       if (calculatedAlfa < 0) calculatedAlfa = 0;
                                       const totalAlfa = calculatedAlfa + stats.Alfa;

                                       return (
                                         <tr key={s.id}>
                                           <td className="border border-black p-1 text-center">{idx+1}</td>
                                           <td className="border border-black p-1">{s.name}</td>
                                           <td className="border border-black p-1 text-center">{stats.Hadir}</td>
                                           <td className="border border-black p-1 text-center">{stats.Sakit}</td>
                                           <td className="border border-black p-1 text-center">{stats.Izin}</td>
                                           <td className="border border-black p-1 text-center font-bold text-red-600">{totalAlfa}</td>
                                         </tr>
                                       )
                                    })}
                                  </tbody>
                                </table>
                                );
                            })()}

                            <div className="signature-section mt-8 flex justify-end">
                              <div className="text-center w-64">
                                <p>Tasikmalaya, {getTitimangsa(new Date())}</p>
                                <p>Wali Kelas {className}</p>
                                <br /><br /><br />
                                <p className="font-bold underline whitespace-nowrap">{wk.name}</p>
                                <p>NIP. {wk.nip}</p>
                              </div>
                            </div>
                         </div>
                       );
                    })}
                 </div>
             </div>
        )}
        
        {/* ... (Settings sama) ... */}
        {tab === 'settings' && isPrivileged && (
          <div><h3 className="font-bold mb-2">Libur Ramadhan</h3><div className="flex gap-2"><input type="date" id="ramadhanHoliday" className="border p-2 rounded"/><button onClick={()=>{const v=document.getElementById('ramadhanHoliday').value; if(v) {setHolidays([...holidays, v]); addToast('success','Disimpan','Jadwal libur ditambahkan')}}} className="bg-purple-600 text-white px-4 py-2 rounded">Tambah</button></div>
          <ul className="mt-4 list-disc pl-5">{holidays.map(h => <li key={h} className="text-purple-700">{getFormattedDate(new Date(h))}</li>)}</ul></div>
        )}
      </div>
    </div>
  );
};

// --- KOMPONEN COVER HALAMAN DEPAN ---
const CoverPage = ({ user, month, year }) => {
  return (
    <div className="a4-page relative h-[250mm] w-full bg-white overflow-hidden flex flex-col justify-center pl-8 pr-4 text-left font-sans">
      
      {/* --- HIASAN GEOMETRIS (Tetap ada, tapi container z-index diatur) --- */}
      {/* Pojok Kanan Atas */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] pointer-events-none opacity-90">
         <div className="absolute top-0 right-0 w-0 h-0 border-l-[120px] border-l-transparent border-t-[120px] border-t-teal-600"></div>
         <div className="absolute top-[50px] right-[50px] w-16 h-16 bg-orange-400 rounded-full opacity-80"></div>
         <div className="absolute top-0 right-[120px] w-0 h-0 border-l-[80px] border-l-transparent border-t-[80px] border-t-yellow-400 opacity-90"></div>
      </div>

      {/* Pojok Kiri Bawah */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] pointer-events-none opacity-90">
         <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[160px] border-r-transparent border-b-[160px] border-b-orange-500"></div>
         <div className="absolute bottom-[40px] left-[40px] w-24 h-24 bg-teal-700 rounded-full opacity-90"></div>
         <div className="absolute bottom-0 left-[160px] w-0 h-0 border-r-[120px] border-r-transparent border-b-[120px] border-b-yellow-500 opacity-80"></div>
         <div className="absolute bottom-[140px] left-0 w-0 h-0 border-r-[80px] border-r-transparent border-b-[80px] border-b-teal-500 opacity-80"></div>
      </div>

      {/* --- KONTEN TEKS (Ukuran Font Diperkecil) --- */}
      <div className="relative z-10 space-y-1 mt-[-60px]"> {/* Margin top negatif dikurangi */}
        {/* LOGO KEMENAG */}
        <div className="mb-6">
          <img 
            src="/logo kemenag.png" 
            alt="Logo Kementerian Agama" 
            className="w-28 h-auto" /* Ukuran logo disesuaikan (lebar 28 tailwind / 7rem) */
          />
        </div>
        
        {/* Tagline Kecil */}
        <p className="text-gray-500 italic text-xs mb-3">Maju, bermutu, dan mendunia</p>

        {/* Instansi - Font size dikurangi dari 5xl ke 4xl/3xl */}
        <h1 className="text-4xl font-extrabold text-teal-900 leading-tight tracking-wide">
          MTS NEGERI 3<br />
          KOTA TASIKMALAYA
        </h1>

        {/* Garis Dekorasi - Lebih tipis/pendek */}
        <div className="w-24 h-1.5 bg-orange-500 my-6"></div>

        {/* Judul Laporan - Font size dikurangi */}
        <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
          LAPORAN KINERJA<br />
          BULANAN
        </h2>

        {/* Bulan & Tahun */}
        <p className="text-xl text-gray-600 font-medium mt-2 mb-10">
          Bulan {MONTHS[month]} {year}
        </p>

        {/* Identitas Guru - Padding dikurangi */}
        <div className="space-y-1 mt-8">
          <p className="text-sm text-gray-500 mb-1">Disusun Oleh:</p>
          <h3 className="text-2xl font-bold text-black sentence case">{user.name}</h3>
          <p className="text-lg text-gray-700 font-semibold tracking-wide">NIP. {user.nip}</p>
        </div>

        {/* Daftar Isi Singkat - Font size dikurangi */}
        <div className="mt-12 space-y-1 text-base text-gray-500 font-medium border-l-4 border-gray-300 pl-4">
          <p>1. Laporan Capaian Kinerja Bulanan</p>
          <p>2. Laporan Capaian Kinerja Harian</p>
          <p>3. Presensi Kehadiran</p>
        </div>
      </div>

      {/* Tahun di Pojok Kanan Bawah */}
      <div className="absolute bottom-8 right-8 text-5xl font-bold text-gray-200 select-none">
        {year}
      </div>

    </div>
  );
};
// --- 2. KOMPONEN LCKH MANAGER (DIPERBAIKI UNTUK CETAK PROFIL) ---
const LCKHManager = ({ user, data, setData, profiles, setProfiles, addToast }) => {
  const [mode, setMode] = useState('input');
  
  // Ambil profil dari global state, atau default III.a
  const [profile, setProfile] = useState(profiles[user.nip] || { golongan: 'III.a' });

  // PERBAIKAN PENTING: Sinkronisasi State!
  // Kode ini memastikan kalau 'profiles' global berubah (setelah save),
  // tampilan dan data cetak ikut berubah otomatis tanpa reload.
  useEffect(() => {
     if (profiles[user.nip]) {
         setProfile(profiles[user.nip]);
     }
  }, [profiles, user.nip]);
  
  // State untuk Input Baru
  const [inputDate, setInputDate] = useState(getLocalISOString());
  const [inputActivity, setInputActivity] = useState('');
  const [inputDesc, setInputDesc] = useState('');
  const [inputVolume, setInputVolume] = useState(1);
  const [inputUnit, setInputUnit] = useState('');

  // State untuk Modal Edit (Pop-up)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State Cetak
  const [printMonth, setPrintMonth] = useState(new Date().getMonth());
  const [printYear, setPrintYear] = useState(new Date().getFullYear());

  const activityList = user.nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST;

  useEffect(() => {
    if (!activityList) return;
    const act = activityList.find(a => a.name === inputActivity);
    if (act) setInputUnit(act.unit);
  }, [inputActivity]);

  const handleProfileSave = () => { 
      // Simpan ke state global
      setProfiles(prev => ({ ...prev, [user.nip]: profile })); 
      addToast('success', 'Profil Tersimpan', 'Pangkat & Golongan diperbarui untuk cetak.');
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    const newRecord = { user_nip: user.nip, date: inputDate, activity: inputActivity, volume: inputVolume, unit: inputUnit, description: inputDesc };
    
    const { data: inserted, error } = await supabase.from('lckh').insert([newRecord]).select();
    if (!error && inserted) {
      setData([...data, { ...inserted[0], userId: inserted[0].user_nip, desc: inserted[0].description }]);
      addToast('success', 'Data Tersimpan', 'Laporan kinerja harian berhasil ditambahkan.');
      setInputActivity(''); setInputDesc(''); setInputVolume(1);
    } else {
      addToast('error', 'Gagal Simpan', 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updatedData) => {
    const { error } = await supabase.from('lckh').update({
        date: updatedData.date, activity: updatedData.activity, description: updatedData.desc, volume: updatedData.volume, unit: updatedData.unit
    }).eq('id', updatedData.id);

    if (!error) {
        setData(data.map(item => item.id === updatedData.id ? updatedData : item));
        setIsEditModalOpen(false);
        setEditingItem(null);
        addToast('success', 'Update Berhasil', 'Data LCKH berhasil diperbarui.');
    } else {
        addToast('error', 'Update Gagal', 'Gagal memperbarui data di server.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data LCKH ini?')) {
      const { error } = await supabase.from('lckh').delete().eq('id', id);
      if (!error) {
          setData(data.filter(i => i.id !== id));
          addToast('info', 'Terhapus', 'Data LCKH telah dihapus.');
      }
    }
  };

  const userRank = GOLONGAN_MAP[profile.golongan] || {};
  const filteredData = data.filter(d => d.userId === user.nip && new Date(d.date).getMonth() === printMonth && new Date(d.date).getFullYear() === printYear);
  const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));

  const lkbData = Object.values(sortedData.reduce((acc, curr) => {
    if (!acc[curr.activity]) acc[curr.activity] = { ...curr, volume: 0, doc: getDocName(curr.activity, user.nip) };
    acc[curr.activity].volume += parseInt(curr.volume);
    return acc;
  }, {}));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print bg-white p-4 rounded-xl shadow-sm">
         <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><ClipboardList className="text-green-600"/> LCKH & LKB</h2>
         <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
           <button onClick={() => setMode('input')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'input' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Input Data</button>
           <button onClick={() => setMode('print-view')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'print-view' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Cetak Laporan</button>
         </div>
      </div>

      {mode === 'input' && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
              <h3 className="font-bold border-b pb-3 mb-4 text-gray-700 flex items-center gap-2"><User size={18}/> Profil Pegawai</h3>
              <div className="space-y-4">
                <div><label className="text-xs text-gray-500 uppercase font-bold">Nama</label><div className="font-medium text-gray-800">{user.name}</div></div>
                <div>
                    <label className="text-xs text-gray-500 uppercase font-bold">Golongan</label>
                    <select 
                        value={profile.golongan} 
                        onChange={e => setProfile({...profile, golongan: e.target.value})} 
                        className="w-full border p-2 rounded mt-1 bg-gray-50 text-sm"
                    >
                        {Object.keys(GOLONGAN_MAP).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="text-xs bg-green-50 p-3 rounded text-green-800 border border-green-100"><p><span className="font-bold">Pangkat:</span> {userRank.pangkat}</p><p><span className="font-bold">Jabatan:</span> {userRank.jabatan}</p></div>
                <button onClick={handleProfileSave} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"><Save size={16}/> Simpan Profil</button>
              </div>
            </div>

            <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h3 className="font-bold border-b pb-3 mb-4 text-gray-700 flex items-center gap-2"><Save size={18}/> Input Kinerja Harian</h3>
               <form onSubmit={handleInputSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1 block">Tanggal</label><input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" required /></div>
                    <div><label className="text-sm font-medium mb-1 block">Kegiatan</label><select value={inputActivity} onChange={e => setInputActivity(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" required><option value="">-- Pilih Kegiatan --</option>{activityList.map((a, i) => <option key={i} value={a.name}>{a.name}</option>)}</select></div>
                 </div>
                 <div><label className="text-sm font-medium mb-1 block">Uraian Kegiatan</label><textarea value={inputDesc} onChange={e => setInputDesc(e.target.value)} rows="2" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" placeholder="Deskripsikan output kegiatan..." required></textarea></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium mb-1 block">Volume</label><input type="number" min="1" value={inputVolume} onChange={e => setInputVolume(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded-lg" required /></div>
                    <div><label className="text-sm font-medium mb-1 block">Satuan</label><input value={inputUnit} readOnly className="w-full bg-gray-100 border border-gray-300 p-2.5 rounded-lg text-gray-500" /></div>
                 </div>
                 <div className="pt-2">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md transition-all flex items-center gap-2"><Save size={18}/> Simpan Laporan</button>
                 </div>
              </form>
            </div>
          </div>
          
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="font-bold text-gray-700 text-lg">Riwayat Input</h3>
                <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
                   <span className="text-xs font-bold text-gray-500 uppercase">Filter:</span>
                   <select value={printMonth} onChange={e => setPrintMonth(parseInt(e.target.value))} className="bg-white border p-1.5 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none">{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
                   <select value={printYear} onChange={e => setPrintYear(parseInt(e.target.value))} className="bg-white border p-1.5 rounded text-sm focus:ring-1 focus:ring-green-500 outline-none">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
                </div>
             </div>

             <div className="overflow-x-auto rounded-lg border border-gray-200">
               <table className="w-full text-sm">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="p-3 text-left font-semibold text-gray-600 border-none">Tgl</th>
                     <th className="p-3 text-left font-semibold text-gray-600 border-none">Kegiatan</th>
                     <th className="p-3 text-left font-semibold text-gray-600 border-none">Uraian</th>
                     <th className="p-3 text-left font-semibold text-gray-600 border-none">Vol</th>
                     <th className="p-3 text-left font-semibold text-gray-600 border-none">Aksi</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {sortedData.length === 0 ? (
                     <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Belum ada data untuk periode ini.</td></tr>
                   ) : sortedData.map(i => (
                     <tr key={i.id} className="hover:bg-green-50/50 transition-colors">
                       <td className="p-3 whitespace-nowrap border-none text-gray-500">{getShortDate(i.date)}</td>
                       <td className="p-3 font-medium border-none text-gray-800">{i.activity}</td>
                       <td className="p-3 text-gray-600 border-none max-w-xs truncate">{i.desc}</td>
                       <td className="p-3 whitespace-nowrap border-none text-gray-500">{i.volume} {i.unit}</td>
                       <td className="p-3 border-none">
                         <div className="flex gap-2">
                           <button onClick={() => handleEditClick(i)} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors" title="Edit"><Edit size={16}/></button>
                           <button onClick={() => handleDelete(i.id)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors" title="Hapus"><Trash2 size={16}/></button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      )}

      {mode === 'print-view' && (
        <div className="w-full">
           <div className="no-print bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center print-controls">
             <div className="flex gap-4 items-center w-full md:w-auto">
               <span className="font-bold text-gray-700">Preview Laporan:</span>
               <div className="flex gap-2 w-full">
                 <select value={printMonth} onChange={e => setPrintMonth(parseInt(e.target.value))} className="border p-2 rounded-lg bg-gray-50 text-sm w-full">{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
                 <select value={printYear} onChange={e => setPrintYear(parseInt(e.target.value))} className="border p-2 rounded-lg bg-gray-50 text-sm w-full">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
               </div>
             </div>
             <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md font-bold text-sm transition-all justify-center w-full md:w-auto"><Printer size={18}/> Cetak Dokumen</button>
           </div>
           
           <div className="preview-wrapper">
             <div className="sheet">
               <CoverPage user={user} month={printMonth} year={printYear} />
             </div>
             
             <div className="sheet">
                 {/* PERBAIKAN: Mengirim prop 'golongan' ke Header */}
                 <ReportHeader 
                    title="LAPORAN KINERJA BULANAN" 
                    user={user} 
                    rank={userRank} 
                    month={printMonth} 
                    year={printYear} 
                    golongan={profile.golongan} // <-- INI DIA!
                 />
                 <table>
                   <thead>
                     <tr>
                       <th style={{width: '5%'}}>No</th>
                       <th style={{width: '40%'}}>Kegiatan Tugas Jabatan</th>
                       <th style={{width: '10%'}}>Vol</th>
                       <th style={{width: '10%'}}>Satuan</th>
                       <th style={{width: '35%'}}>Bukti Dokumen</th>
                     </tr>
                   </thead>
                   <tbody>
                     {lkbData.length === 0 ? (
                       <tr><td colSpan="5" className="text-center py-8 italic">Belum ada data kinerja bulanan.</td></tr>
                     ) : (
                       lkbData.map((item, idx) => (
                         <tr key={idx}>
                           <td className="text-center">{idx + 1}</td>
                           <td className="text-left">{item.activity}</td>
                           <td className="text-center">{item.volume}</td>
                           <td className="text-center">{item.unit}</td>
                           <td className="text-left">{item.doc}</td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
                 <div className="signature-section">
                    <SignatureSection user={user} rank={userRank} month={printMonth} year={printYear} />
                 </div>
             </div>

             {/* HALAMAN 3 dst: LCKH DENGAN PAGINATION */}
             {(() => {
                const ROWS_PER_PAGE = 18;
                const chunks = [];
                if (sortedData.length === 0) {
                   chunks.push([]);
                } else {
                   for (let i = 0; i < sortedData.length; i += ROWS_PER_PAGE) {
                      chunks.push(sortedData.slice(i, i + ROWS_PER_PAGE));
                   }
                }
                return chunks.map((chunk, pageIndex) => (
                   <div key={pageIndex} className="sheet">
                      {pageIndex === 0 && (
                        <ReportHeader 
                          title="LAPORAN CAPAIAN KINERJA HARIAN (LCKH)" 
                          user={user} 
                          rank={userRank} 
                          month={printMonth} 
                          year={printYear}
                          golongan={profile.golongan} // <-- INI JUGA!
                        />
                      )}
                      {chunks.length > 1 && (<p className="text-right text-xs italic mb-1">Halaman {pageIndex + 1} dari {chunks.length}</p>)}
                      <table>
                        <thead>
                          <tr>
                            <th style={{width: '5%'}}>No</th>
                            <th style={{width: '12%'}}>Tanggal</th>
                            <th style={{width: '25%'}}>Kegiatan</th>
                            <th style={{width: '38%'}}>Uraian Kegiatan</th>
                            <th style={{width: '10%'}}>Vol</th>
                            <th style={{width: '10%'}}>Satuan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chunk.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8 italic">Belum ada kegiatan harian.</td></tr>
                          ) : (
                            chunk.map((item, idx) => (
                              <tr key={item.id}>
                                <td className="text-center">{(pageIndex * ROWS_PER_PAGE) + idx + 1}</td>
                                <td className="text-center whitespace-nowrap">{getShortDate(item.date)}</td>
                                <td className="text-left">{item.activity}</td>
                                <td className="text-left">{item.desc}</td>
                                <td className="text-center">{item.volume}</td>
                                <td className="text-center">{item.unit}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                      {pageIndex === chunks.length - 1 && (
                        <div className="signature-section">
                           <SignatureSection user={user} rank={userRank} month={printMonth} year={printYear} />
                        </div>
                      )}
                   </div>
                ));
             })()}
           </div>
        </div>
      )}

      {isEditModalOpen && (
        <ModalEditLCKH 
          onClose={() => setIsEditModalOpen(false)} 
          data={editingItem} 
          onSave={handleEditSave}
          activityList={activityList}
          nip={user.nip}
        />
      )}
    </div>
  );
};

const getDocName = (actName, nip) => {
  const list = nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST;
  const found = list.find(l => l.name === actName);
  return found ? found.doc : '-';
};

// --- PERBAIKAN: Menambahkan prop 'golongan' agar dinamis ---
const ReportHeader = ({ title, user, rank, month, year, golongan }) => (
  <div className="text-black">
    <h1 className="text-center font-bold text-lg underline">{title}</h1>
    <h2 className="text-center font-bold text-sm mb-6 uppercase">BULAN {MONTHS[month]} TAHUN {year}</h2>
    <div className="grid grid-cols-[150px_10px_1fr] gap-1 text-sm">
      <div>Nama</div><div>:</div><div className="font-bold whitespace-nowrap">{user.name}</div>
      <div>NIP</div><div>:</div><div>{user.nip}</div>
      
      {/* BAGIAN INI YANG DULU BIKIN ERROR, SEKARANG SUDAH DINAMIS */}
      <div>Pangkat/Gol</div><div>:</div><div>{rank.pangkat} / {golongan}</div>
      
      <div>Jabatan</div><div>:</div><div>{rank.jabatan}</div>
      <div>Unit Kerja</div><div>:</div><div>MTsN 3 Kota Tasikmalaya</div>
    </div>
  </div>
);

const SignatureSection = ({ user, rank, month, year }) => {
  const lastDay = new Date(year, month + 1, 0); // Last day of selected month
  
  return (
    <div className="mt-8 text-sm text-black break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col text-center">
           <div className="h-6"></div> 
           <div className="mb-16"><p>Pejabat Penilai:</p><p>Kepala MTsN 3 Kota Tasikmalaya,</p></div>
           <div className="mt-auto"><p className="font-bold underline whitespace-nowrap">Hj. YIYIN, S.Ag.,M.Pd.</p><p>NIP. 197210181993032002</p></div>
        </div>
        <div className="flex flex-col text-center">
           <div className="h-6 mb-1">Tasikmalaya, {getTitimangsa(lastDay)}</div>
           <div className="mb-16"><p>Pegawai:</p><p>{rank.jabatan},</p></div>
           <div className="mt-auto"><p className="font-bold underline whitespace-nowrap">{user.name}</p><p>NIP. {user.nip}</p></div>
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ users, setUsers, addToast }) => {
  const [formData, setFormData] = useState({ name: '', nip: '', role: 'teacher', password: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getIdLabel = (role) => role === 'staff' ? 'NISN (Nomor Induk Siswa)' : 'NIP / Username';

  // --- CRUD KE SUPABASE ---
  
  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*').order('role');
    if (!error) setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Cek duplikasi NIP lokal (untuk UX cepat)
    if (!isEditing && users.find(u => u.nip === formData.nip)) {
        addToast('error', 'Gagal', 'NIP/NISN ini sudah terdaftar.');
        setIsLoading(false);
        return;
    }

    if (isEditing) {
      // UPDATE KE SUPABASE
      const { error } = await supabase.from('users').update({
        name: formData.name, nip: formData.nip, role: formData.role, password: formData.password
      }).eq('id', isEditing);

      if (!error) {
        addToast('success', 'Berhasil', 'Data pengguna diperbarui.');
        fetchUsers(); // Refresh list
        setIsEditing(null);
        setFormData({ name: '', nip: '', role: 'teacher', password: '' });
      } else {
        addToast('error', 'Gagal', 'Gagal update database.');
      }
    } else {
      // INSERT KE SUPABASE
      const { error } = await supabase.from('users').insert([{
        name: formData.name, nip: formData.nip, role: formData.role, password: formData.password
      }]);

      if (!error) {
        addToast('success', 'Berhasil', 'Pengguna baru ditambahkan.');
        fetchUsers(); // Refresh list
        setFormData({ name: '', nip: '', role: 'teacher', password: '' });
      } else {
        addToast('error', 'Gagal', 'Gagal menyimpan ke database.');
      }
    }
    setIsLoading(false);
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, nip: user.nip, role: user.role, password: user.password });
    setIsEditing(user.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pengguna ini secara permanen?')) {
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (!error) {
        addToast('info', 'Dihapus', 'Pengguna telah dihapus.');
        setUsers(users.filter(u => u.id !== id));
      } else {
        addToast('error', 'Gagal', 'Gagal menghapus data.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
          <User size={20} className="text-blue-600"/> {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipe Pengguna</label>
            <select className="w-full border p-2 rounded bg-gray-50 outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="admin">Admin (Operator)</option>
                <option value="headmaster">Kepala Madrasah</option>
                <option value="teacher">Guru</option>
                <option value="staff">Petugas Piket (Siswa)</option>
            </select>
          </div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label><input type="text" className="w-full border p-2 rounded outline-none" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">{getIdLabel(formData.role)}</label><input type="text" className="w-full border p-2 rounded outline-none" required value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} /></div>
          <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password Login</label><input type="text" className="w-full border p-2 rounded outline-none" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} /></div>

          <div className="md:col-span-2 flex gap-2 pt-2">
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full shadow-md font-bold flex justify-center items-center gap-2">
                {isLoading && <Loader2 size={16} className="animate-spin"/>}
                {isEditing ? 'Simpan Perubahan' : 'Tambah User'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', nip: '', role: 'teacher', password: '' }); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Batal</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Database Pengguna (Cloud)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 font-bold text-gray-700 border-b"><tr><th className="p-3">Nama</th><th className="p-3">Nomor Induk</th><th className="p-3">Role</th><th className="p-3">Password</th><th className="p-3">Aksi</th></tr></thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 font-mono text-gray-600">{u.nip}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs uppercase font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-600' : u.role === 'staff' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>{u.role}</span></td>
                  <td className="p-3 font-mono text-gray-400">••••••</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEdit(u)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>
                    {u.role !== 'admin' && <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- KONFIGURASI HAK AKSES (RBAC) ---
const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'absen-berjamaah', 'absen-kesiangan', 'absen-ramadhan', 'lckh', 'user-management'],
  headmaster: ['dashboard', 'absen-berjamaah', 'absen-kesiangan', 'absen-ramadhan', 'lckh'], 
  teacher: ['dashboard', 'absen-berjamaah', 'absen-kesiangan', 'absen-ramadhan', 'lckh'],
  staff: ['dashboard', 'absen-berjamaah'], 
};

// Data Awal (Fallback jika local storage kosong)
const INITIAL_USERS = [
  // ADMIN (Anda)
  { id: 1, name: 'MUHAMMAD SYA\'BAN NURUL FUAD, S.Pd.', nip: '199911222025051007', role: 'admin', password: '123' },
  
  // KEPALA MADRASAH
  { id: 2, name: 'Hj. YIYIN, S.Ag.,M.Pd.', nip: '197210181993032002', role: 'headmaster', password: '123' },
  
  // CONTOH GURU LAIN
  { id: 5, name: 'LILIS NURMILAH, S.Pd.I.', nip: '196610022025212001', role: 'teacher', password: '123' },

  // PETUGAS (Siswa) - Gunakan NISN di kolom 'nip'
  { id: 3, name: 'Aldo', nip: '1212', role: 'staff', password: '123' }, 
  { id: 4, name: 'Luthfiyana', nip: '1313', role: 'staff', password: '123' },
];

// --- APP COMPONENT UTAMA (FULL VERSION) ---
const App = () => {
  // 1. DEKLARASI STATE (Urutan Wajib di Atas)
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // State Manajemen User (Dinamis)
  const [usersList, setUsersList] = useState(INITIAL_USERS);

  // State Data Global Aplikasi
  const [attendanceData, setAttendanceData] = useState([]);
  const [lateData, setLateData] = useState([]);
  const [ramadhanData, setRamadhanData] = useState([]);
  const [lckhData, setLckhData] = useState([]);
  const [holidays, setHolidays] = useState(['2024-03-11']);
  
  // State Profil (Penyebab error sebelumnya, sekarang aman di sini)
  const [userProfiles, setUserProfiles] = useState({}); 

  // --- HELPER FUNCTIONS ---
  const addToast = (type, title, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // --- 2. USE EFFECTS (Logic Load & Save) ---

  // A. Inisialisasi Aplikasi (Load Sesi Login & Fetch Data Supabase)
  useEffect(() => {
    const initApp = async () => {
      // 1. Cek LocalStorage (Hanya di Client Side)
      if (typeof window !== 'undefined') {
        // Cek Login Sesi
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          setView('dashboard');
        }

        // Cek Cache Data User (Jika Supabase offline/lambat)
        const storedUsers = localStorage.getItem('appUsers');
        if (storedUsers) {
           const parsedUsers = JSON.parse(storedUsers);
           // Validasi: Pastikan Admin Utama ada
           const adminExists = parsedUsers.find(u => u.nip === '199911222025051007');
           if (adminExists) setUsersList(parsedUsers);
           else setUsersList(INITIAL_USERS);
        }

        // Cek Cache Profil Golongan
        const savedProfiles = localStorage.getItem('userProfiles');
        if (savedProfiles) setUserProfiles(JSON.parse(savedProfiles));
      }

      // 2. Ambil Data dari Supabase (Cloud)
      // Users
      const { data: users, error: userError } = await supabase.from('users').select('*');
      if (!userError && users && users.length > 0) {
        setUsersList(users);
      } 
      
      // Absensi
      const { data: attendance } = await supabase.from('attendance').select('*');
      if (attendance) {
        const norm = attendance.map(d => ({ ...d, studentId: d.student_id }));
        setAttendanceData(norm.filter(d => d.category === 'berjamaah'));
        setRamadhanData(norm.filter(d => d.category === 'ramadhan'));
        setLateData(norm.filter(d => d.category === 'kesiangan'));
      }

      // LCKH
      const { data: lckh } = await supabase.from('lckh').select('*');
      if (lckh) {
        setLckhData(lckh.map(d => ({ ...d, userId: d.user_nip, desc: d.description })));
      }
    };

    initApp();

    // 3. Realtime Subscription (Agar data auto-update jika ada perubahan di DB)
    const channel = supabase.channel('public-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
         if(payload.eventType === 'INSERT') setUsersList(prev => [...prev, payload.new]);
         if(payload.eventType === 'UPDATE') setUsersList(prev => prev.map(u => u.id === payload.new.id ? payload.new : u));
         if(payload.eventType === 'DELETE') setUsersList(prev => prev.filter(u => u.id !== payload.old.id));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, (payload) => {
          const handleUpdate = (prevList, payload) => {
            if (payload.eventType === 'INSERT') {
              const newData = { ...payload.new, studentId: payload.new.student_id };
              if (prevList.find(i => i.id === newData.id)) return prevList;
              return [...prevList, newData];
            } 
            else if (payload.eventType === 'UPDATE') {
              return prevList.map(item => item.id === payload.new.id ? { ...payload.new, studentId: payload.new.student_id } : item);
            } 
            else if (payload.eventType === 'DELETE') {
              return prevList.filter(item => item.id !== payload.old.id);
            }
            return prevList;
          };
          
          if (payload.eventType === 'DELETE' || payload.new) {
             const cat = payload.new ? payload.new.category : 'unknown'; // Note: Delete payload might need extra check
             // Refresh strategi sederhana untuk memastikan kategori benar
             if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                if (cat === 'berjamaah') setAttendanceData(prev => handleUpdate(prev, payload));
                if (cat === 'ramadhan') setRamadhanData(prev => handleUpdate(prev, payload));
                if (cat === 'kesiangan') setLateData(prev => handleUpdate(prev, payload));
             }
          }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lckh' }, (payload) => {
           if (payload.eventType === 'INSERT') {
             setLckhData(prev => [...prev, { ...payload.new, userId: payload.new.user_nip, desc: payload.new.description }]);
           } else if (payload.eventType === 'DELETE') {
             setLckhData(prev => prev.filter(i => i.id !== payload.old.id));
           } else if (payload.eventType === 'UPDATE') {
             setLckhData(prev => prev.map(i => i.id === payload.new.id ? { ...payload.new, userId: payload.new.user_nip, desc: payload.new.description } : i));
           }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // B. Simpan User List ke LocalStorage (Backup)
  useEffect(() => {
    if (typeof window !== 'undefined' && usersList.length > 0) {
      localStorage.setItem('appUsers', JSON.stringify(usersList));
    }
  }, [usersList]);

  // C. Simpan Profil Golongan ke LocalStorage
  // (PENTING: Ini sekarang aman karena userProfiles sudah dideklarasikan di atas)
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(userProfiles).length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(userProfiles));
    }
  }, [userProfiles]);

// D. Load Libur dari LocalStorage saat buka aplikasi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHolidays = localStorage.getItem('schoolHolidays');
      if (storedHolidays) setHolidays(JSON.parse(storedHolidays));
    }
  }, []);

  // E. Simpan Libur ke LocalStorage setiap ada perubahan
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('schoolHolidays', JSON.stringify(holidays));
    }
  }, [holidays]);

  // --- 3. HANDLERS ---

  const handleLogin = (identifier, password) => {
    // Cari user di list (gabungan Supabase & Initial)
    const validUser = usersList.find(u => u.nip === identifier && u.password === password);

    if (validUser) {
      setCurrentUser(validUser); 
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(validUser));
      }
      setView('dashboard'); 
      addToast('success', 'Login Berhasil', `Selamat datang, ${validUser.name}!`);
    } else {
      addToast('error', 'Login Gagal', 'NIP/NISN atau Password salah/tidak ditemukan.');
    }
  };

  const logout = () => { 
    setCurrentUser(null); 
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser'); 
    }
    setView('login'); 
    addToast('info', 'Logout', 'Anda telah keluar dari aplikasi.');
  };

  // --- 4. RENDER ---

  if (view === 'login') return (
    <>
      <style>{styles}</style>
      <ToastNotification toasts={toasts} removeToast={removeToast} />
      <LoginScreen onLogin={handleLogin} />
    </>
  );

  // Cek hak akses untuk render konten utama
  const userPermissions = currentUser ? (ROLE_PERMISSIONS[currentUser.role] || []) : [];

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-800 font-sans flex-col md:flex-row app-layout">
      <style>{styles}</style>
      <ToastNotification toasts={toasts} removeToast={removeToast} />
      
      {/* Mobile Header */}
      <div className="md:hidden bg-green-900 text-white p-4 flex justify-between items-center no-print sticky top-0 z-40 shadow-md">
         <div className="flex items-center gap-2">
            <Image src="/logo kemenag.png" width={30} height={30} alt="Logo" />
            <span className="font-bold text-sm">MTsN 3 Kota Tasikmalaya</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 active:scale-95 transition-transform"><Menu size={24} /></button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden animate-fade-in-up" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-green-900 w-72 h-full shadow-2xl" onClick={e => e.stopPropagation()}>
             <SidebarContent user={currentUser} currentView={view} setView={(v)=>{setView(v);setIsMobileMenuOpen(false)}} logout={logout} />
          </div>
        </div>
      )}

      <div className="hidden md:flex w-72 flex-col no-print h-screen sticky top-0 z-30">
         <SidebarContent user={currentUser} currentView={view} setView={setView} logout={logout} />
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full bg-gray-50/50">
        
        {view === 'dashboard' && userPermissions.includes('dashboard') && <Dashboard user={currentUser} />}
        
        {view === 'absen-berjamaah' && userPermissions.includes('absen-berjamaah') && (
            <AbsenBerjamaah user={currentUser} data={attendanceData} setData={setAttendanceData} holidays={holidays} setHolidays={setHolidays} addToast={addToast} />
        )}
        
        {view === 'absen-kesiangan' && userPermissions.includes('absen-kesiangan') && (
            <AbsenKesiangan user={currentUser} data={lateData} setData={setLateData} addToast={addToast} />
        )}
        
        {view === 'absen-ramadhan' && userPermissions.includes('absen-ramadhan') && (
            <AbsenRamadhan user={currentUser} data={ramadhanData} setData={setRamadhanData} holidays={holidays} setHolidays={setHolidays} addToast={addToast} />
        )}
        
        {view === 'lckh' && userPermissions.includes('lckh') && (
            <LCKHManager user={currentUser} data={lckhData} setData={setLckhData} profiles={userProfiles} setProfiles={setUserProfiles} addToast={addToast} />
        )}

        {/* FITUR BARU: MANAJEMEN USER (Hanya Admin) */}
        {view === 'user-management' && userPermissions.includes('user-management') && (
            <UserManagement users={usersList} setUsers={setUsersList} addToast={addToast} />
        )}

      </main>
    </div>
  );
};

export default App;