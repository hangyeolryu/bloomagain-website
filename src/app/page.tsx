"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Hand, 
  Users, 
  Lock, 
  Sprout, 
  Shield, 
  Accessibility, 
  Bot,
  MessageCircle,
  HeartCrack,
  Zap,
  Target,
  AlertTriangle,
  XCircle,
  Search,
  Palette,
  Pointer,
  Mic,
  Heart,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFE38A] to-[#FFF51B]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#534741]">다시, 봄</h1>
              <span className="ml-2 text-sm text-gray-500">Dasi, Bom</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-900 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  홈
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  이용약관
                </Link>
                <Link href="/delete-account" className="text-gray-500 hover:text-[#8CB350] px-3 py-2 rounded-md text-sm font-medium">
                  계정삭제
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Logo Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 opacity-25">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
          <div className="absolute bottom-20 left-10 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 opacity-30">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon_reverse.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 md:w-28 md:h-28 opacity-20">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 md:w-24 md:h-24 opacity-25">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon_reverse.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 md:w-28 md:h-28 opacity-20">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
          <div className="absolute top-1/4 left-1/3 w-16 h-16 md:w-24 md:h-24 opacity-25">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon_reverse.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
          <div className="absolute bottom-10 right-1/4 w-16 h-16 md:w-20 md:h-20 opacity-20">
            <div className="w-full h-full" style={{ backgroundImage: "url('/logo_icon.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-[#8CB350]">다시, 봄</span>
                <span className="block text-[#534741]">Dasi, Bom</span>
              </h1>
              <p className="mt-3 text-base text-gray-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                50세 이상을 위한 따뜻한 동반자 앱
              </p>
              <p className="mt-2 text-lg text-gray-700">
                부담 없이, 천천히 이어지는 친구
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#534741] bg-[#8CB350] hover:bg-[#7BA044] md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    앱 다운로드
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#534741] bg-[#BFE38A] hover:bg-[#ABD077] md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    더 알아보기
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full rounded-lg overflow-hidden">
                  <div className="p-8">
                    <div className="text-center">
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3 p-3 bg-[#BFE38A] rounded-lg">
                          <Hand className="w-6 h-6 text-[#534741]" />
                          <div className="text-left">
                            <h4 className="font-semibold text-[#534741]">인사하기</h4>
                            <p className="text-sm text-gray-700">스와이프 없이 부담 없이</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-3 p-3 bg-[#8CB350] rounded-lg">
                          <Users className="w-6 h-6 text-white" />
                          <div className="text-left">
                            <h4 className="font-semibold text-white">소규모 서클</h4>
                            <p className="text-sm text-white/90">최대 12명의 관심사 기반 모임</p>
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#BFE38A] hover:bg-[#ABD077] text-[#534741] rounded-lg transition-all text-base font-semibold border-2 border-[#8CB350] shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Heart className="w-5 h-5" />
              <span>부모님께 추천하시는 분들께</span>
            </button>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg border-2 border-[#534741] hover:border-[#635953] transition-all cursor-pointer">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[#534741] rounded-md shadow-lg">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">나이 확인</h3>
                    <p className="mt-5 text-base text-gray-500">
                      50세 이상만 사용 가능한 안전한 공간
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg border-2 border-[#8CB350] hover:border-[#7BA044] transition-all cursor-pointer">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[#8CB350] rounded-md shadow-lg">
                      <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">부드러운 발견</h3>
                    <p className="mt-5 text-base text-gray-500">
                      스와이프 없이 인사하기, 서클 초대, 커피챗 제안
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg border-2 border-[#BFE38A] hover:border-[#ABD077] transition-all cursor-pointer">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[#BFE38A] rounded-md shadow-lg">
                      <Users className="w-6 h-6 text-[#534741]" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">소규모 서클</h3>
                    <p className="mt-5 text-base text-gray-500">
                      최대 12명의 관심사 기반 소규모 모임
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[#FFF51B] rounded-md shadow-lg">
                      <span className="text-2xl">🎵</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">음성 메시지</h3>
                    <p className="mt-5 text-base text-gray-500">
                      쉬운 음성 메모 기능
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg border-2 border-[#8CB350] hover:border-[#7BA044] transition-all cursor-pointer">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[#8CB350] rounded-md shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">안전 우선</h3>
                    <p className="mt-5 text-base text-gray-500">
                      차단, 신고, 편안함 설정
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg border-2 border-[#BFE38A] hover:border-[#ABD077] transition-all cursor-pointer">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[#BFE38A] rounded-md shadow-lg">
                      <Accessibility className="w-6 h-6 text-[#534741]" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">접근성</h3>
                    <p className="mt-5 text-base text-gray-500">
                      큰 글씨, 고대비, 음성 지원
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <a href="#scam-detection" className="block">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg border-2 border-[#8CB350] hover:border-[#7BA044] transition-all cursor-pointer">
                    <div className="-mt-6">
                      <div className="inline-flex items-center justify-center p-3 bg-[#8CB350] rounded-md shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">AI 사기 감지</h3>
                      <p className="mt-5 text-base text-gray-500">
                        실시간 AI 기반 사기 행위 자동 감지 및 차단
                      </p>
                      <p className="mt-3 text-sm text-[#8CB350] font-medium">
                        자세히 보기 →
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scam Detection Section */}
      <section id="scam-detection" className="py-16 bg-gradient-to-br from-[#BFE38A] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              AI 기반 지능형 사기 감지 시스템
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              대화 패턴 분석을 통한 선제적 사기 방지로 안전한 만남을 보장합니다
            </p>
          </div>

          <div className="mt-16">
            {/* Main Features */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-16">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <MessageCircle className="w-8 h-8 mr-4 text-[#8CB350]" />
                  <h3 className="text-xl font-bold text-gray-900">대화 맥락 분석</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  최근 20개 메시지를 분석하여 전체 대화 흐름을 파악합니다. 단일 메시지가 아닌 대화 패턴 전체를 평가하여 정확도를 높입니다.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">✓</span>
                    <span>대화 히스토리 전체를 고려한 종합 분석</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">✓</span>
                    <span>시간 경과에 따른 패턴 변화 추적</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <HeartCrack className="w-8 h-8 mr-4 text-[#534741]" />
                  <h3 className="text-xl font-bold text-gray-900">로맨스 사기 감지</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  로맨스 사기 전형적인 패턴을 자동으로 감지합니다:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span>러브밤빙: 초반 과도한 감정 표현</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span>금전 요청: 감정 유대 후 금전적 도움 요청</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span>급속한 관계 발전: 빠른 결혼/미래 약속</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span>회피 패턴: 화상 통화나 만남 지속적 회피</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 mr-4 text-[#8CB350]" />
                  <h3 className="text-xl font-bold text-gray-900">패턴 감지</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  여러 메시지에 걸친 행동 패턴을 분석합니다:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">•</span>
                    <span><strong>급속한 관계 발전:</strong> 3일 이내 사랑 고백/결혼 언급</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">•</span>
                    <span><strong>금전 요청 패턴:</strong> 러브밤빙 후 금전적 도움 요청</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">•</span>
                    <span><strong>긴급 상황 악용:</strong> 응급 상황 후 금전 요청</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">•</span>
                    <span><strong>반복적 회피:</strong> 화상 통화/만남 다회 회피</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#8CB350] mr-2">•</span>
                    <span><strong>과도한 메시징:</strong> 24시간 내 10개 이상 메시지 + 러브밤빙</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 mr-4 text-[#534741]" />
                  <h3 className="text-xl font-bold text-gray-900">스마트 점수 시스템</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  다층 점수 시스템으로 정확한 판단을 제공합니다:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span><strong>로맨스 사기 점수:</strong> 로맨스 사기 전용 점수</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span><strong>대화 맥락 점수:</strong> 대화 패턴 기반 추가 점수</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span><strong>낮은 임계값:</strong> 로맨스 사기는 위험 점수 4점 이상 시 차단</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#534741] mr-2">•</span>
                    <span><strong>종합 분석:</strong> 모든 점수를 결합하여 최종 판단</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Detection Examples */}
            <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">감지 시나리오 예시</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-l-4 border-[#534741] pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">로맨스 사기 패턴</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>1일차: &ldquo;사랑해요&rdquo;</li>
                    <li>2일차: &ldquo;병원에 있어요&rdquo;</li>
                    <li>3일차: &ldquo;도와줘요, 돈이 필요해요&rdquo;</li>
                    <li className="text-[#534741] font-semibold mt-2">→ 차단됨</li>
                  </ul>
                </div>
                <div className="border-l-4 border-[#8CB350] pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">급속한 관계 발전</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>3일 이내: &ldquo;사랑해&rdquo;, &ldquo;결혼&rdquo;, &ldquo;영원히 함께&rdquo;</li>
                    <li className="text-[#8CB350] font-semibold mt-2">→ 경고</li>
                  </ul>
                </div>
                <div className="border-l-4 border-[#FFF51B] pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">반복적 회피</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>화상 통화나 만남 회피 반복</li>
                    <li className="text-[#534741] font-semibold mt-2">→ 경고</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Protection Levels */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">단계별 보호 시스템</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FFF51B]/30 border-2 border-[#FFF51B] rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-6 h-6 mr-2 text-[#534741]" />
                    <h4 className="text-lg font-bold text-gray-900">중간 위험</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">위험 점수 ≥ 10 또는 사기 감지 ≥ 3회</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 관리자 알림 생성</li>
                    <li>• 검토 대기</li>
                  </ul>
                </div>
                <div className="bg-[#BFE38A]/50 border-2 border-[#8CB350] rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <Shield className="w-6 h-6 mr-2 text-[#8CB350]" />
                    <h4 className="text-lg font-bold text-gray-900">높은 위험</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">위험 점수 ≥ 20 또는 사기 감지 ≥ 5회</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 계정 제한 (그림자 차단)</li>
                    <li>• 발견 기능 비활성화</li>
                    <li>• 다른 사용자에게 보이지 않음</li>
                  </ul>
                </div>
                <div className="bg-[#534741]/10 border-2 border-[#534741] rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <XCircle className="w-6 h-6 mr-2 text-[#534741]" />
                    <h4 className="text-lg font-bold text-gray-900">심각한 위험</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">위험 점수 ≥ 50 또는 사기 감지 ≥ 10회</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 계정 정지</li>
                    <li>• 메시지 전송 불가</li>
                    <li>• 대화 생성 불가</li>
                    <li>• 모든 활동 제한</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Section */}
      <section className="py-16 bg-[#BFE38A]/30">
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
              <div className="inline-flex items-center justify-center p-3 bg-[#8CB350] rounded-full">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">큰 글씨</h3>
              <p className="mt-2 text-base text-gray-500">큰 글씨 모드 지원</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-[#534741] rounded-full">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">고대비</h3>
              <p className="mt-2 text-base text-gray-500">고대비 테마 제공</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-[#FFF51B] rounded-full">
                <Pointer className="w-6 h-6 text-[#534741]" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">터치 영역</h3>
              <p className="mt-2 text-base text-gray-500">48dp 이상의 터치 영역</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-3 bg-[#BFE38A] rounded-full">
                <Mic className="w-6 h-6 text-[#534741]" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">음성 지원</h3>
              <p className="mt-2 text-base text-gray-500">음성 입력 및 텍스트 읽기</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-[#534741]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              지금 시작하세요
            </h2>
            <p className="mt-4 text-lg text-[#BFE38A]">
              50세 이상을 위한 따뜻한 동반자 앱
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#534741] bg-[#FFF51B] hover:bg-[#E6E617] md:py-4 md:text-lg md:px-10 transition-colors"
              >
                App Store에서 다운로드
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-[#635953] md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Google Play에서 다운로드
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center p-2 bg-[#BFE38A] rounded-full">
                  <Heart className="w-6 h-6 text-[#534741]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  부모님께 추천하시는 분들께
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-8">
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p className="text-base md:text-lg leading-relaxed">
                  부모님께 &ldquo;다시, 봄&rdquo;을 추천해주시는 마음 깊이 감사드립니다. 이 앱은 50세 이상 어르신들을 위해 특별히 설계되었습니다.
                </p>
                <div className="bg-[#FFF51B]/20 rounded-lg p-6 mt-6 border-l-4 border-[#FFF51B]">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">앱을 추천할 때 알려주세요:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                    <li className="flex items-start">
                      <span className="text-[#8CB350] mr-2 mt-1">•</span>
                      <span>부드러운 소셜 네트워킹: 스와이프 없이 천천히 만남을 이어갑니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8CB350] mr-2 mt-1">•</span>
                      <span>안전한 공간: 실시간 AI 사기 감지와 강력한 보안 기능으로 보호됩니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8CB350] mr-2 mt-1">•</span>
                      <span>접근성 우선: 큰 글씨, 고대비, 음성 지원으로 누구나 쉽게 사용할 수 있습니다</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#8CB350] mr-2 mt-1">•</span>
                      <span>소규모 서클: 12명 이하의 관심사 기반 모임으로 부담 없이 만날 수 있습니다</span>
                    </li>
                  </ul>
                </div>
                <p className="text-base md:text-lg leading-relaxed mt-6 text-gray-600">
                  부모님께서 새로운 인연을 만나고 따뜻한 대화를 나누실 수 있도록 함께 응원해주세요. 처음 사용하시는 분들도 쉽게 시작할 수 있도록 도와드리겠습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#534741]">
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
                <Link href="/privacy" className="block text-gray-400 hover:text-[#BFE38A]">
                  개인정보처리방침
                </Link>
                <Link href="/terms" className="block text-gray-400 hover:text-[#BFE38A]">
                  이용약관
                </Link>
                <Link href="/delete-account" className="block text-gray-400 hover:text-[#BFE38A]">
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