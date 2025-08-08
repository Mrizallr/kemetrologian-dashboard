import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Scale,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type RecentDataItem = {
  id: number;
  nama: string;
  jenis: string;
  lokasi: string;
  status: string;
  uttpCount: number;
};

const AdminDashboard: React.FC = () => {
  const [totalPelakuUsaha, setTotalPelakuUsaha] = useState(0);
  const [uttpTerdaftar, setUttpTerdaftar] = useState(0);
  const [teraUlangBulanIni, setTeraUlangBulanIni] = useState(0);
  const [pelakuUsahaBaru, setPelakuUsahaBaru] = useState(0);
  const [recentData, setRecentData] = useState<RecentDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      // Format tanggal aman untuk filter
      const now = new Date();
      const firstDayOfMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-01`;
      const lastDayOfMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      ).padStart(2, "0")}`;

      try {
        const [
          pelakuUsahaCountRes,
          uttpCountRes,
          teraUlangCountRes,
          pelakuBaruCountRes,
          recentPelakuRes,
        ] = await Promise.all([
          // Total pelaku usaha
          supabase
            .from("pelaku_usaha")
            .select("*", { count: "exact", head: true }),

          // Total UTTP terdaftar
          supabase.from("uttp").select("*", { count: "exact", head: true }),

          // Tera ulang bulan ini
          supabase
            .from("permohonan_tera")
            .select("*", { count: "exact", head: true })
            .eq("jenis_permohonan", "tera_ulang")
            .gte("created_at", firstDayOfMonth)
            .lte("created_at", lastDayOfMonth),

          // Pelaku usaha baru bulan ini
          supabase
            .from("pelaku_usaha")
            .select("*", { count: "exact", head: true })
            .gte("created_at", firstDayOfMonth)
            .lte("created_at", lastDayOfMonth),

          // Data 5 pelaku usaha terbaru + jumlah UTTP
          supabase
            .from("pelaku_usaha")
            .select(
              `id, nama_pemilik, jenis_lapak, lokasi, status_tera,
               uttp:uttp(count)`
            )
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        // Set statistik
        setTotalPelakuUsaha(pelakuUsahaCountRes.count ?? 0);
        setUttpTerdaftar(uttpCountRes.count ?? 0);
        setTeraUlangBulanIni(teraUlangCountRes.count ?? 0);
        setPelakuUsahaBaru(pelakuBaruCountRes.count ?? 0);

        // Format recent data
        if (recentPelakuRes.data) {
          const formattedRecent = recentPelakuRes.data.map((p: any) => ({
            id: p.id,
            nama: p.nama_pemilik,
            jenis: p.jenis_lapak,
            lokasi: p.lokasi,
            status: p.status_tera,
            uttpCount: p.uttp?.[0]?.count ?? 0,
          }));
          setRecentData(formattedRecent);
        } else {
          setRecentData([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Tetap pakai mockStats supaya UI tidak berubah
  const mockStats = {
    totalPelakuUsaha,
    uttpTerdaftar,
    teraUlangBulanIni,
    pelakuUsahaBaru,
  };
  // Render UI seperti aslinya, tapi dengan data realtime dari Supabase
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Selamat datang di sistem pengelolaan data kemetrologian
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/admin/tambah-data">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Data
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/data-pelaku-usaha">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Semua Data
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Pelaku Usaha
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.totalPelakuUsaha}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                +{mockStats.pelakuUsahaBaru} bulan ini
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                UTTP Terdaftar
              </CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.uttpTerdaftar}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Alat ukur, takar, timbang
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Tera Ulang
              </CardTitle>
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockStats.teraUlangBulanIni}
              </div>
              <p className="text-xs text-gray-600 mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Status Aktif
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">89%</div>
              <p className="text-xs text-gray-600 mt-1">Tingkat kepatuhan</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Status Tera Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-purple-600" />
                Status Tera
              </CardTitle>
              <CardDescription>
                Distribusi status tera pelaku usaha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: "Aktif", value: 65 },
                      { name: "Tidak Aktif", value: 35 },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Jenis Lapak Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Jenis Lapak
              </CardTitle>
              <CardDescription>
                Distribusi pelaku usaha berdasarkan jenis lapak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "Kios", value: 45 },
                    { name: "Los", value: 35 },
                    { name: "PKL", value: 20 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Data */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                Data Terbaru
              </CardTitle>
              <CardDescription>
                Pelaku usaha yang baru didaftarkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  recentData.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.nama}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.jenis} - {item.lokasi}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.uttpCount} UTTP terdaftar
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.status === "Aktif" ? "default" : "secondary"
                        }
                        className="ml-4"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/admin/data-pelaku-usaha">Lihat Semua Data</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Statistik Bulanan */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Statistik Bulanan
              </CardTitle>
              <CardDescription>Ringkasan aktivitas bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Pendaftaran Baru
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      +{mockStats.pelakuUsahaBaru}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Tera Ulang
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {mockStats.teraUlangBulanIni}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Kepatuhan UTTP
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      89%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: "89%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Shortcut untuk tugas yang sering dilakukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/tambah-data">
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Tambah Pelaku Usaha</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/data-pelaku-usaha">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Kelola Data</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span>Laporan</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
