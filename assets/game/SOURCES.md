# 홈페이지 자산 출처

2026-09-10 구현에 사용한 자산입니다. 생성 이미지는 내장 imagegen 도구로 제작했으며 원본 시안을 유지하고 새 파일로 저장했습니다.

| 파일 | 출처와 용도 |
| --- | --- |
| [stadium-day-v1.png](./stadium-day-v1.png) | 기존 팩 선택 시안에서 UI와 팩을 제거한 경기장 배경 |
| [member-pack-v1.png](./member-pack-v1.png) | 같은 시안의 중앙 익명 팩을 분리한 투명 PNG |
| [yejin-orca-v2.png](./yejin-orca-v2.png) | 기존 범고래를 다른 캐릭터와 같은 손그림 스타일로 변환 |
| [cocone-school.svg](./cocone-school.svg) | [가천대학교 스타트업칼리지 공식 사이트](https://gcs.gachon.ac.kr/) 헤더의 81 × 24 SVG 원본. 도형을 수정하지 않았으며 힌트 화면에서 CSS로 흰색 표시 |
| [team5.svg](./team5.svg) | 팀 번호 5를 표시하는 프로젝트 자체 마크 |

강아지와 쿼카는 [기존 캐릭터 생성 기록](../character-candidates/prompts.md)을 참고합니다. 캐릭터는 지역 공식 마스코트가 아닙니다.

## 생성 프롬프트

### stadium

입력: assets/design-candidates/pack-selection-v1.png

```text
Use case: precise-object-edit. Asset type: production website background plate. Input image is edit target. Preserve the exact bright daytime stadium tunnel architecture, concrete floor, distant stadium seating, blue sky, viewpoint, lighting and neutral colors. Remove ALL foreground packs and their shadows, ALL text, branding, HUD, top horizontal line, cursor, selection brackets, slogans and user interface. Fill these regions naturally with uninterrupted concrete and stadium. Plain concrete sidewalls with no marks, no logos, no letters. Floor occupies lower half, distant green field visible around middle, symmetrical architectural perspective preserved. Empty stadium environment ONLY, no people or cards or objects in the foreground. Output a single wide 16:9 photograph-like 1920x1080 scene for overlaying interactive cards.
```

### pack

입력: assets/design-candidates/pack-selection-v1.png

```text
Use case: background-extraction. Asset type: interactive website card-pack sprite. Isolate only the single CENTRAL silver-and-ivory foil pack from the supplied reference. Keep its physical rectangular sealed foil silhouette, realistic fine creases, brushed silver and warm ivory, black and small brass diagonal accents, and exact front design with TEAM 5, large italic 5, MEMBER PACK. Exactly ONE unopened pack upright front-facing, not three. Preserve its design closely. No names, no initials or animal art. Remove all stadium, floor, shadows, cursor, brackets, HUD and UI. Genuinely transparent alpha background, no white or checkerboard baked in. Tight portrait framing with small even transparent margin, whole pack fully visible including top and bottom crimped foil seams. High resolution clean reusable product cutout.
```

### orca

입력: assets/yejin-orca.png, assets/character-candidates/daegu-dog-v1.png, assets/design-candidates/team-collection-v1.png

```text
Use case: style-transfer. Asset type: original orca mascot portrait for team introduction card. Image 1 is orca anatomy reference. Image 2 is drawing-style reference. Image 3 shows the approved target orca artwork on the right-hand card. Create ONLY the orca illustration from that card, not a card or UI. Friendly joyful black-and-white orca with natural flippers and tail, cheerful open mouth, distinctive white eye patch. Match the warm colored-pencil texture and confident hand-drawn dark ink lines of the supplied dog and the right-hand card reference. A few tiny pale-blue splash marks acceptable as in reference. Centered portrait, near-full body, fills 85 percent of square frame with all extremities visible. Plain warm-white background matching dog image. No text, clothes, human limbs, borders, badges, scores, blue neon, black background, 3D photorealism or card frame. Preserve recognizable orca identity and make a visually consistent character set.
```

