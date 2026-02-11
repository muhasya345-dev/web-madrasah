"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Lock, QrCode, ClipboardList, FileText, 
  LogOut, Calendar, Printer, CheckCircle, XCircle, 
  AlertTriangle, Save, Search, Menu, Trash2, X, Edit, Moon
} from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Html5QrcodeScanner } from "html5-qrcode";

// Hubungkan ke Supabase (Ganti URL dan KEY dengan milikmu dari Settings > API di Supabase)
const supabaseUrl = 'https://wpesevugtidwofhgnokz.supabase.co';
const supabaseKey = 'sb_publishable_cWPGQRaYpX830TIZ7MVIDQ_2FfG5YMC';
const supabase = createClient(supabaseUrl, supabaseKey);
// --- DATA MOCK ---

const STAFF_ACCOUNTS = [
  { name: 'Aldo', nisn: '1212', pass: '123', role: 'staff' },
  { name: 'Luthfiyana', nisn: '1313', pass: '123', role: 'staff' }
];

const TEACHERS_DATA = [
  { name: 'Hj. YIYIN, S.Ag.,M.Pd.', nip: '197210181993032002', role: 'admin' },
  { name: 'LILIS NURMILAH, S.Pd.I.', nip: '196610022025212001', role: 'teacher' },
  { name: 'H. AONUL HUSNI, S.Ag.', nip: '196703101988031002', role: 'teacher' },
  { name: 'Dra. Hj. SITI HANAH, S.Pd.I', nip: '196706121994032003', role: 'teacher' },
  { name: 'AMIR MUSLIM, S.Ag', nip: '196903072007011039', role: 'teacher' },
  { name: 'YANTI MARYANTI, S.Pd.', nip: '197107112005012002', role: 'teacher' },
  { name: 'ELIS EVI SUNDANIS, S.Pd', nip: '197107212006042008', role: 'teacher' },
  { name: 'IKAH MUDRIKAH SRI LUCIANA, S.Ag', nip: '197110201993032001', role: 'teacher' },
  { name: 'INTAN SITI NURHAYATI, S.Pd.', nip: '197206301998022001', role: 'teacher' },
  { name: 'LILIS MARYANI, S.Ag', nip: '197210202022212005', role: 'teacher' },
  { name: 'DADAN MUNANDAR', nip: '197307202025211008', role: 'teacher' },
  { name: 'YATI NURHAYATI, S.Pd.I', nip: '197310022025212002', role: 'teacher' },
  { name: 'ASEP RAHMAT, S.Pd', nip: '197501012005011006', role: 'teacher' },
  { name: 'ESA SUSANTI, S.Pd.', nip: '197502142005012004', role: 'teacher' },
  { name: 'ALIEN KURNIANINGSIH, S.Pd.', nip: '197605232005012001', role: 'teacher' },
  { name: 'ALIA HERNIS, S.Ag', nip: '197608112022212010', role: 'teacher' },
  { name: 'NENENG SOLIHAH, S.Sos', nip: '197701282007102002', role: 'teacher' },
  { name: 'ASEP SYAMSUL BASYAR, S.Pd.I', nip: '197703282025211001', role: 'teacher' },
  { name: 'MIA ROSTIKANIAWATI, S.Sos.I', nip: '197903062023212010', role: 'teacher' },
  { name: 'ARIS AWALUDIN, S.Pd., M.PMat.', nip: '198002262005011004', role: 'teacher' },
  { name: 'ROSSI RAHMAYANI, M.Pd', nip: '198101292005012006', role: 'teacher' },
  { name: 'YADI APRIADI, S.Pd.', nip: '198105022007101001', role: 'teacher' },
  { name: 'IKA MUSTIKA RASTUTI, S.Pd', nip: '198105142005012006', role: 'teacher' },
  { name: 'TETIH SITI ATHIYYAH, S.Pd.', nip: '198107102007102001', role: 'teacher' },
  { name: 'ELIS LIDIANINGSIH, S.Pd.', nip: '198110182025212002', role: 'teacher' },
  { name: 'ENCEP SUSANTO, S.Pd', nip: '198506122025211005', role: 'teacher' },
  { name: 'RATNASARI, S.Pd.', nip: '198603132023212037', role: 'teacher' },
  { name: 'RINA NURAENI, S.Pd', nip: '198609192024212023', role: 'teacher' },
  { name: 'RITA ANTARIKSA, S.Pd', nip: '198611052023212048', role: 'teacher' },
  { name: 'RENDRA PURA SETIA R., S.Pd', nip: '199004182025051002', role: 'teacher' },
  { name: 'PIA POPIYANA, S,Pd', nip: '199006172023212034', role: 'teacher' },
  { name: 'RISNA FIRMAWATI, S.Pd', nip: '199008092025052002', role: 'teacher' },
  { name: 'SENDI MAULANA, S.Pd.', nip: '199009302023211019', role: 'teacher' },
  { name: 'ADE SUTISNA SENJAYA, S.Kom', nip: '199107072019031019', role: 'teacher' },
  { name: 'ELIS NURKAMILA, S. Pd.', nip: '199110262025052002', role: 'teacher' },
  { name: 'AYU SHINTA WATI, S.Pd', nip: '199310062025052002', role: 'teacher' },
  { name: 'MIMBAR RUSTAMIN, S.Pd.', nip: '199404272025051004', role: 'teacher' },
  { name: 'MUHAMMAD RIJAL MUHAROM, S.Pd', nip: '199406222025051003', role: 'teacher' },
  { name: 'FAJAR NUGRAHA, S.Pd.', nip: '199503252025211005', role: 'teacher' },
  { name: 'YUNIA NURAZIZAH, S. Pd', nip: '199506112025052002', role: 'teacher' },
  { name: 'RATU KHUMAIROH AINI, S.Pd', nip: '199606142023212035', role: 'teacher' },
  { name: 'LELY LAILATUSSAIDAH, S.Pd', nip: '199712212023212013', role: 'teacher' },
  { name: 'FAJAR ABDUL MALIK AL MANSUR, S.Pd.', nip: '199810272025051006', role: 'teacher' },
  { name: 'MUHAMMAD SYA\'BAN NURUL FUAD, S.Pd.', nip: '199911222025051007', role: 'teacher' },
  { name: 'DESITI KHOIRIYAH, S.Pd', nip: '200012192025052014', role: 'teacher' }
];

const WALI_KELAS_MAP = {
  '7A': { name: 'INTAN SITI NURHAYATI, S.Pd.', nip: '197206301998022001' },
  '7B': { name: 'Dra. Hj. SITI HANAH, S.Pd.I', nip: '196706121994032003' },
  '7C': { name: 'ELIS LIDIANINGSIH, S.Pd.', nip: '198110182025212002' },
  '7D': { name: 'RENDRA PURA SETIA RAHMATILLAH, S.Pd', nip: '199004182025051002' },
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
  { id: 3, name: 'Fairuz Zahwan', class: '7A', code: 'Fairuz Zahwan - 7A' },
  { id: 4, name: 'Faiz Ahmad Paisal', class: '7A', code: 'Faiz Ahmad Paisal - 7A' },
  { id: 5, name: 'Fathimah Ainun Sholihah', class: '7A', code: 'Fathimah Ainun Sholihah - 7A' },
  { id: 6, name: 'Fauzan Juliandaffa', class: '7A', code: 'Fauzan Juliandaffa - 7A' },
  { id: 7, name: 'Hilda Kania Maharani', class: '7A', code: 'Hilda Kania Maharani - 7A' },
  { id: 8, name: 'Hisni Meila Syamsiah', class: '7A', code: 'Hisni Meila Syamsiah - 7A' },
  { id: 9, name: 'Husna Ghoziyatun Fikriyah', class: '7A', code: 'Husna Ghoziyatun Fikriyah - 7A' },
  { id: 10, name: 'Kaila Nurazni', class: '7A', code: 'Kaila Nurazni - 7A' },
  { id: 11, name: 'Maulidina Mutiara Rezkina Alifiani', class: '7A', code: 'Maulidina Mutiara Rezkina Alifiani - 7A' },
  { id: 12, name: 'Muhammad Reyfhan Zam Zam Zainuri', class: '7A', code: 'Muhammad Reyfhan Zam Zam Z - 7A' },
  { id: 13, name: 'Naila Nurfadilah', class: '7A', code: 'Naila Nurfadilah - 7A' },
  { id: 14, name: 'Nur Aliya Maulida Adibah', class: '7A', code: 'Nur Aliya Maulida Adibah - 7A' },
  { id: 15, name: 'Raditya Muhammad Fauzi', class: '7A', code: 'Raditya Muhammad Fauzi - 7A' },
  { id: 16, name: 'Reisa Sri Rahayu', class: '7A', code: 'Reisa Sri Rahayu - 7A' },
  { id: 17, name: 'Sara Ramadani', class: '7A', code: 'Sara Ramadani - 7A' },
  { id: 18, name: 'Savana Dwi Meilanita Putri', class: '7A', code: 'Savana Dwi Meilanita Putri - 7A' },
  { id: 19, name: 'Sopyan Pebriansah', class: '7A', code: 'Sopyan Pebriansah - 7A' },
  { id: 20, name: 'Syabilla Nur Fadilah', class: '7A', code: 'Syabilla Nur Fadilah - 7A' },

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
  { id: 222, name: 'Linda', class: '8A', code: 'Linda - 8A' },
  { id: 223, name: 'Meila Farida', class: '8A', code: 'Meila Farida - 8A' },
  { id: 224, name: 'Mochammad Hafidzh Al Mi\'raj', class: '8A', code: 'Mochammad Hafidzh Al Mi\'raj - 8A' },
  { id: 225, name: 'Mochammad Syafiq Sauqi', class: '8A', code: 'Mochammad Syafiq Sauqi - 8A' },
  { id: 226, name: 'Muhammad Faisal Kamil', class: '8A', code: 'Muhammad Faisal Kamil - 8A' },
  { id: 227, name: 'Muharram Akbar Nusantara', class: '8A', code: 'Muharram Akbar Nusantara - 8A' },
  { id: 228, name: 'Rahmi Aulia Nursabani', class: '8A', code: 'Rahmi Aulia Nursabani - 8A' },
  { id: 229, name: 'Razani Aquina Chairunnisa', class: '8A', code: 'Razani Aquina Chairunnisa - 8A' },
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
  { id: 332, name: 'Nuri Latifah', class: '8E', code: 'Nuri Latifah - 8E' },
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
const getFormattedDate = (dateObj) => {
  return dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const getTitimangsa = (dateObj) => {
  return dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getShortDate = (dateStr) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

// --- STYLES ---
// --- STYLES ---
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

/* --- KERTAS A4 (Sama Persis di Layar & Print) --- */
.sheet {
  background: white;
  width: 210mm;        /* Lebar A4 */
  min-height: 297mm;   /* Tinggi Minimum A4 */
  
  /* MARGIN KERTAS (Padding Dalam) */
  /* Atas 1.5cm, Kanan 1.5cm, Bawah 2cm, Kiri 1.5cm */
  padding: 15mm 15mm 20mm 15mm; 
  
  position: relative;
  overflow: hidden;
}

/* --- TABEL --- */
table { 
  width: 100%; 
  border-collapse: collapse; 
  margin-top: 5px; 
  margin-bottom: 10px; 
  font-size: 10pt; 
}

thead th {
  background-color: #e5e7eb !important; 
  font-weight: bold;
  text-align: center;
  border: 1px solid #000;
  vertical-align: middle;
  padding: 5px 2px;
}

tbody td { 
  border: 1px solid #000; 
  vertical-align: top; 
  padding: 4px 4px;
  line-height: 1.1;
}

/* --- HEADER LAPORAN --- */
.report-header { 
  font-family: Arial, sans-serif; 
  text-align: center; 
  margin-bottom: 15px;
}
.report-header h1 { 
  font-size: 12pt; margin: 0; text-decoration: underline; font-weight: bold; 
}
.report-header h2 { 
  font-size: 10pt; margin: 2px 0 10px 0; text-transform: uppercase; font-weight: bold; 
}
.header-identity {
  font-size: 9pt; line-height: 1.2; text-align: left;
}

.signature-section { margin-top: 20px; page-break-inside: avoid; }
.text-center { text-align: center; }
.text-left { text-align: left; }
.font-bold { font-weight: bold; }

/* =========================================
   MODE LAYAR (PREVIEW)
   ========================================= */
@media screen {
  /* Area abu-abu di belakang kertas */
  .preview-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    background: #52525b; /* Abu gelap */
    border-radius: 8px;
    margin: 20px; /* Jarak dari menu/atas */
    overflow: auto;
  }
  
  .sheet {
    margin-bottom: 30px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4); /* Efek bayangan */
  }
}

/* =========================================
   MODE CETAK (PRINT / PDF) - PERBAIKAN
   ========================================= */
@media print {
  @page { 
    size: A4; 
    margin: 0 !important; /* Reset margin printer */
  }
  
  /* 1. Sembunyikan elemen UI yang mengganggu */
  .no-print, nav, aside, header, footer, button, .mobile-header, .sidebar, ::-webkit-scrollbar { 
    display: none !important; 
  }

  /* 2. Reset Layout Utama agar tidak mengganggu posisi */
  body, html, main, .app-layout {
    background: white !important;
    height: auto !important;
    width: auto !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    position: static !important;
  }

  /* 3. TEKNIK OVERLAY: Paksa Wrapper Preview menutupi semuanya */
  .preview-wrapper {
    display: block !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 210mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    z-index: 9999 !important; /* Pastikan di paling atas layer */
  }

  /* 4. Atur Sheet/Kertas */
  .sheet {
    margin: 0 !important;
    box-shadow: none !important;
    page-break-after: always !important;
    width: 210mm !important;
    /* Tinggi auto agar halaman terakhir tidak kosong */
    min-height: auto !important; 
    height: auto !important; 
  }
  
  /* Hapus page-break di halaman terakhir */
  .sheet:last-child {
    page-break-after: auto !important;
  }
}
`;

// --- SUB-COMPONENTS (DEFINED BEFORE APP) ---

const LoginScreen = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* BAGIAN KIRI: FORM LOGIN */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white z-10 shadow-2xl md:shadow-none">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-4">
               <Image src="/logo kemenag.png" alt="Logo" width={80} height={80} />
            </div>
            <h1 className="text-3xl font-extrabold text-green-900 tracking-tight">Selamat Datang</h1>
            <p className="text-gray-500 mt-2">Silahkan masuk ke Sistem Informasi Manajemen Madrasah</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(id, pass); }} className="space-y-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIP / NISN</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  name="username" id="username" autoComplete="username"
                  value={id} onChange={e => setId(e.target.value)} 
                  className="pl-10 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black font-semibold transition-all" 
                  placeholder="Masukkan Nomor Induk" required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  name="password" id="password" autoComplete="current-password"
                  value={pass} onChange={e => setPass(e.target.value)} 
                  className="pl-10 w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black font-semibold transition-all" 
                  placeholder="••••••••" required 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Masuk Aplikasi
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            &copy; 2026 MTs Negeri 3 Kota Tasikmalaya. All rights reserved.
          </div>
        </div>
      </div>

      {/* BAGIAN KANAN: HEADLINE & GAMBAR (Hanya muncul di Layar Besar/Desktop) */}
      <div className="hidden md:flex w-1/2 bg-green-800 relative overflow-hidden items-center justify-center">
        {/* Placeholder Gambar Sekolah - Ganti 'src' dengan path foto madrasah Anda */}
        <div className="absolute inset-0 z-0">
           {/* Contoh jika pakai Next.js Image, atau ganti <img> biasa */}
           <img 
             src="/gerbang madrasah.jpg" /* GANTI INI DENGAN FILE FOTO MADRASAH */
             alt="gerbang Madrasah" 
             className="w-full h-full object-cover opacity-30 mix-blend-overlay"
             onError={(e) => {e.target.style.display='none'}} // Fallback jika tidak ada gambar
           />
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 to-green-700/80"></div>
        </div>

        {/* Konten Teks Kanan */}
        <div className="relative z-10 text-center px-12 text-white max-w-lg">
          <div className="mb-6 inline-block p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
             <QrCode size={40} className="text-yellow-300" />
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">MTs Negeri 3<br/><span className="text-yellow-300">Kota Tasikmalaya</span></h2>
          <p className="text-green-100 text-lg leading-relaxed">
            "Maju, Bermutu, Mendunia."
          </p>
          
          {/* Dekorasi Garis */}
          <div className="mt-8 flex justify-center gap-2">
            <div className="h-1 w-12 bg-yellow-400 rounded"></div>
            <div className="h-1 w-4 bg-white/30 rounded"></div>
            <div className="h-1 w-4 bg-white/30 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarContent = ({ user, currentView, setView, logout }) => {
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  return (
    <div className="flex flex-col h-full bg-green-900 text-white">
      {/* BAGIAN LOGO MADRASAH */}
      <div className="p-4 border-b border-green-800 flex flex-col items-center bg-green-950/30">
        <Image 
          src="/logo kemenag.png" 
          alt="Logo" 
          width={65} 
          height={65} 
          className="mb-2 bg-white p-1 rounded-full shadow-lg"
        />
        <p className="text-[10px] font-bold text-center leading-tight">MTsN 3 KOTA TASIKMALAYA</p>
      </div>

      {/* INFO PROFIL USER */}
      <div className="p-4 border-b border-green-800 flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-800 font-bold shrink-0">
          {user?.name.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-[10px] text-green-300 uppercase">{user?.role}</p>
        </div>
      </div>

      {/* NAVIGASI MENU */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentView === 'dashboard' ? 'bg-green-700' : 'hover:bg-green-800'}`}><Menu size={18} /> Dashboard</button>
        <button onClick={() => setView('absen-berjamaah')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentView === 'absen-berjamaah' ? 'bg-green-700' : 'hover:bg-green-800'}`}><QrCode size={18} /> Absen Berjamaah</button>
        {isTeacher && (
          <>
            <button onClick={() => setView('absen-kesiangan')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentView === 'absen-kesiangan' ? 'bg-green-700' : 'hover:bg-green-800'}`}><AlertTriangle size={18} /> Absen Kesiangan</button>
            <button onClick={() => setView('absen-ramadhan')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentView === 'absen-ramadhan' ? 'bg-green-700' : 'hover:bg-green-800'}`}><Moon size={18} /> Absen Ramadhan</button>
            <button onClick={() => setView('lckh')} className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${currentView === 'lckh' ? 'bg-green-700' : 'hover:bg-green-800'}`}><ClipboardList size={18} /> LCKH & LKB</button>
          </>
        )}
      </nav>

      {/* TOMBOL KELUAR */}
      <div className="p-4 border-t border-green-800">
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors shadow-md">
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user }) => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800">Selamat Datang, {user.name}</h2>
      <p className="text-gray-600">Sistem Informasi MTs Negeri 3 Kota Tasikmalaya</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Absensi Hari Ini</h3>
        <p className="text-sm text-blue-500">Siswa Hadir</p>
      </div>
      <div className="bg-green-50 p-6 rounded-lg border border-green-100">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Tanggal</h3>
        <p className="text-xl font-medium text-green-700">{getFormattedDate(new Date())}</p>
      </div>
      {user.role !== 'staff' && (
         <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
         <h3 className="text-lg font-semibold text-purple-800 mb-2">Laporan Kinerja</h3>
         <p className="text-sm text-purple-600">Jangan lupa isi LCKH hari ini!</p>
       </div>
      )}
    </div>
  </div>
);

const AbsenBerjamaah = ({ user, data, setData, holidays, setHolidays }) => {
  const [tab, setTab] = useState('scan');
  const [scanInput, setScanInput] = useState('');
  const [manualSearch, setManualSearch] = useState("");
  const [selectedClassRecap, setSelectedClassRecap] = useState('7A');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPrintAllClasses, setIsPrintAllClasses] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0];
  const lastScanRef = useRef({ code: '', timestamp: 0 });
  const isPrivileged = user.role === 'admin' || user.role === 'teacher';
  const tabs = isPrivileged ? ['scan', 'manual', 'rekap-harian', 'rekap-range'] : ['scan', 'manual'];

  const isWorkingDay = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    if (day < 1 || day > 4) return false;
    if (holidays.includes(dateStr)) return false;
    return true;
  };

  const processAttendance = async (studentId, status, viaMethod) => {
    if (!isWorkingDay(currentDate)) { alert('Hari Libur/Bukan Jadwal.'); return false; }
    const student = STUDENTS.find(s => s.id === studentId);
    const localCheck = data.find(d => d.date === currentDate && d.studentId === studentId);
    if (localCheck) { alert(`GAGAL: Siswa ${student.name} SUDAH absen!`); return false; }

    const { data: inserted, error } = await supabase.from('attendance').insert([{
      student_id: studentId, student_name: student.name, student_class: student.class,
      date: currentDate, status, category: 'berjamaah', method: viaMethod, officer: user.name
    }]).select();

    if (!error) {
      if(viaMethod === 'Scan') alert(`Berhasil Scan: ${student.name}`);
      return true;
    } else {
      alert('Gagal menyimpan ke database.'); return false;
    }
  };

  useEffect(() => {
    let scanner = null;
    if (tab === 'scan') {
      import("html5-qrcode").then((plugin) => {
        scanner = new plugin.Html5Qrcode("reader");
        scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 300, height: 300 } }, 
          async (decodedText) => {
            const now = Date.now();
            if (decodedText === lastScanRef.current.code && (now - lastScanRef.current.timestamp < 5000)) return;
            lastScanRef.current = { code: decodedText, timestamp: now };
            const student = STUDENTS.find(s => s.code === decodedText);
            if (student) {
              scanner.pause();
              await processAttendance(student.id, 'Hadir', 'Scan');
              setTimeout(() => scanner.resume(), 2000);
            }
          }, () => {}).catch(console.error);
      });
    }
    return () => { if (scanner && scanner.isScanning) scanner.stop().catch(console.error); };
  }, [tab, data]);

  const handleScanInput = async (e) => {
    e.preventDefault();
    const student = STUDENTS.find(s => s.code === scanInput);
    if (!student) return alert('Barcode salah!');
    const success = await processAttendance(student.id, 'Hadir', 'Scan');
    if (success) setScanInput('');
  };

  const getStatus = (studentId, date) => data.find(d => d.date === date && d.studentId === studentId)?.status || 'Alfa';
  const manualStudents = STUDENTS.filter(s => s.name.toLowerCase().includes(manualSearch.toLowerCase()) || s.class.toLowerCase().includes(manualSearch.toLowerCase()));
  const classesToPrint = isPrintAllClasses ? Object.keys(WALI_KELAS_MAP) : [selectedClassRecap];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold flex items-center gap-2"><QrCode /> Absensi Berjamaah</h2>
        <input type="date" value={currentDate} disabled className="border rounded p-1 bg-gray-100" />
      </div>

      <div className="flex space-x-2 border-b no-print overflow-x-auto pb-2 whitespace-nowrap">
        {tabs.map(t => (
           <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab === t ? 'border-b-2 border-green-600 text-green-700 font-bold' : 'text-gray-500'}`}>
             {t === 'rekap-range' ? 'Rekap Mingguan/Range' : t.replace('-', ' ')}
           </button>
        ))}
        {isPrivileged && <button onClick={() => setTab('settings')} className={`px-4 py-2`}>Pengaturan Libur</button>}
      </div>

      <div className="bg-white p-4 rounded shadow min-h-[400px]">
        {tab === 'scan' && (
          <div className="max-w-lg mx-auto text-center space-y-4">
             <div className="w-full h-[500px] bg-black rounded-lg overflow-hidden border-2 border-green-600">
                <div id="reader" className="w-full h-full"></div>
             </div>
             <form onSubmit={handleScanInput} className="flex gap-2">
               <input type="text" value={scanInput} onChange={e => setScanInput(e.target.value)} placeholder="Scan Barcode Manual..." className="flex-1 border p-2 rounded" autoFocus />
               <button type="submit" className="bg-green-600 text-white px-4 rounded">Cek</button>
             </form>
          </div>
        )}

        {tab === 'manual' && (
          <div>
            <div className="mb-4 relative"><Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /><input type="text" className="pl-10 w-full border p-2 rounded" placeholder="Cari Siswa..." value={manualSearch} onChange={(e) => setManualSearch(e.target.value)} /></div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead><tr className="bg-gray-100"><th className="p-2 border">Nama</th><th className="p-2 border">Kelas</th><th className="p-2 border">Status</th></tr></thead>
                <tbody>
                  {manualStudents.slice(0, 50).map(s => { 
                    const st = getStatus(s.id, currentDate);
                    const isRec = data.some(d => d.date === currentDate && d.studentId === s.id);
                    return (
                      <tr key={s.id} className="border-b">
                        <td className="p-2">{s.name}</td><td className="p-2">{s.class}</td>
                        <td className="p-2 flex gap-1">
                          {['Sakit', 'Izin', 'Alfa', 'Haid'].map(status => (
                            <button key={status} disabled={isRec && st !== status} onClick={() => processAttendance(s.id, status, 'Manual')} className={`px-2 py-1 text-xs rounded border ${st === status ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'} ${isRec && st !== status ? 'opacity-50 cursor-not-allowed' : ''}`}>{status}</button>
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
          <div>
             <div className="flex flex-wrap items-center gap-2 mb-4 no-print">
               <select value={selectedClassRecap} onChange={(e) => setSelectedClassRecap(e.target.value)} className="border p-2 rounded">{Object.keys(WALI_KELAS_MAP).map(cls => <option key={cls} value={cls}>{cls}</option>)}</select>
               <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded ml-auto flex items-center gap-2"><Printer size={16}/> Print</button>
             </div>
             <div className="print-area">
                <div className="text-center border-b-2 border-black pb-4 mb-4 hidden print:block">
                  <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                  <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                </div>
                <h3 className="text-center font-bold text-lg mb-4 uppercase">Rekap Absensi Berjamaah Harian ({getFormattedDate(new Date(currentDate))})</h3>
                <p className="text-center font-bold mb-2">Kelas: {selectedClassRecap}</p>
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
                    {STUDENTS.filter(s => s.class === selectedClassRecap).map((s, idx) => {
                      const rec = data.find(d => d.date === currentDate && d.studentId === s.id);
                      return <tr key={s.id}><td className="border border-black p-1 text-center">{idx+1}</td><td className="border border-black p-1">{s.name}</td><td className="border border-black p-1 text-center">{rec?.status || 'Alfa'}</td><td className="border border-black p-1 text-center">{rec?.officer || '-'}</td></tr>;
                    })}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {tab === 'rekap-range' && isPrivileged && (
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-6 no-print bg-gray-50 p-4 rounded border">
              <div className="flex flex-col"><label className="text-xs font-bold mb-1">Mulai:</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
              <div className="flex flex-col"><label className="text-xs font-bold mb-1">Sampai:</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
              <div className="flex flex-col w-32"><label className="text-xs font-bold mb-1">Kelas:</label><select value={selectedClassRecap} onChange={(e) => setSelectedClassRecap(e.target.value)} disabled={isPrintAllClasses} className="border p-2 rounded bg-white disabled:bg-gray-200">{Object.keys(WALI_KELAS_MAP).map(cls => <option key={cls} value={cls}>{cls}</option>)}</select></div>
              <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="printAll" checked={isPrintAllClasses} onChange={e => setIsPrintAllClasses(e.target.checked)} className="w-5 h-5 accent-green-600"/><label htmlFor="printAll" className="font-bold text-gray-700 cursor-pointer select-none">Cetak Semua Kelas</label></div>
              <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded ml-auto flex items-center gap-2 shadow-lg hover:bg-blue-700 font-bold"><Printer size={18}/> Print Laporan</button>
            </div>
            
            <div className="print-area">
               {classesToPrint.map((className) => {
                 const classStudents = STUDENTS.filter(s => s.class === className);
                 const wk = WALI_KELAS_MAP[className];
                 return (
                   <div key={className} className="page-break mb-10">
                      <div className="text-center border-b-2 border-black pb-4 mb-4 hidden print:block">
                        <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                        <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                      </div>
                      <h3 className="text-center font-bold text-lg mb-1 uppercase">Rekap Absensi Berjamaah</h3>
                      <p className="text-center text-sm mb-4">Periode: {getShortDate(startDate)} s.d {getShortDate(endDate)}</p>
                      <p className="font-bold mb-2">Kelas: {className}</p>

                      <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                            <th className="border border-black p-2" style={{width: '40%'}}>Nama Siswa</th>
                            <th className="border border-black p-2" style={{width: '11%'}}>Hadir</th>
                            <th className="border border-black p-2" style={{width: '11%'}}>Sakit</th>
                            <th className="border border-black p-2" style={{width: '11%'}}>Izin</th>
                            <th className="border border-black p-2" style={{width: '11%'}}>Alfa</th>
                            <th className="border border-black p-2" style={{width: '11%'}}>Haid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classStudents.map((s, idx) => {
                             const stats = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0, Haid: 0 };
                             data.filter(d => d.studentId === s.id && d.date >= startDate && d.date <= endDate).forEach(r => { if(stats[r.status] !== undefined) stats[r.status]++ });
                             return (
                               <tr key={s.id}>
                                 <td className="border border-black p-1 text-center">{idx+1}</td>
                                 <td className="border border-black p-1">{s.name}</td>
                                 <td className="border border-black p-1 text-center">{stats.Hadir}</td>
                                 <td className="border border-black p-1 text-center">{stats.Sakit}</td>
                                 <td className="border border-black p-1 text-center">{stats.Izin}</td>
                                 <td className="border border-black p-1 text-center font-bold text-red-600">{stats.Alfa}</td>
                                 <td className="border border-black p-1 text-center">{stats.Haid}</td>
                               </tr>
                             )
                          })}
                        </tbody>
                      </table>

                      <div className="mt-8 flex justify-end" style={{ pageBreakInside: 'avoid' }}>
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
          <div><h3 className="font-bold mb-4">Pengaturan Hari Libur</h3><div className="flex gap-2 mb-4"><input type="date" id="holidayInput" className="border p-2 rounded" /><button onClick={() => { const val = document.getElementById('holidayInput').value; if(val) setHolidays([...holidays, val]); }} className="bg-red-600 text-white px-4 py-2 rounded">Tambah</button></div><ul className="list-disc pl-5">{holidays.map(h => <li key={h} className="text-red-600">{getFormattedDate(new Date(h))} <button onClick={() => setHolidays(holidays.filter(x => x !== h))} className="ml-2 text-gray-400 text-xs">(Hapus)</button></li>)}</ul></div>
        )}
      </div>
    </div>
  );
};

const AbsenKesiangan = ({ user, data, setData }) => {
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentId, setStudentId] = useState('');
  const [reason, setReason] = useState('');
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState('All'); 
  const [rekapMonth, setRekapMonth] = useState(new Date().getMonth());
  const [rekapYear, setRekapYear] = useState(new Date().getFullYear());

  const isPrivileged = user.role === 'admin' || user.role === 'teacher';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const student = STUDENTS.find(s => s.id === parseInt(studentId));
    if (!student) return;

    const { data: inserted, error } = await supabase.from('attendance').insert([{
      student_id: student.id, student_name: student.name, student_class: student.class,
      date: selectedDate, reason, category: 'kesiangan', officer: user.name
    }]).select();

    if (!error) {
      setData([...data, { ...inserted[0], studentId: student.id, studentName: student.name, class: student.class }]);
      alert('Data kesiangan tersimpan di Cloud!');
      setStudentId(''); setReason(''); setStudentSearch('');
    }
  };

  const filteredStudentOptions = STUDENTS.filter(s => (s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.class.toLowerCase().includes(studentSearch.toLowerCase())) && (selectedClass === 'All' || s.class === selectedClass));
  
  const dailyData = data.filter(d => d.date === selectedDate && (selectedClass === 'All' || d.class === selectedClass));
  const monthlyData = data.filter(d => {
    const rd = new Date(d.date);
    return rd.getMonth() === rekapMonth && rd.getFullYear() === rekapYear && (selectedClass === 'All' || d.class === selectedClass);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold flex items-center gap-2"><AlertTriangle /> Absensi Kesiangan</h2>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('daily')} className={`px-3 py-1 rounded text-sm ${viewMode === 'daily' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Harian</button>
          {isPrivileged && <button onClick={() => setViewMode('monthly')} className={`px-3 py-1 rounded text-sm ${viewMode === 'monthly' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Rekap Bulanan</button>}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 no-print bg-white p-2 rounded shadow">
        <label className="text-sm font-bold">Filter Kelas:</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border p-1 rounded">
          <option value="All">Semua</option>
          {Object.keys(WALI_KELAS_MAP).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {viewMode === 'monthly' && (
          <>
            <select value={rekapMonth} onChange={e => setRekapMonth(parseInt(e.target.value))} className="border p-1 rounded">{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
            <select value={rekapYear} onChange={e => setRekapYear(parseInt(e.target.value))} className="border p-1 rounded">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
          </>
        )}
      </div>
      
      {viewMode === 'daily' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded shadow no-print">
            <h3 className="font-bold mb-4">Input Siswa Terlambat</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
               <div><label className="block text-sm">Tanggal</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border p-2 rounded" /></div>
               <div><label className="block text-sm">Cari Siswa</label><input type="text" className="w-full border p-2 rounded" placeholder="Ketik nama..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
               <div><label className="block text-sm">Pilih</label><select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full border p-2 rounded" required><option value="">-- Pilih --</option>{filteredStudentOptions.map(s => <option key={s.id} value={s.id}>{s.name} - {s.class}</option>)}</select></div>
               <div><label className="block text-sm">Alasan</label><input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border p-2 rounded" required /></div>
               <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded">Simpan</button>
            </form>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4"><h3 className="font-bold">Daftar ({getFormattedDate(new Date(selectedDate))})</h3><button onClick={() => window.print()} className="no-print text-blue-600 text-sm flex gap-1"><Printer size={14}/> Print</button></div>
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead><tr className="bg-gray-100"><th className="border p-2">Nama</th><th className="border p-2">Kelas</th><th className="border p-2">Alasan</th></tr></thead>
              <tbody>{dailyData.map(d => <tr key={d.id}><td className="border p-2">{d.studentName}</td><td className="border p-2">{d.class}</td><td className="border p-2">{d.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      ) : (
        isPrivileged && (
          <div className="bg-white p-8 rounded shadow">
             <div className="flex justify-end mb-4 no-print"><button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><Printer size={16} /> Print</button></div>
             <div className="print-area overflow-x-auto">
               <div className="text-center border-b-2 border-black pb-4 mb-4 hidden print:block">
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
        )
      )}
    </div>
  );
};

const AbsenRamadhan = ({ user, data, setData, holidays, setHolidays }) => {
  const [tab, setTab] = useState('scan');
  const [selectedClass, setSelectedClass] = useState('7A');
  const [manualSearch, setManualSearch] = useState("");
  const [scanInput, setScanInput] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPrintAllClasses, setIsPrintAllClasses] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0];
  const lastScanRef = useRef({ code: '', timestamp: 0 });
  const isPrivileged = user.role === 'admin' || user.role === 'teacher';
  const tabs = isPrivileged ? ['scan', 'manual', 'rekap-harian', 'rekap-range'] : ['scan', 'manual'];

  const isRamadhanDay = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    if (day < 1 || day > 5) return false;
    if (holidays.includes(dateStr)) return false;
    return true;
  };

  const processAttendance = async (studentId, status, viaMethod) => {
    if (!isRamadhanDay(currentDate)) { alert('Bukan Jadwal Ramadhan!'); return false; }
    const student = STUDENTS.find(s => s.id === studentId);
    const localCheck = data.find(d => d.date === currentDate && d.studentId === studentId);
    if (localCheck) { alert(`GAGAL: Siswa ${student.name} SUDAH absen!`); return false; }

    const { data: inserted, error } = await supabase.from('attendance').insert([{
      student_id: studentId, student_name: student.name, student_class: student.class,
      date: currentDate, status, category: 'ramadhan', method: viaMethod, officer: user.name
    }]).select();

    if (!error) {
      if (viaMethod === 'Scan') alert(`Ramadhan Berhasil: ${student.name}`);
      return true;
    } else {
      alert('Gagal koneksi database.'); return false;
    }
  };

  useEffect(() => {
    let scanner = null;
    if (tab === 'scan') {
      import("html5-qrcode").then((plugin) => {
        scanner = new plugin.Html5Qrcode("reader-ramadhan");
        scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, 
          async (decodedText) => {
            const now = Date.now();
            if (decodedText === lastScanRef.current.code && (now - lastScanRef.current.timestamp < 5000)) return; 
            lastScanRef.current = { code: decodedText, timestamp: now };
            const student = STUDENTS.find(s => s.code === decodedText);
            if (student) {
              scanner.pause();
              await processAttendance(student.id, 'Hadir', 'Scan');
              setTimeout(() => scanner.resume(), 2500);
            }
          }, () => {}).catch(console.error);
      });
    }
    return () => { if (scanner && scanner.isScanning) scanner.stop().catch(console.error); };
  }, [tab, data]);

  const handleScanInput = async (e) => {
      e.preventDefault();
      const student = STUDENTS.find(s => s.code === scanInput);
      if (!student) return alert('Barcode tidak terdaftar!');
      const success = await processAttendance(student.id, 'Hadir', 'Scan');
      if (success) setScanInput('');
  };

  const getStatus = (studentId, date) => data.find(d => d.date === date && d.studentId === studentId)?.status || 'Alfa';
  const manualStudents = STUDENTS.filter(s => s.name.toLowerCase().includes(manualSearch.toLowerCase()));
  const classesToPrint = isPrintAllClasses ? Object.keys(WALI_KELAS_MAP) : [selectedClass];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-xl font-bold flex items-center gap-2"><Moon /> Absen Ramadhan</h2>
        <input type="date" value={currentDate} disabled className="border rounded p-1 bg-gray-100" />
      </div>

      <div className="flex space-x-2 border-b no-print overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 capitalize ${tab===t ? 'border-b-2 border-green-600 font-bold' : ''}`}>{t === 'rekap-range' ? 'Rekap Mingguan/Range' : t.replace('-', ' ')}</button>)}
        {isPrivileged && <button onClick={() => setTab('settings')} className="px-4 py-2">Pengaturan Libur</button>}
      </div>

      <div className="bg-white p-4 rounded shadow">
        {tab === 'scan' && (
          <div className="max-w-md mx-auto text-center space-y-4">
            <div id="reader-ramadhan" className="overflow-hidden rounded-lg border-2 border-orange-500 min-h-[300px] bg-black"></div>
            <form onSubmit={handleScanInput} className="flex gap-2">
              <input type="text" value={scanInput} onChange={e => setScanInput(e.target.value)} placeholder="Scan Alat Tembak..." className="flex-1 border p-2 rounded" autoFocus />
              <button type="submit" className="bg-green-600 text-white px-4 rounded">Cek</button>
            </form>
          </div>
        )}

        {tab === 'manual' && (
          <div>
            <div className="mb-4"><input type="text" className="w-full border p-2 rounded" placeholder="Cari Siswa..." value={manualSearch} onChange={e => setManualSearch(e.target.value)} /></div>
            <table className="w-full border-collapse">
              <thead><tr className="bg-gray-100"><th className="p-2 border">Nama</th><th className="p-2 border">Kls</th><th className="p-2 border">Status</th></tr></thead>
              <tbody>
                {manualStudents.slice(0,50).map(s => {
                    const st = getStatus(s.id, currentDate);
                    const isRec = data.some(d => d.date === currentDate && d.studentId === s.id);
                    return (
                        <tr key={s.id} className="border-b">
                            <td className="p-2">{s.name}</td><td className="p-2">{s.class}</td>
                            <td className="p-2 flex gap-1">
                                {['Sakit', 'Izin', 'Alfa', 'Haid'].map(status => (
                                    <button key={status} disabled={isRec && st !== status} onClick={() => processAttendance(s.id, status, 'Manual')} className={`px-2 py-1 border rounded text-xs ${st === status ? 'bg-blue-600 text-white' : ''} ${isRec && st !== status ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}>{status}</button>
                                ))}
                            </td>
                        </tr>
                    )
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'rekap-harian' && isPrivileged && (
          <div>
              <div className="flex gap-2 mb-4 no-print">
                <label className="font-bold">Kelas:</label>
                <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="border p-1 rounded">{Object.keys(WALI_KELAS_MAP).map(c => <option key={c} value={c}>{c}</option>)}</select>
                <button onClick={() => window.print()} className="ml-auto bg-blue-600 text-white px-4 py-1 rounded flex gap-2"><Printer size={16}/> Print</button>
              </div>
              <div className="print-area">
                 <div className="text-center border-b-2 border-black pb-4 mb-4 hidden print:block">
                   <h3 className="font-bold text-lg">KEMENTERIAN AGAMA RI - MTsN 3 KOTA TASIKMALAYA</h3>
                 </div>
                 <h3 className="text-center font-bold mb-4 uppercase">Rekap Absensi Ramadhan ({getFormattedDate(new Date(currentDate))}) - Kelas {selectedClass}</h3>
                 <table className="w-full border-collapse border border-black text-sm">
                   <thead>
                     <tr className="bg-gray-200">
                       <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                       <th className="border border-black p-2" style={{width: '45%'}}>Nama</th>
                       <th className="border border-black p-2" style={{width: '20%'}}>Status</th>
                       <th className="border border-black p-2" style={{width: '30%'}}>Petugas</th> {/* UPDATE: Tambah Petugas */}
                     </tr>
                   </thead>
                   <tbody>
                     {STUDENTS.filter(s => s.class === selectedClass).map((s, i) => {
                        const rec = data.find(d => d.date === currentDate && d.studentId === s.id);
                        return (
                          <tr key={s.id}>
                            <td className="border border-black p-1 text-center">{i+1}</td>
                            <td className="border border-black p-1">{s.name}</td>
                            <td className="border border-black p-1 text-center">{getStatus(s.id, currentDate)}</td>
                            <td className="border border-black p-1 text-center">{rec?.officer || '-'}</td> {/* UPDATE: Isi Petugas */}
                          </tr>
                        )
                     })}
                   </tbody>
                 </table>
              </div>
          </div>
        )}

        {/* --- REKAP RANGE/MINGGUAN RAMADHAN --- */}
        {tab === 'rekap-range' && isPrivileged && (
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-6 no-print bg-gray-50 p-4 rounded border">
              <div className="flex flex-col"><label className="text-xs font-bold mb-1">Mulai:</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
              <div className="flex flex-col"><label className="text-xs font-bold mb-1">Sampai:</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded bg-white"/></div>
              <div className="flex flex-col w-32"><label className="text-xs font-bold mb-1">Kelas:</label><select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} disabled={isPrintAllClasses} className="border p-2 rounded bg-white disabled:bg-gray-200">{Object.keys(WALI_KELAS_MAP).map(cls => <option key={cls} value={cls}>{cls}</option>)}</select></div>
              <div className="flex items-center gap-2 mt-4"><input type="checkbox" id="printAllRamadhan" checked={isPrintAllClasses} onChange={e => setIsPrintAllClasses(e.target.checked)} className="w-5 h-5 accent-green-600"/><label htmlFor="printAllRamadhan" className="font-bold text-gray-700 cursor-pointer select-none">Cetak Semua Kelas</label></div>
              <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded ml-auto flex items-center gap-2 shadow-lg hover:bg-blue-700 font-bold"><Printer size={18}/> Print</button>
            </div>
            
            <div className="print-area">
               {classesToPrint.map((className) => {
                 const classStudents = STUDENTS.filter(s => s.class === className);
                 const wk = WALI_KELAS_MAP[className];
                 return (
                   <div key={className} className="page-break mb-10">
                      <div className="text-center border-b-2 border-black pb-4 mb-4 hidden print:block">
                        <h3 className="font-bold text-lg uppercase">Kementerian Agama Republik Indonesia</h3>
                        <h2 className="font-bold text-xl uppercase">MTs Negeri 3 Kota Tasikmalaya</h2>
                      </div>
                      <h3 className="text-center font-bold text-lg mb-1 uppercase">Rekap Absensi Ramadhan</h3>
                      <p className="text-center text-sm mb-4">Periode: {getShortDate(startDate)} s.d {getShortDate(endDate)}</p>
                      <p className="font-bold mb-2">Kelas: {className}</p>

                      <table className="w-full border-collapse border border-black text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-black p-2" style={{width: '5%'}}>No</th>
                            <th className="border border-black p-2" style={{width: '40%'}}>Nama Siswa</th> {/* UPDATE: Lebar proporsional */}
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
                             return (
                               <tr key={s.id}>
                                 <td className="border border-black p-1 text-center">{idx+1}</td>
                                 <td className="border border-black p-1">{s.name}</td>
                                 <td className="border border-black p-1 text-center">{stats.Hadir}</td>
                                 <td className="border border-black p-1 text-center">{stats.Sakit}</td>
                                 <td className="border border-black p-1 text-center">{stats.Izin}</td>
                                 <td className="border border-black p-1 text-center font-bold text-red-600">{stats.Alfa}</td>
                               </tr>
                             )
                          })}
                        </tbody>
                      </table>

                      <div className="mt-8 flex justify-end" style={{ pageBreakInside: 'avoid' }}>
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
          <div><h3 className="font-bold mb-2">Libur Ramadhan</h3><input type="date" id="ramadhanHoliday" className="border p-1 mr-2"/><button onClick={()=>{const v=document.getElementById('ramadhanHoliday').value; if(v) setHolidays([...holidays, v])}} className="bg-red-600 text-white px-4 py-1 rounded">Tambah</button>
          <ul className="mt-2 list-disc pl-5">{holidays.map(h => <li key={h}>{getFormattedDate(new Date(h))}</li>)}</ul></div>
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
          <h3 className="text-2xl font-bold text-black uppercase">{user.name}</h3>
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
const LCKHManager = ({ user, data, setData, profiles, setProfiles }) => {
  const [mode, setMode] = useState('input');
  const [profile, setProfile] = useState(profiles[user.nip] || { golongan: 'III.a' });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activity, setActivity] = useState('');
  const [desc, setDesc] = useState('');
  const [volume, setVolume] = useState(1);
  const [unit, setUnit] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [printMonth, setPrintMonth] = useState(new Date().getMonth());
  const [printYear, setPrintYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const list = user.nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST;
    const act = list.find(a => a.name === activity);
    if (act) setUnit(act.unit);
  }, [activity, user.nip]);

  const handleProfileSave = () => { setProfiles({ ...profiles, [user.nip]: profile }); alert('Profil disimpan!'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecord = { user_nip: user.nip, date, activity, volume, unit, description: desc };

    if (editingId) {
      const { error } = await supabase.from('lckh').update(newRecord).eq('id', editingId);
      if (!error) {
        setData(data.map(item => item.id === editingId ? { ...item, ...newRecord, desc: desc } : item));
        setEditingId(null);
      }
    } else {
      const { data: inserted, error } = await supabase.from('lckh').insert([newRecord]).select();
      if (!error && inserted) {
        setData([...data, { ...inserted[0], userId: inserted[0].user_nip, desc: inserted[0].description }]);
        alert('LCKH tersimpan di Cloud!');
      }
    }
    setActivity(''); setDesc('');
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDate(item.date); setActivity(item.activity); setDesc(item.desc); setVolume(item.volume); setUnit(item.unit);
    setMode('input');
    window.scrollTo(0,0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus data LCKH ini?')) {
      const { error } = await supabase.from('lckh').delete().eq('id', id);
      if (!error) setData(data.filter(i => i.id !== id));
    }
  };

  const userRank = GOLONGAN_MAP[profile.golongan] || {};
  
  // Filter data berdasarkan User Login DAN Bulan/Tahun yang dipilih (baik untuk Input maupun Cetak)
  const filteredData = data.filter(d => d.userId === user.nip && new Date(d.date).getMonth() === printMonth && new Date(d.date).getFullYear() === printYear);
  const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date)); 

  const lkbData = Object.values(sortedData.reduce((acc, curr) => {
    if (!acc[curr.activity]) acc[curr.activity] = { ...curr, volume: 0, doc: getDocName(curr.activity, user.nip) };
    acc[curr.activity].volume += parseInt(curr.volume);
    return acc;
  }, {}));

  return (
    <div className="space-y-6">
      {/* Tombol Navigasi Utama */}
      <div className="flex justify-between items-center no-print">
         <h2 className="text-xl font-bold flex items-center gap-2"><ClipboardList /> LCKH & LKB</h2>
         <div className="flex gap-2">
           <button onClick={() => setMode('input')} className={`px-4 py-2 rounded ${mode === 'input' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Input</button>
           <button onClick={() => setMode('print-view')} className={`px-4 py-2 rounded ${mode === 'print-view' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Cetak</button>
         </div>
      </div>

      {mode === 'input' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Panel Kiri: Profil */}
            <div className="bg-white p-4 rounded shadow h-fit">
              <h3 className="font-bold border-b pb-2 mb-4 text-green-700">Profil</h3>
              <div className="space-y-3">
                <div><label className="text-sm">Nama</label><input value={user.name} disabled className="w-full bg-gray-100 border p-2 rounded text-sm" /></div>
                <div><label className="text-sm">Golongan</label><select value={profile.golongan} onChange={e => setProfile({...profile, golongan: e.target.value})} className="w-full border p-2 rounded">{Object.keys(GOLONGAN_MAP).map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                <div className="text-xs bg-gray-50 p-2"><p>Pangkat: {userRank.pangkat}</p><p>Jabatan: {userRank.jabatan}</p></div>
                <button onClick={handleProfileSave} className="w-full bg-blue-600 text-white py-1 rounded text-sm flex items-center justify-center gap-1"><Save size={14}/> Simpan</button>
              </div>
            </div>

            {/* Panel Tengah: Form Input */}
            <div className="md:col-span-2 bg-white p-4 rounded shadow">
              <h3 className="font-bold border-b pb-2 mb-4 text-green-700">{editingId ? 'Edit' : 'Input'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm">Tanggal</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border p-2 rounded" required /></div>
                    <div><label className="text-sm">Kegiatan</label><select value={activity} onChange={e => setActivity(e.target.value)} className="w-full border p-2 rounded text-sm" required><option value="">-- Pilih --</option>{(user.nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST).map((a, i) => <option key={i} value={a.name}>{a.name}</option>)}</select></div>
                  </div>
                  <div><label className="text-sm">Uraian</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows="2" className="w-full border p-2 rounded" required></textarea></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm">Volume</label><input type="number" min="1" value={volume} onChange={e => setVolume(e.target.value)} className="w-full border p-2 rounded" required /></div>
                    <div><label className="text-sm">Satuan</label><input value={unit} readOnly className="w-full bg-gray-100 border p-2 rounded" /></div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">{editingId ? 'Update' : 'Simpan'}</button>
                    {editingId && <button type="button" onClick={() => { setEditingId(null); setActivity(''); setDesc(''); }} className="bg-gray-400 text-white px-4 rounded">Batal</button>}
                  </div>
              </form>
            </div>
          </div>
          
          {/* Tabel Input Preview - UPDATE: Ada Filter Bulan & Tahun */}
          <div className="bg-white p-4 rounded shadow">
             <div className="flex flex-col md:flex-row justify-between items-center mb-4 border-b pb-2 gap-2">
                <h3 className="font-bold text-gray-700">Riwayat Input</h3>
                
                {/* FITUR BARU: Filter Bulan & Tahun di Riwayat */}
                <div className="flex gap-2 items-center">
                   <span className="text-sm text-gray-500">Filter:</span>
                   <select 
                      value={printMonth} 
                      onChange={e => setPrintMonth(parseInt(e.target.value))} 
                      className="border p-1 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-green-500"
                   >
                      {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                   </select>
                   <select 
                      value={printYear} 
                      onChange={e => setPrintYear(parseInt(e.target.value))} 
                      className="border p-1 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-green-500"
                   >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                   </select>
                </div>
             </div>

             <table className="w-full text-sm border-collapse">
               <thead>
                 <tr className="bg-green-50 text-left">
                   <th className="p-3 border-b">Tgl</th>
                   <th className="p-3 border-b">Kegiatan</th>
                   <th className="p-3 border-b">Uraian</th>
                   <th className="p-3 border-b">Vol</th>
                   <th className="p-3 border-b">Aksi</th>
                 </tr>
               </thead>
               <tbody>
                 {sortedData.length === 0 ? (
                   <tr>
                     <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                        Tidak ada data di bulan {MONTHS[printMonth]} {printYear}.
                     </td>
                   </tr>
                 ) : sortedData.map(i => (
                   <tr key={i.id} className="border-b hover:bg-gray-50 transition-colors">
                     <td className="p-3 whitespace-nowrap">{getShortDate(i.date)}</td>
                     <td className="p-3 font-medium">{i.activity}</td>
                     <td className="p-3 text-gray-600 italic text-xs">{i.desc}</td>
                     <td className="p-3 whitespace-nowrap">{i.volume} {i.unit}</td>
                     <td className="p-3 flex gap-3">
                       <button onClick={() => handleEdit(i)} className="text-blue-600 hover:text-blue-800" title="Edit">
                         <Edit size={16}/>
                       </button>
                       <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-800" title="Hapus">
                         <Trash2 size={16}/>
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
             
             {/* Info Total Data */}
             {sortedData.length > 0 && (
                <div className="mt-2 text-xs text-gray-400 text-right">
                   Total: {sortedData.length} kegiatan
                </div>
             )}
          </div>
        </div>
      )}

      {/* --- MODE CETAK (PREVIEW & PDF SAMA PERSIS) --- */}
      {mode === 'print-view' && (
        <div className="w-full">
           {/* Kontrol Navigasi (Hanya muncul di Layar, di dalam container utama) */}
           <div className="no-print p-4 bg-white shadow mb-4 rounded-lg flex flex-wrap justify-between items-center gap-4 border">
             <div className="flex gap-4 items-center">
               <label className="font-bold text-gray-700">Periode:</label>
               <select value={printMonth} onChange={e => setPrintMonth(parseInt(e.target.value))} className="border p-2 rounded-md bg-gray-50 text-sm">{MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
               <select value={printYear} onChange={e => setPrintYear(parseInt(e.target.value))} className="border p-2 rounded-md bg-gray-50 text-sm">{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select>
             </div>
             <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-md font-bold text-sm">
                  <Printer size={18}/> Cetak PDF
                </button>
             </div>
           </div>
           
           {/* Area Kertas (Preview Wrapper) */}
           <div className="preview-wrapper">
             
             {/* HALAMAN 1: COVER */}
             <div className="sheet">
               <CoverPage user={user} month={printMonth} year={printYear} />
             </div>
             
             {/* HALAMAN 2: LKB */}
             <div className="sheet">
                 <ReportHeader title="LAPORAN KINERJA BULANAN" user={user} rank={userRank} month={printMonth} year={printYear} />
                 
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

             {/* HALAMAN 3: LCKH */}
             <div className="sheet last-page">
                 <ReportHeader title="LAPORAN CAPAIAN KINERJA HARIAN (LCKH)" user={user} rank={userRank} month={printMonth} year={printYear} />
                 
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
                     {sortedData.length === 0 ? (
                       <tr><td colSpan="6" className="text-center py-8 italic">Belum ada kegiatan harian di bulan ini.</td></tr>
                     ) : (
                       sortedData.map((item, idx) => (
                         <tr key={item.id}>
                           <td className="text-center">{idx + 1}</td>
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

                 <div className="signature-section">
                    <SignatureSection user={user} rank={userRank} month={printMonth} year={printYear} />
                 </div>
             </div>

           </div>
        </div>
      )}
    </div>
  );
};

const getDocName = (actName, nip) => {
  const list = nip === '197210181993032002' ? HEADMASTER_ACTIVITIES : ACTIVITIES_LIST;
  const found = list.find(l => l.name === actName);
  return found ? found.doc : '-';
};

const ReportHeader = ({ title, user, rank, month, year }) => (
  <div className="text-black">
    <h1 className="text-center font-bold text-lg underline">{title}</h1>
    <h2 className="text-center font-bold text-sm mb-6 uppercase">BULAN {MONTHS[month]} TAHUN {year}</h2>
    <div className="grid grid-cols-[150px_10px_1fr] gap-1 text-sm">
      <div>Nama</div><div>:</div><div className="font-bold whitespace-nowrap">{user.name}</div>
      <div>NIP</div><div>:</div><div>{user.nip}</div>
      <div>Pangkat/Gol</div><div>:</div><div>{rank.pangkat} / {user.nip === '197210181993032002' ? 'IV.a' : 'III.a'}</div> 
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
           <div className="mb-16"><p>Pejabat Penilai,</p><p>Kepala MTsN 3 Kota Tasikmalaya,</p></div>
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

// --- APP COMPONENT (DEFINED LAST) ---

// --- APP COMPONENT (YANG SUDAH DIPERBAIKI AGAR SINKRON REAL-TIME) ---

// --- APP COMPONENT (SINKRONISASI REAL-TIME & DATA HANDLING) ---

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ... (State & Effect Code sama persis, tidak perlu diubah) ...
  // Global State
  const [attendanceData, setAttendanceData] = useState([]);
  const [lateData, setLateData] = useState([]);
  const [ramadhanData, setRamadhanData] = useState([]); 
  const [lckhData, setLckhData] = useState([]);
  const [holidays, setHolidays] = useState(['2024-03-11']); 
  const [userProfiles, setUserProfiles] = useState({}); 

  // 1. CEK SESI LOGIN
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
        setView('dashboard');
      }
      const savedProfiles = localStorage.getItem('userProfiles');
      if (savedProfiles) setUserProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  // 2. FUNGSI SINKRONISASI CLOUD (INIT & REALTIME) - AMAN & TERPISAH
  useEffect(() => {
    // --- HELPER 1: PENGOLAH DATA ABSENSI (TIDAK DIUBAH LOGIKANYA) ---
    // Fungsi ini memastikan data absen tetap jalan lancar seperti sebelumnya
    const normalizeAttendance = (data) => data.map(d => ({ ...d, studentId: d.student_id }));
    
    // --- HELPER 2: PENGOLAH DATA LCKH (DIPERBAIKI) ---
    // Fungsi ini memperbaiki masalah data LCKH yang hilang karena beda nama variabel
    const normalizeLckh = (data) => data.map(d => ({ 
      ...d, 
      userId: d.user_nip,    // KUNCI PERBAIKAN: Supabase (user_nip) -> App (userId)
      desc: d.description    // KUNCI PERBAIKAN: Supabase (description) -> App (desc)
    }));

    const fetchCloudData = async () => {
      // BAGIAN A: AMBIL DATA ABSENSI (Aman, logika tetap sama)
      const { data: attendance } = await supabase.from('attendance').select('*');
      if (attendance) {
        const normalized = normalizeAttendance(attendance);
        // Membagi data ke pos masing-masing seperti biasa
        setAttendanceData(normalized.filter(d => d.category === 'berjamaah'));
        setRamadhanData(normalized.filter(d => d.category === 'ramadhan'));
        setLateData(normalized.filter(d => d.category === 'kesiangan'));
      }

      // BAGIAN B: AMBIL DATA LCKH (Ini yang diperbaiki agar data muncul lagi)
      const { data: lckh } = await supabase.from('lckh').select('*');
      if (lckh) {
        const normalizedLckh = normalizeLckh(lckh);
        setLckhData(normalizedLckh);
      }
    };
    
    // Jalankan pengambilan data awal
    fetchCloudData();

    // --- SETUP REALTIME (LIVE UPDATE) ---
    const channel = supabase.channel('public-db-changes')
      // LISTENER 1: KHUSUS TABEL ATTENDANCE (Absen)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, (payload) => {
          const handleUpdate = (prevList, payload) => {
            // Logika update realtime absen tetap dipertahankan
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

          // Update state sesuai kategori (Berjamaah/Ramadhan/Kesiangan)
          if (payload.eventType === 'DELETE' || payload.new) {
             setAttendanceData(prev => handleUpdate(prev, payload)); // Update Berjamaah
             setRamadhanData(prev => handleUpdate(prev, payload));   // Update Ramadhan
             setLateData(prev => handleUpdate(prev, payload));       // Update Kesiangan
          }
      })
      // LISTENER 2: KHUSUS TABEL LCKH (Kinerja)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lckh' }, (payload) => {
           // Perbaikan realtime agar sinkronisasi LCKH lancar
           if (payload.eventType === 'INSERT') {
             setLckhData(prev => [...prev, { 
               ...payload.new, 
               userId: payload.new.user_nip,     // Mapping diperbaiki
               desc: payload.new.description     // Mapping diperbaiki
             }]);
           } else if (payload.eventType === 'DELETE') {
             setLckhData(prev => prev.filter(i => i.id !== payload.old.id));
           } else if (payload.eventType === 'UPDATE') {
             setLckhData(prev => prev.map(i => i.id === payload.new.id ? {
               ...payload.new,
               userId: payload.new.user_nip,     // Mapping diperbaiki
               desc: payload.new.description     // Mapping diperbaiki
             } : i));
           }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => { localStorage.setItem('userProfiles', JSON.stringify(userProfiles)); }, [userProfiles]);

  const handleLogin = (identifier, password) => {
    const teacher = TEACHERS_DATA.find(t => t.nip === identifier && password === t.nip);
    if (teacher) { 
      const userSession = { ...teacher, role: teacher.role || 'teacher' };
      setCurrentUser(userSession); 
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      setView('dashboard'); return; 
    }
    const staff = STAFF_ACCOUNTS.find(s => s.nisn === identifier && password === s.pass);
    if (staff) { 
      const userSession = { ...staff, role: 'staff' };
      setCurrentUser(userSession); 
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      setView('dashboard'); return; 
    }
    alert('Login Gagal! NIP/NISN atau Password salah.');
  };

  const logout = () => { setCurrentUser(null); localStorage.removeItem('currentUser'); setView('login'); setIsMobileMenuOpen(false); };
  const handleSetView = (newView) => { setView(newView); setIsMobileMenuOpen(false); };

  if (view === 'login') return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-800 font-sans flex-col md:flex-row app-layout">
      <style>{styles}</style>
      <div className="md:hidden bg-green-900 text-white p-4 flex justify-between items-center no-print sticky top-0 z-50 shadow-md">
         <span className="font-bold text-lg">MTsN 3 Tasikmalaya</span>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2"><Menu size={24} /></button>
      </div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-green-900 w-64 h-full shadow-lg" onClick={e => e.stopPropagation()}>
             <SidebarContent user={currentUser} currentView={view} setView={handleSetView} logout={logout} />
          </div>
        </div>
      )}
      <div className="hidden md:flex w-64 flex-col no-print h-screen sticky top-0">
         <SidebarContent user={currentUser} currentView={view} setView={setView} logout={logout} />
      </div>
      {/* PERBAIKAN DISINI: HAPUS CLASS 'print-container' 
         Class ini sekarang hanya untuk @media print di CSS 
      */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
        {view === 'dashboard' && <Dashboard user={currentUser} />}
        {view === 'absen-berjamaah' && <AbsenBerjamaah user={currentUser} data={attendanceData} setData={setAttendanceData} holidays={holidays} setHolidays={setHolidays} />}
        {view === 'absen-kesiangan' && <AbsenKesiangan user={currentUser} data={lateData} setData={setLateData} />}
        {view === 'absen-ramadhan' && <AbsenRamadhan user={currentUser} data={ramadhanData} setData={setRamadhanData} holidays={holidays} setHolidays={setHolidays} />}
        {view === 'lckh' && <LCKHManager user={currentUser} data={lckhData} setData={setLckhData} profiles={userProfiles} setProfiles={setUserProfiles} />}
      </main>
    </div>
  );
};

export default App;