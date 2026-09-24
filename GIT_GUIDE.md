# 팀원용 Git 실습 가이드

이 문서는 Git을 처음 사용하는 팀원이 VS Code 또는 IntelliJ IDEA에서 자기소개를 작성하고 Pull Request를 올리는 과정을 직접 연습하도록 만든 가이드입니다.

화면 캡처와 최소 명령어 흐름은 [팀원 실행 및 Git 최소 흐름 안내](./RUN_GUIDE.md)를 함께 봅니다.

## 목표

다음 흐름을 한 번 끝까지 실행합니다.

```text
clone -> branch -> edit -> status/diff -> commit -> push -> Pull Request
```

## 1. 저장소 내려받기

터미널을 열고 실행합니다.

```bash
git clone https://github.com/beyejin/team5-study-mate.git
cd team5-study-mate
```

이미 clone했다면 프로젝트 폴더로 이동합니다.

```bash
cd team5-study-mate
```

### 편집기에서 열기

원하는 편집기로 프로젝트 폴더를 엽니다. Git 명령어와 GitHub 작업은 어떤 편집기를 사용해도 같습니다.

#### VS Code

```bash
code .
```

`code: command not found`가 나오면 VS Code를 직접 열고 `File` → `Open Folder`를 선택한 뒤 `team5-study-mate` 폴더를 엽니다.

처음 열 때 아래쪽에 `Restricted Mode`가 표시되면, 본인이 clone한 저장소가 맞는지 확인한 뒤 `Trust`를 선택합니다. 신뢰하지 않아도 파일 편집은 가능하지만 일부 VS Code 기능이 제한됩니다.

#### IntelliJ IDEA

터미널에서 다음 명령어를 실행합니다.

```bash
idea .
```

`idea: command not found`가 나오면 IntelliJ IDEA를 직접 열고 `Open`을 선택한 뒤 `team5-study-mate` 폴더를 엽니다.

## 2. 내 작업 브랜치 만들기

`your-name`을 자신의 이름이나 GitHub 아이디로 바꿉니다.

```bash
git switch -c intro/your-name
```

브랜치는 내 작업 공간입니다. 팀원이 같은 파일을 동시에 고치는 충돌을 줄이기 위해 `main`에서 직접 작업하지 않습니다.

## 3. 자기소개 파일 만들기

```bash
cp team/TEMPLATE.md team/your-name.md
```

편집기에서 `team/your-name.md`를 열고 다음 내용을 작성합니다.

VS Code는 왼쪽 파일 탐색기에서 파일을 열고, IntelliJ IDEA는 왼쪽 `Project` 창에서 `team` 폴더와 파일을 선택합니다.

- 한 줄 소개
- 관심 분야
- 요즘 배우는 것
- 팀원들에게 보여주고 싶은 모습
- 나를 표현하는 키워드
- 공개해도 되는 GitHub 링크

전화번호, 개인 이메일과 같은 공개하지 않을 정보는 작성하지 않습니다.

## 4. 수정 내용 확인하기

```bash
git status
git diff
```

`git status`는 바뀐 파일을 확인하고, `git diff`는 실제 수정 내용을 확인하는 명령입니다.

## 5. commit 만들기

```bash
git add team/your-name.md
git commit -m "docs: 자기소개 작성"
```

`git add`는 commit할 파일을 선택하고, `git commit`은 내 컴퓨터에 변경 내용을 저장합니다.

## 6. GitHub에 push하기

```bash
git push -u origin intro/your-name
```

처음 push할 때는 GitHub 로그인이나 인증을 요청할 수 있습니다.

## 7. Pull Request 올리기

1. GitHub 저장소 페이지를 엽니다.
2. `Compare & pull request`를 선택합니다.
3. 제목을 `docs: 자기소개 작성`으로 적습니다.
4. 작성한 내용을 본문에 적습니다.
5. `Create pull request`를 누릅니다.

팀원이 내용을 확인하고 문제가 없으면 `main`에 반영합니다.

## 8. GitHub Project 만들어보고 삭제하기

이 단계에서 말하는 프로젝트는 Git 저장소가 아니라 GitHub의 칸반 보드인 `GitHub Projects`입니다. 기능을 익히기 위한 연습용 보드를 따로 만들고, 팀 과제 보드는 사용하지 않습니다.

### 연습용 프로젝트 만들기

1. GitHub 오른쪽 위 프로필 사진을 누릅니다.
2. `Your projects`를 열고 `New project`를 누릅니다.
3. `Board` 형식을 선택합니다.
4. 프로젝트 이름을 `Git 연습용 보드`로 입력하고 만듭니다.
5. 카드 하나를 추가하고 제목을 `Git 명령어 연습`으로 입력합니다.
6. 카드를 다른 상태로 옮겨 보면서 칸반 보드의 동작을 확인합니다.

### 연습용 프로젝트 삭제하기

1. 방금 만든 `Git 연습용 보드`를 엽니다.
2. 오른쪽 위 `...` 메뉴에서 `Settings`를 엽니다.
3. `Danger zone`에서 `Delete this project`를 누릅니다.
4. 안내된 입력란에 프로젝트 이름을 입력합니다.
5. 삭제 결과를 확인합니다.

프로젝트 삭제는 되돌릴 수 없으므로 반드시 이름이 `Git 연습용 보드`인지 확인합니다. `Team 5 팀원 소개 보드`는 과제 제출용 공식 보드이므로 삭제하거나 설정을 바꾸지 않습니다.

## 9. 최신 내용 받기

Pull Request가 반영된 뒤에는 최신 내용을 받습니다.

```bash
git switch main
git pull origin main
```

## 꼭 기억할 명령어

| 명령어 | 의미 |
| --- | --- |
| `git status` | 현재 상태 확인 |
| `git switch -c 이름` | 새 브랜치 만들고 이동 |
| `git add 파일명` | commit할 파일 선택 |
| `git commit -m "메시지"` | 변경 내용 저장 |
| `git push` | GitHub에 올리기 |
| `git pull origin main` | 최신 내용 받기 |
| `git diff` | 수정 내용 확인 |

## 문제가 생겼을 때

명령어를 계속 실행하기 전에 먼저 상태를 확인합니다.

```bash
git status
git branch --show-current
git log --oneline -5
```

파일을 잘못 수정했거나 명령어가 헷갈리면 결과 화면을 팀원에게 공유합니다. 혼자서 `reset --hard`나 강제 push를 실행하지 않습니다.

## 실습 완료 체크리스트

- [ ] 저장소를 clone했습니다.
- [ ] `intro/내이름` 브랜치를 만들었습니다.
- [ ] 자기소개 파일을 작성했습니다.
- [ ] `git status`와 `git diff`를 확인했습니다.
- [ ] commit을 만들었습니다.
- [ ] GitHub에 push했습니다.
- [ ] Pull Request를 올렸습니다.
