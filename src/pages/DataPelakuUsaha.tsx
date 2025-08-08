import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DataPelakuUsaha: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenisLapak, setFilterJenisLapak] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: supaData, error } = await supabase
        .from("pelaku_usaha")
        .select("*, uttp(count)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
        toast.error("Gagal mengambil data dari server.");
      } else {
        setData(supaData || []);
      }
    };

    fetchData();
  }, [location]);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.nama_pemilik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJenis =
      filterJenisLapak === "semua" || item.jenis_lapak === filterJenisLapak;
    const matchesStatus =
      filterStatus === "semua" || item.status_tera === filterStatus;

    return matchesSearch && matchesJenis && matchesStatus;
  });

  const handleDelete = (id: number) => {
    if (confirm("Apakah yakin ingin menghapus?")) {
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      localStorage.setItem("pelakuUsahaData", JSON.stringify(updatedData));
      toast.success("Data berhasil dihapus");
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aktif":
        return "default";
      case "Perlu Tera Ulang":
        return "secondary";
      case "Tidak Aktif":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      Nama: item.nama_pemilik,
      Lapak: item.jenis_lapak,
      Lokasi: item.lokasi,
      Dagangan: item.jenis_dagangan,
      UTTP: item.uttp?.[0]?.count || 0,
      Status: item.status_tera,
      Tahun: item.tahun_tera_terakhir,  
    }));

    const doc = new jsPDF();
    doc.text("Data Pelaku Usaha", 14, 15);
    autoTable(doc, {
      head: [
        ["Nama", "Lapak", "Lokasi", "Dagangan", "UTTP", "Status", "Tahun"],
      ],
      body: exportData.map((d) => Object.values(d)),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      startY: 20,
    });
    doc.save("data-pelaku-usaha.pdf");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Data Pelaku Usaha</h1>
            <p className="text-gray-600">
              Kelola data pelaku usaha dan UTTP mereka
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export ke PDF
            </Button>
            <Button asChild>
              <Link to="/admin/tambah-data">
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Filter className="w-4 h-4" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filterJenisLapak}
                onValueChange={setFilterJenisLapak}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Jenis Lapak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="Kios">Kios</SelectItem>
                  <SelectItem value="Los">Los</SelectItem>
                  <SelectItem value="PKL">PKL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Tera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Perlu Tera Ulang">
                    Perlu Tera Ulang
                  </SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterJenisLapak("semua");
                  setFilterStatus("semua");
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabel */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pelaku Usaha</CardTitle>
            <CardDescription>
              {filteredData.length} data ditampilkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lapak</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Dagangan</TableHead>
                  <TableHead>UTTP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama_pemilik}</TableCell>
                    <TableCell>{item.jenis_lapak}</TableCell>
                    <TableCell>{item.lokasi}</TableCell>
                    <TableCell>{item.jenis_dagangan}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.uttp?.[0]?.count || 0} unit
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(item.status_tera)}>
                        {item.status_tera}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.tanggal_tera_terakhir
                        ? new Date(item.tanggal_tera_terakhir).getFullYear()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/view-data/${item.id}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/edit-data/${item.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredData.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Tidak ada data ditemukan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DataPelakuUsaha;
