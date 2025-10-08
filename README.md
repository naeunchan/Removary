# Removary

나만의 30일 만료 다이어리 애플리케이션입니다. Expo 기반의 React Native 앱으로, 작성한 다이어리 항목은 30일 동안만 보관되고 시간이 지나면 자동으로 삭제됩니다.

## 주요 기능
- 제목과 내용을 입력하여 새로운 다이어리 작성
- `AsyncStorage`를 활용한 로컬 영구 저장
- 앱 실행 시 30일 이상 지난 항목 자동 정리
- 잔여 시간(일/시간/분 단위) 표시
- 개별 항목 삭제

## 개발 환경
- React Native + Expo (SDK 51)
- AsyncStorage (`@react-native-async-storage/async-storage`)
- TypeScript

## 실행 방법
1. 의존성 설치
   ```bash
   npm install
   # 또는
   yarn install
   ```
2. Expo 개발 서버 실행
   ```bash
   npm run start
   ```
3. iOS 시뮬레이터, Android 에뮬레이터, Expo Go 앱 등에서 앱을 확인하세요.

## 구조
- `App.tsx`: Expo 앱 엔트리, 화면을 렌더링합니다.
- `src/screens/HomeScreen.tsx`: 다이어리 메인 화면 구성.
- `src/components/*`: 헤더, 작성 폼, 목록 등 재사용 가능한 UI 컴포넌트.
- `src/hooks/useDiaryEntries.ts`: 30일 만료 로직과 AsyncStorage 상태 관리 훅.
- `src/utils/time.ts`: 시간 계산 유틸리티.
- `app.json`, `babel.config.js`, `package.json`: 프로젝트 설정 및 스크립트.
- `tsconfig.json`: TypeScript 컴파일러 설정.
