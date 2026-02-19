"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Users,
  Shield,
  Eye,
  MessageCircle,
  Sparkles,
  Download,
  CheckCircle,
  Mail,
  FileText,
} from "lucide-react";

const navItems = [
  { label: "홈", href: "/" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: "/terms" },
  { label: "보안·행동 데이터 처리", href: "/security-processing" },
  { label: "계정삭제", href: "/delete-account" },
];

const appFeatures = [
  {
    icon: Sparkles,
    title: "AI 기반 인연 추천",
    description:
      "Google Cloud AI 기술로 당신과 잘 맞는 인연을 찾아드립니다. 관심사와 가치관을 분석하여 의미 있는 만남을 제안합니다.",
  },
  {
    icon: Users,
    title: "서클 커뮤니티",
    description:
      "공통의 관심사를 가진 분들과 함께하는 서클을 만들고 참여하세요. 새로운 친구들과 소통하며 즐거운 시간을 보낼 수 있습니다.",
  },
  {
    icon: MessageCircle,
    title: "특허 기술 기반 안전한 소통",
    description:
      "특허 출원된 실시간 메시지 분석 기술로 1:1 채팅과 그룹 채팅을 보호합니다. 의심스러운 메시지를 AI가 자동으로 감지하고 경고합니다.",
  },
  {
    icon: Eye,
    title: "접근성 최적화",
    description:
      "시력 수준에 따라 글자 크기, 대비, 버튼 간격을 자동으로 조정합니다. 누구나 편리하게 사용할 수 있도록 설계되었습니다.",
  },
  {
    icon: Shield,
    title: "특허 출원 보안 기술",
    description:
      "특허 출원된 AI 기반 실시간 스캠 감지 시스템으로 로맨스 스캠, 피싱, 보이스피싱을 자동으로 차단합니다. 금융권 수준의 보안 기술로 여러분을 보호합니다.",
  },
  {
    icon: Heart,
    title: "50세 이상 전용",
    description:
      "50세 이상 분들을 위한 따뜻하고 안전한 공간입니다. 같은 세대의 분들과 자연스럽게 어울릴 수 있습니다.",
  },
];

const benefits = [
  "큰 글씨와 명확한 디자인으로 누구나 쉽게 사용",
  "AI가 당신의 관심사와 가치관을 분석하여 인연 추천",
  "서클을 통해 취미와 관심사를 공유하는 새로운 친구들",
  "24시간 AI 보안 시스템으로 안전한 소통 환경",
  "시력에 맞춘 자동 레이아웃 조정",
];

const mainPatent = {
  title: "시니어 특화 소셜 플랫폼 시스템",
  titleEn: "Senior-Specific Social Platform System",
  description:
    "시니어 사용자를 위한 온라인 소셜 플랫폼에서 사용자 상호작용의 보안성 및 신뢰성을 향상시키기 위한 통합 시스템. 사용자 식별, 콘텐츠 노출 제어, AI 기반 이상행위 탐지, 하이브리드 매칭 기술을 통합 제공합니다.",
  applicationNumber: "10-2024-XXXXXXX", // 실제 출원번호로 업데이트 필요 (또는 null로 설정하여 숨김)
  showApplicationNumber: false, // true로 설정하면 출원번호 표시, false면 숨김
  applicationDate: "2026년 2월 06일",
  status: "출원완료",
  claims: [
    {
      title: "AI 기반 인연 추천 시스템",
      description: "사용자 프로필 임베딩 및 유사도 기반 매칭 알고리즘",
    },
    {
      title: "실시간 스캠 감지 및 차단 시스템",
      description: "AI 기반 메시지 분석을 통한 로맨스 스캠 및 피싱 탐지 기술",
    },
    {
      title: "접근성 자동 최적화 시스템",
      description: "시력 수준에 따른 UI 레이아웃 자동 조정 기술",
    },
  ],
};

// App Store URLs - Update these with your actual app store links
const APP_STORE_URL = "https://apps.apple.com/app/id6751523550"; // Replace with your App Store ID
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.bloomagain.bloomagain"; // Replace with your package name

const handleAppDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  
  if (typeof window === "undefined") return;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod|macintosh/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  
  if (isIOS) {
    window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
  } else if (isAndroid) {
    window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  } else {
    // Default to Play Store for desktop/other devices
    window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  }
};

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate='fade']");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_icon.svg"
              alt="다시, 봄 로고"
              width={32}
              height={35}
              className="h-8 w-auto"
              priority
            />
            <Link href="/" className="text-2xl font-bold text-[#534741]">
              다시, 봄
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {/* {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-[#8CB350] transition-colors"
              >
                {item.label}
              </Link>
            ))} */}
            <a
              href="https://effeffcorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-[#8CB350] transition-colors ml-2"
            >
              Made with <span className="font-semibold">EFFEFF</span>
            </a>
          </div>
          <div className="md:hidden">
            <a
              href="https://effeffcorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-[#8CB350] transition-colors"
            >
              Made with <span className="font-semibold">EFFEFF</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid gap-8 md:gap-12 xl:grid-cols-2 items-center">
              <div className="space-y-6 md:space-y-8 text-center xl:text-left w-full">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#8CB350]/30 bg-[#8CB350]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#534741]">
                  50세 이상을 위한 따뜻한 커뮤니티
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 justify-center xl:justify-start">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#534741] leading-tight break-words">
                      다시, 봄
                      <br />
                      <span className="text-[#8CB350]">새로운 인연을 만나다</span>
                    </h1>
                  </div>
                  <p className="text-lg md:text-xl text-slate-600 max-w-full md:max-w-2xl md:mx-auto md:text-center xl:mx-0 xl:text-left break-words">
                    따뜻하고 안전한 소셜 네트워킹 플랫폼으로<br />50세 이상 분들을 위한
                    의미 있는 만남과 소통을 제공합니다.
                  </p>
                  <p className="text-base text-slate-500 max-w-full md:max-w-xl md:mx-auto md:text-center xl:mx-0 xl:text-left break-words">
                    AI 기반 인연 추천부터 접근성 최적화까지<br />누구나 편리하게 사용할 수 있도록
                    설계된 앱입니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                  <a
                    href="#"
                    onClick={handleAppDownload}
                    className="inline-flex items-center gap-2 rounded-full bg-[#8CB350] px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#7BA340] hover:shadow-xl"
                  >
                    앱 다운로드
                    <Download className="h-5 w-5" />
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#534741] px-6 py-4 text-base font-semibold text-[#534741] transition hover:bg-[#534741] hover:text-white"
                  >
                    주요 기능 알아보기
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div className="relative mt-10 md:mt-12 xl:mt-0 flex flex-col md:flex-row gap-4 justify-center items-center">
                <Image
                  src="/apppreview1.png"
                  alt="다시, 봄 앱 미리보기 1"
                  width={300}
                  height={533}
                  className="w-full object-contain max-w-[280px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[340px]"
                  priority
                />
                <Image
                  src="/apppreview2.png"
                  alt="다시, 봄 앱 미리보기 2"
                  width={300}
                  height={533}
                  className="w-full object-contain max-w-[280px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[340px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="fade-in-section mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
          data-animate="fade"
        >
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8CB350] mb-3">
              주요 기능
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#534741] mb-4">
              따뜻하고 안전한 경험
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              50세 이상 분들을 위해 특별히 설계된 기능들로, 편리하고 안전하게 사용하실 수 있습니다.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {appFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8CB350]/10 mb-4">
                    <Icon className="h-6 w-6 text-[#8CB350]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#534741] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section
          className="fade-in-section bg-gradient-to-br from-[#534741] to-[#3A3329] py-20 text-white"
          data-animate="fade"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
                  왜 다시, 봄인가요?
                </p>
                <h2 className="text-3xl md:text-4xl font-bold">
                  누구나 쉽게, 안전하게
                </h2>
                <p className="text-lg text-white/80">
                  기술의 복잡함 없이, 사람과의 따뜻한 연결에 집중합니다.
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-[#8CB350] flex-shrink-0 mt-0.5" />
                    <p className="text-base text-white/90">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Patents Section */}
        <section
          id="patents"
          className="fade-in-section bg-gradient-to-br from-slate-50 to-white py-20"
          data-animate="fade"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8CB350] mb-3">
                특허 출원 기술
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#534741] mb-4">
                특허 수준의 보안 기술로 여러분을 보호합니다
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                다시, 봄은 특허 출원된 독자적인 보안 기술로 사용자의 안전을 최우선으로 합니다. 
                금융권 수준의 보안 아키텍처와 AI 기반 실시간 위협 탐지 시스템을 통해 
                스캠과 피싱으로부터 여러분을 보호합니다.
              </p>
            </div>
       
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl border-2 border-[#8CB350]/30 bg-white p-8 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-start gap-6 mb-6">
                  
                  <div className="flex-1">    
                    <span className="inline-flex items-center rounded-full bg-[#8CB350] px-4 py-1.5 mb-3 text-xs font-semibold text-white whitespace-nowrap">
                      Patent Pending
                    </span>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-[#534741] mb-1">
                          {mainPatent.title}
                        </h3>
                        <p className="text-sm text-slate-500 mb-3 italic">
                          {mainPatent.titleEn}
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                          {mainPatent.description}
                        </p>
                      </div>
                  
                    </div>
                    <div className={`grid gap-4 pt-4 border-t border-slate-200 ${mainPatent.showApplicationNumber ? 'grid-cols-3' : 'grid-cols-2'}`}>
                      {mainPatent.showApplicationNumber && (
                        <div>
                          <span className="text-xs text-slate-500">출원번호</span>
                          <p className="text-sm font-medium text-slate-700 mt-1">
                            {mainPatent.applicationNumber}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-xs text-slate-500">출원일</span>
                        <p className="text-sm font-medium text-slate-700 mt-1">
                          {mainPatent.applicationDate}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500">상태</span>
                        <p className="text-sm font-semibold text-[#8CB350] mt-1">
                          {mainPatent.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t-2 border-slate-200">
                  <h4 className="text-lg font-semibold text-[#534741] mb-4">
                    주요 청구항
                  </h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    {mainPatent.claims.map((claim, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8CB350]/20 text-xs font-semibold text-[#8CB350] flex-shrink-0">
                            {index + 1}
                          </span>
                          <h5 className="text-sm font-semibold text-[#534741]">
                            {claim.title}
                          </h5>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed ml-8">
                          {claim.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section
          id="download"
          className="fade-in-section mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
          data-animate="fade"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#8CB350]/10 to-[#534741]/5 border-2 border-[#8CB350]/20 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#534741] mb-4">
              지금 시작하세요
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              다시, 봄과 함께 새로운 인연과 따뜻한 소통을 시작해보세요.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#"
                onClick={handleAppDownload}
                className="inline-flex items-center gap-2 rounded-full bg-[#534741] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#3A3329] hover:shadow-xl"
              >
                <Download className="h-5 w-5" />
                앱 다운로드
              </a>
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#534741] px-8 py-4 text-base font-semibold text-[#534741] transition hover:bg-[#534741] hover:text-white"
              >
                개인정보처리방침 보기
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className="fade-in-section bg-slate-50 py-20"
          data-animate="fade"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#534741] mb-4">
                문의하기
              </h2>
              <p className="text-lg text-slate-600">
                궁금한 점이 있으시면 언제든지 연락주세요.
              </p>
            </div>
            <div className="max-w-md mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-3 text-slate-600">
                <Mail className="h-5 w-5 text-[#8CB350]" />
                <a
                  href="mailto:hangyeolryu@gmail.com"
                  className="text-base hover:text-[#8CB350] transition-colors"
                >
                  hangyeolryu@gmail.com
                </a>
              </div>
              <p className="text-sm text-slate-500">
                계정 삭제, 개인정보 관련 문의도<br />위 이메일로 연락주시면 빠르게 도와드리겠습니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src="/logo_icon.svg"
                  alt="다시, 봄 로고"
                  width={24}
                  height={26}
                  className="h-6 w-auto"
                />
                <span className="text-lg font-semibold text-[#534741]">
                  다시, 봄
                </span>
              </div>
              <div>
                <a
                  href="https://effeffcorp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-[#534741] hover:text-[#8CB350] transition-colors inline-block"
                >
                  EFFEFF Co., Ltd
                </a>
                <p className="text-sm text-slate-600 italic mt-1">
                  Driven by Efficiency, Proven by Effect.
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-medium text-[#534741]">(주)이프이프</p>
              <p>사업자등록번호: 466-81-04205</p>
              <p>대표이사: RYU HAN GYEOL (유한결)</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm md:justify-end">
              <Link href="/privacy" className="text-slate-500 hover:text-[#8CB350] transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-[#8CB350] transition-colors">
                이용약관
              </Link>
              <Link href="/security-processing" className="text-slate-500 hover:text-[#8CB350] transition-colors">
                보안·행동 데이터 처리
              </Link>
              <Link href="/delete-account" className="text-slate-500 hover:text-[#8CB350] transition-colors">
                계정삭제
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-400 text-center">
              © 2026{" "}
              <a
                href="https://effeffcorp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#8CB350] transition-colors"
              >
                EFFEFF Co., Ltd
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
