import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Scale,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  Users,
  FileText,
  Calendar,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { supabase, type Artikel } from "../lib/supabase";

const LandingPage: React.FC = () => {
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    loadArtikel();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadArtikel = async () => {
    try {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setArtikel(data || []);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Beranda", href: "#hero" },
    { label: "Layanan", href: "#layanan" },
    { label: "Jadwal", href: "#jadwal" },
    { label: "Artikel", href: "#artikel" },
    { label: "Kontak", href: "#kontak" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
      {/* Enhanced Header with Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => scrollToSection("hero")}
            >
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Kemetrologian
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Disperindag ESDM
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Desktop Login Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="/login">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col space-y-2 py-4 border-t border-gray-200 dark:border-gray-700">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 text-left font-medium"
                >
                  {item.label}
                </button>
              ))}
              <Button
                variant="outline"
                className="mx-4 mt-4 rounded-full text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300"
                asChild
              >
                <a href="/login">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section
        id="hero"
        className="flex-grow pt-24 md:pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <Badge
            variant="secondary"
            className="mb-8 px-6 py-3 text-sm font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 animate-fade-in-up hover:scale-105 transition-transform duration-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Layanan Digital Kemetrologian
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-tight tracking-tight animate-fade-in-up delay-200">
            Sistem Informasi
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 animate-gradient">
              {" "}
              Kemetrologian
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            Digitalisasi layanan kemetrologian untuk pengelolaan Unit Ukur,
            Takar, Timbang, dan Perlengkapannya (UTTP) di lingkungan Dinas
            Perindustrian dan Perdagangan ESDM.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-600">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full px-8 py-4 text-base md:text-lg group"
              asChild
            >
              <a
                href="https://forms.google.com/your-form-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Ajukan Permohonan
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full px-8 py-4 text-base md:text-lg group"
              onClick={() => scrollToSection("jadwal")}
            >
              <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Panduan Layanan
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center animate-fade-in-up delay-800 group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors">
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Alat Tera
              </div>
            </div>
            <div className="text-center animate-fade-in-up delay-1000 group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700 transition-colors">
                500+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Pelaku Usaha
              </div>
            </div>
            <div className="text-center animate-fade-in-up delay-1200 group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2 group-hover:text-orange-700 transition-colors">
                99%
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Kepuasan
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section
        id="layanan"
        className="py-24 px-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Layanan Kemetrologian
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Kami menyediakan layanan tera dan tera ulang untuk berbagai jenis
              alat ukur, takar, dan timbang sesuai standar legal yang berlaku.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Tera & Tera Ulang
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Kalibrasi dan sertifikasi alat ukur, takar, timbang sesuai
                  standar legal dengan teknologi terdepan
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    Sertifikat digital tersertifikasi
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-500" />
                    Proses cepat dan akurat
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Pendataan Pelaku Usaha
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Pendataan dan monitoring penggunaan UTTP oleh pelaku usaha
                  secara komprehensif
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    Database terintegrasi
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-500" />
                    Monitoring real-time
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Sertifikat Digital
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Penerbitan sertifikat tera dalam format digital yang aman,
                  valid, dan mudah diverifikasi
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    Keamanan blockchain
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-500" />
                    Verifikasi otomatis
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Schedule Section */}
      <section id="jadwal" className="py-24 px-4">
        <div className="w-full  mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Jadwal Layanan Tera
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Informasi jadwal pelayanan tera dan tera ulang
            </p>
          </div>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="flex items-center gap-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Jadwal Operasional
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 text-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Hari Kerja
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Senin - Kamis
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        08:00 - 15:30
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Jumat
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        08:00 - 15:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-xl">
                    Catatan Penting
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Pendaftaran ditutup 30 menit sebelum jam tutup
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Bawa dokumen persyaratan lengkap
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Alat dalam kondisi bersih dan siap tera
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-6 text-2xl flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Persyaratan Tera
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Surat permohonan tera/tera ulang</span>
                    </li>
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Fotocopy KTP dan SIUP (untuk usaha)</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Alat ukur/timbang dalam kondisi baik</span>
                    </li>
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Biaya tera sesuai tarif yang berlaku</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Articles Section */}
      {artikel.length > 0 && (
        <section
          id="artikel"
          className="py-24 px-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Artikel & Berita Terbaru
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Informasi terkini seputar kemetrologian dan layanan kami
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artikel.map((item, index) => (
                <Card
                  key={item.id}
                  className={`group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {item.gambar_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=600`;
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="p-6 pb-4 flex-grow">
                    <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {item.judul}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                      {item.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <span className="flex items-center gap-2 font-medium">
                        <Users className="w-4 h-4" />
                        {item.author}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center group/btn"
                      asChild
                    >
                      <a href={`/artikel/${item.id}`}>
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Contact Section */}
      <section
        id="kontak"
        className="w-full py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white"
      >
        <div className="w-full ">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Hubungi Kami
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Untuk informasi lebih lanjut mengenai layanan kemetrologian
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 group">
              <CardHeader className="p-8">
                <CardTitle className="text-white flex items-center gap-4 text-2xl font-bold">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  Alamat Kantor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 p-8 pt-0">
                <p className="leading-relaxed text-lg">
                  Dinas Perindustrian dan Perdagangan Energi dan SDM
                  <br />
                  Jl. Contoh Alamat No. 123
                  <br />
                  Kota, Provinsi 12345
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 group">
              <CardHeader className="p-8">
                <CardTitle className="text-white flex items-center gap-4 text-2xl font-bold">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-6 p-8 pt-0">
                <div className="flex items-center gap-4 text-lg hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <span>(021) 1234-5678</span>
                </div>
                <div className="flex items-center gap-4 text-lg hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <span>kemetrologian@disperindag.go.id</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0">
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-200 group-hover:text-white transition-colors">
                  Kemetrologian Disperindag ESDM
                </span>
                <p className="text-sm text-gray-400">
                  Melayani dengan Integritas
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base mb-2">
                © 2024 Dinas Perindustrian dan Perdagangan ESDM
              </p>
              <p className="text-sm text-gray-500">
                Semua hak dilindungi undang-undang
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
