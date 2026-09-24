# TEAM 5 | 멤버 팩

> 팩을 열고 힌트를 따라가며 세 명의 팀원을 한 명씩 발견하는 인터랙티브 팀 소개 페이지입니다.

[GitHub Pages 데모](https://beyejin.github.io/team5-study-mate/) | [GitHub 저장소](https://github.com/beyejin/team5-study-mate)

> **DB 과제 제출 문서**: [TEAM 5 Kanban DB 보기](docs/kanban-db-project.md) · [개념 ERD](docs/kanban-erd.md)

![TEAM 5 멤버 팩 시작 화면](./assets/game/team5-intro-v2.png)

## 발표 한 문장

Team 5는 자기소개를 목록으로 보여주는 대신, 멤버 팩을 열고 힌트를 따라가며 팀원을 발견하는 경험으로 바꿨습니다.

## 발표 구성

발표는 인트로 소개, 팀원별 30초 자기소개, 협업 방식 소개 순서로 진행합니다.

1. **인트로 소개**: Team 5와 멤버 팩의 기획 의도를 설명합니다.
2. **김영광 자기소개 30초**: 팩을 열고 힌트를 확인한 뒤 카드와 자기소개를 소개합니다.
3. **엄태웅 자기소개 30초**: 다음 팩으로 바로 이어서 카드와 자기소개를 소개합니다.
4. **한예진 자기소개 30초**: 마지막 팀원 카드와 자기소개를 소개합니다.
5. **협업 방식 소개**: 세 명의 공개가 끝난 뒤 칸반 보드, GitHub Actions, 가이드 문서를 보여줍니다.

## 핵심 구현

- 팀원 세 명을 중복 없이 한 번씩 공개합니다.
- 세 단계 힌트를 팀원별 Markdown 원본에서 읽습니다.
- 카드 공개 후 발표자가 팀원 자기소개를 말로 이어갑니다.
- 마지막 화면에는 칸반 보드와 실제 협업 기록만 간결하게 보여줍니다.
- GitHub Actions로 테스트와 배포를 자동화하고, `GIT_GUIDE.md`로 브랜치와 PR 작업 기준을 공유합니다.
- 첫 화면 효과음, 힌트 사운드, 카드 공개 사운드를 제공합니다.
- `Escape`와 `연출 건너뛰기`로 공개 연출을 건너뛸 수 있습니다.

## 팀원 소개

| 순서 | 팀원 | 자기소개 원본 |
| --- | --- | --- |
| 01 | 김영광 | [김영광.md](./team/김영광.md) |
| 02 | 엄태웅 | [엄태웅.md](./team/엄태웅.md) |
| 03 | 한예진 | [한예진.md](./team/한예진.md) |

홈페이지는 자기소개 원본을 `team/*.md`에서 읽습니다. 내용을 수정한 뒤 로컬 서버를 새로고침하면 화면에 반영됩니다.

## 팀원 자기소개 작성 안내

모든 팀원은 [자기소개 템플릿](./team/TEMPLATE.md)을 기준으로 자신의 Markdown 파일을 작성합니다.

```bash
git switch -c intro/<이름>
cp team/TEMPLATE.md team/<이름>.md
```

이미 파일이 있다면 복사하지 말고 해당 파일을 열어 아래 항목을 채웁니다.

- 프로필 카드: 이미지, KAI 점수, MBTI, 태그
- 한 줄 소개
- 관심 분야
- 요즘 배우는 것
- 팀원들에게 보여주고 싶은 모습
- 나를 표현하는 키워드
- 공개해도 되는 GitHub 링크

작성 후에는 다음 순서로 팀에 공유합니다.

```bash
git add team/<이름>.md
git commit -m "docs: 자기소개 작성"
git push -u origin intro/<이름>
```

전화번호, 개인 이메일처럼 공개하지 않을 정보는 넣지 않습니다.

## 협업 흐름

```text
Clone → Branch → Markdown 작성 → Commit → Push → Pull Request → Review → Merge → Actions 배포
```

- [팀원용 Git 실습 가이드](./GIT_GUIDE.md)
- [팀원 실행 및 Git 최소 흐름 안내](./RUN_GUIDE.md)
- [화면 캡처 폴더](./docs/screenshots/)

## 발표용 실행 방법

Markdown 프로필을 화면에 불러오기 위해 정적 서버로 실행합니다.

```bash
python3 -m http.server 8000
```

브라우저에서 [http://localhost:8000](http://localhost:8000)을 열고 다음 순서로 시연합니다.

```text
인트로 소개 → 팩 선택 → 팀원별 30초 자기소개 → 세 명 공개 → 협업 방식 소개
```

## 사용 기술

- HTML
- CSS
- JavaScript ES Modules
- Markdown 기반 프로필 데이터
- Web Audio API 기반 사운드
- GitHub Pages

## 주요 파일

```text
.
├── index.html          # 로비, 터널, 카드 공개, 작업 방식 화면
├── styles.css          # 경기장, 터널, 카드와 스카우팅 리포트 스타일
├── script.js           # 팩 공개 흐름과 화면 전환
├── profiles.mjs        # 팀원 Markdown 파싱
├── team/               # 팀원 자기소개 원본
├── assets/             # 카드, 경기장, 사운드 자산
├── tests/              # 프로필, 공개 흐름, 사운드 테스트
└── dist/               # 정적 배포 산출물
```

## 관련 링크

- [발표용 GitHub Pages](https://beyejin.github.io/team5-study-mate/)
- [GitHub 저장소](https://github.com/beyejin/team5-study-mate)
- [Team 5 과제 보드](https://github.com/users/beyejin/projects/1)
- [과제 결과물 마일스톤](https://github.com/beyejin/team5-study-mate/milestone/1)
- [자기소개 템플릿](./team/TEMPLATE.md)
