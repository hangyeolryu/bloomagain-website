import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">다시, 봄</h1>
              <span className="ml-2 text-sm text-gray-500">Dasi, Bom</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  홈
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  이용약관
                </Link>
                <Link href="/delete-account" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                  계정삭제
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-indigo-600">다시, 봄</span>
                <span className="block text-gray-900">Dasi, Bom</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                50세 이상을 위한 따뜻한 동반자 앱
              </p>
              <p className="mt-2 text-lg text-gray-600">
                부담 없이, 천천히 이어지는 친구
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    앱 다운로드
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                  >
                    더 알아보기
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <div className="p-8">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📱</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">다시, 봄</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <span className="text-2xl">👋</span>
                          <div className="text-left">
                            <h4 className="font-semibold text-indigo-600">인사하기</h4>
                            <p className="text-sm text-gray-600">스와이프 없이 부담 없이</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <span className="text-2xl">👥</span>
                          <div className="text-left">
                            <h4 className="font-semibold text-indigo-600">소규모 서클</h4>
                            <p className="text-sm text-gray-600">최대 12명의 관심사 기반 모임</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <span className="text-2xl">🎵</span>
                          <div className="text-left">
                            <h4 className="font-semibold text-indigo-600">음성 메시지</h4>
                            <p className="text-sm text-gray-600">쉬운 음성 메모 기능</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              주요 기능
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              50세 이상을 위한 안전하고 따뜻한 소셜 플랫폼
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">나이 확인</h3>
                    <p className="mt-5 text-base text-gray-500">
                      50세 이상만 사용 가능한 안전한 공간
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">부드러운 발견</h3>
                    <p className="mt-5 text-base text-gray-500">
                      스와이프 없이 인사하기, 서클 초대, 커피챗 제안
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">소규모 서클</h3>
                    <p className="mt-5 text-base text-gray-500">
                      최대 12명의 관심사 기반 소규모 모임
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">음성 메시지</h3>
                    <p className="mt-5 text-base text-gray-500">
                      쉬운 음성 메모 기능
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-red-500 rounded-md shadow-lg">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">안전 우선</h3>
                    <p className="mt-5 text-base text-gray-500">
                      차단, 신고, 편안함 설정
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-yellow-500 rounded-md shadow-lg">
                      <span className="text-2xl">♿</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">접근성</h3>
                    <p className="mt-5 text-base text-gray-500">
                      큰 글씨, 고대비, 음성 지원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              접근성 기능
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              모든 사용자가 편리하게 사용할 수 있도록 설계되었습니다
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">큰 글씨</h3>
              <p className="mt-2 text-base text-gray-500">큰 글씨 모드 지원</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">고대비</h3>
              <p className="mt-2 text-base text-gray-500">고대비 테마 제공</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">👆</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">터치 영역</h3>
              <p className="mt-2 text-base text-gray-500">48dp 이상의 터치 영역</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">음성 지원</h3>
              <p className="mt-2 text-base text-gray-500">음성 입력 및 텍스트 읽기</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              지금 시작하세요
            </h2>
            <p className="mt-4 text-lg text-indigo-200">
              50세 이상을 위한 따뜻한 동반자 앱
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                App Store에서 다운로드
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 md:py-4 md:text-lg md:px-10"
              >
                Google Play에서 다운로드
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white">다시, 봄 (Dasi, Bom)</h3>
              <p className="mt-2 text-gray-400">50세 이상을 위한 따뜻한 동반자 앱</p>
              <p className="text-gray-400">Gentle connections, at your pace</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">문의</h4>
              <p className="mt-2 text-gray-400">이메일: efflio.inc@gmail.com</p>
              <p className="text-gray-400">고객지원: 평일 09:00 - 18:00</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">법적 고지</h4>
              <div className="mt-2 space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white">
                  이용약관
                </Link>
                <Link href="/delete-account" className="block text-gray-400 hover:text-white">
                  계정삭제
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400">
              &copy; 2025 BloomAgain Korea. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}