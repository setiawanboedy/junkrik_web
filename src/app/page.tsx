import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Platform digital terdepan untuk pengelolaan sampah bisnis dengan sistem reward, laporan kepatuhan EPR, dan kredit plastik. Bergabunglah dengan bisnis yang peduli lingkungan.",
  keywords: ["pengelolaan sampah bisnis", "daur ulang", "EPR Indonesia", "kredit plastik", "sustainability B2B", "waste management Indonesia"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Junkrik - Solusi Pengelolaan Sampah B2B Indonesia",
    description: "Platform digital terdepan untuk pengelolaan sampah bisnis dengan sistem reward dan kepatuhan EPR",
    url: "/",
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Junkrik - Solusi Pengelolaan Sampah B2B Indonesia",
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Junkrik</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Solusi Pintar Pengelolaan Sampah untuk <span className="text-green-600">Bisnis Anda</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Kelola sampah bisnis dengan efisien, dapatkan kredit plastik untuk kepatuhan EPR, 
                dan berkontribusi pada ekonomi sirkular Indonesia.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/register" className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg text-center">
                  Mulai Gratis
                </Link>
                <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors font-semibold text-lg">
                  Pelajari Lebih Lanjut
                </button>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Uji coba gratis 1 bulan • Tanpa biaya setup
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Bisnis</h3>
                  <p className="text-gray-600 text-sm">Pantau pengelolaan sampah real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Junkrik?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform terintegrasi yang membantu bisnis mengelola sampah sesuai regulasi EPR dengan teknologi modern
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0v-4h8v4z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Penjadwalan Otomatis</h4>
              <p className="text-gray-600">Atur jadwal pengambilan sampah rutin sesuai kebutuhan bisnis Anda dengan sistem yang fleksibel.</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Laporan Kepatuhan EPR</h4>
              <p className="text-gray-600">Dapatkan laporan lengkap untuk kepatuhan Extended Producer Responsibility sesuai regulasi pemerintah.</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Kredit Plastik</h4>
              <p className="text-gray-600">Dapatkan kredit plastik yang dapat dimonetisasi dan membantu mencapai target keberlanjutan perusahaan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Bisnis Bergabung</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000</div>
              <div className="text-gray-600">Ton Sampah Dikelola</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Tingkat Daur Ulang</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Dukungan Pelanggan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Siap Mengoptimalkan Pengelolaan Sampah Bisnis Anda?
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Bergabunglah dengan ratusan bisnis yang sudah merasakan manfaat Junkrik
          </p>
          <Link href="/auth/register" className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-block">
            Mulai Sekarang - Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-green-600 text-white p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold">Junkrik</h4>
              </div>
              <p className="text-gray-400">
                Solusi pengelolaan sampah terdepan untuk bisnis Indonesia yang berkelanjutan.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Layanan</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Pengumpulan Sampah</a></li>
                <li><a href="#" className="hover:text-white">Laporan EPR</a></li>
                <li><a href="#" className="hover:text-white">Kredit Plastik</a></li>
                <li><a href="#" className="hover:text-white">Konsultasi</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Perusahaan</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white">Karir</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Dukungan</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Bantuan</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white">Syarat Layanan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Junkrik. Semua hak dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
