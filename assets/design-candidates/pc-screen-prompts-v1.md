# PC 발표용 카드 시안 생성 프롬프트

제작 방식: 내장 이미지 생성 도구

## 카드 공개

학교 로고, 학과, 등장 키워드가 순서대로 나타난 후의 카드 공개 장면입니다. 중간 힌트 연출은 이 정적 이미지에 포함되어 있지 않습니다.

[결과](./member-reveal-v1.png)

```text
Use case: compositing, ui-mockup.
Edit the supplied website design reference to show the NEXT SCREEN STATE of the same desktop team-introduction experience. Generate one separate horizontal 16:9 full-viewport screenshot only, no browser chrome, no device, no collage, no extra section.

Input image 1 is the existing pack-selection website: preserve its stadium architecture, viewpoint, TEAM 5 crest, restrained white/silver/brass sports identity, Korean typography and slim header hierarchy. It is a layout and environment edit target.
Input image 2 is the supplied hand-drawn dog mascot: insert this exact character as the artwork on the revealed team card, preserving cream-and-tan fur, one upright ear and one bent ear, happy expression, curled tail, red-and-cream varsity jacket, hand-drawn colored-pencil texture. Preserve the specific friendly character identity.

Screen state: one member has just been revealed. Remove all three unopened foil packs and the pack-selection instruction. Briefly dim the same stadium environment as if stadium spotlights are concentrating on a new player, with a controlled warm-white overhead spotlight hitting ONE very large upright collectible card. Keep the architecture recognizable and its original neutral palette, not a different sci-fi room. Background is muted charcoal, still visibly the same stadium; the spotlight circle softly illuminates the concrete floor. The bright silver-and-ivory card is the clear focal point. Dramatic but tasteful, no confetti, no glowing particles, no rainbow or neon rims.

The user will present this on a PC, so use a large easy-to-read card around 500px wide by 690px high in a 1920x1080 viewport. Center it around x=960, y=515. Give the card an original restrained sports collectible silhouette: gently shaped shoulder corners and a softly tapered base, warm-white paper face, narrow brushed-silver border, small brass accent echoing the anonymous pack graphics. No baroque fantasy frame. A clean physical card with subtle material depth, not a flat UI rectangle.

Card hierarchy, with exact text:
Top-left compact label "KAI" above large "90".
Top-right compact label "MBTI" above large "INFP".
These are two named profile fields, not football stats, not an overall player rating. No other scores.
Large dog mascot art fills the upper-middle of the card, cleanly integrated into the warm-white paper; keep ears and expressive upper-body pose visible. The face is visually dominant and the character stays hand-drawn.
Below the artwork: bold dark Korean member name "김영광".
Below the name: the one-line intro "한 번 물면 놓치지 않는 광견".
Below a fine rule: three readable inline individual tags "#대구청년" "#Glory" "#초긍정". Treat them like understated printed labels or small flat chips with generous separation, not numerical abilities.
Small TEAM 5 mark can sit at the foot of the card.

Header: preserve small circular 5 crest plus "TEAM 5" at left, now light ink suitable for the dimmed background; right progress reads exactly "팀원 1 / 3". No giant heading over the card. Bottom safe area: one clean high-contrast light rectangular button labeled exactly "다음 팩 고르기" with a small right-pointing arrow. The action is controlled by the presenter; do not imply an auto-advance countdown. Do not include other people's names or hidden card identities.

Keep type readable at presentation distance, beautifully spaced, crisp and convincing as a real interactive screen. Use Pretendard-like Korean sans typography and restrained athletic lettering. Typography should not be miniature. No extra copy, no fake English slogans on stadium walls: make wall surfaces plain or softly obscured. No fake ranks, no PAC/SHO/PAS/DRI/DEF/PHY, no six invented ability scores, no extra overall number, no MBTI-derived personality assertions, no split screen, no side panels, no unrelated website navigation.
```

## 세 명의 카드 모음

[결과](./team-collection-v1.png)

태웅님의 `#웃음`은 캐릭터 요청에서 가져온 시안용 태그입니다. 세부 자기소개는 md 업로드 후 반영합니다.

```text
Use case: compositing, ui-mockup.
Create the final COLLECTION STATE of the same Korean TEAM 5 desktop presentation website, as ONE separate horizontal 16:9 full-viewport screenshot, no browser chrome, no device, no collage, no multiple states, no extra page sections.

Input 1 is the revealed Kim Yeonggwang card screen: preserve the precise card silhouette, silver-and-ivory paper treatment, small brass and charcoal athletic corner stripes, field typography, TEAM 5 branding, and dog character. Use it as the shared card-template and environment reference.
Input 2 is the initial pack-selection screen: restore its bright natural DAYLIGHT lighting on the same recognizable stadium passage and concrete floor. This final screen is bright again, not the dark reveal state.
Input 3 is the laughing quokka character to insert on Eom Taewoong's card: preserve its round ears, brown and cream fur, eyes happily closed, joyful open smile, belly-holding and greeting paw pose, and colored-pencil hand-drawn quality.
Input 4 is an orca identity reference for Han Yejin. Adapt ONLY this animal's rendering into the same hand-drawn ink and colored-pencil style as the quokka and dog; preserve the distinctive black and white orca anatomy, broad rounded head, white underside and eye patch, visible flippers and dorsal fin. Make a warm friendly animal portrait. No photoreal sheen, no blue glow, no black background within the card. Do not put clothes on the orca and do not give it legs. Keep all three animal artworks in a visually consistent illustrated card set.

Overall composition for a PC presentation: slim 68px HUD, compact black heading below it, three large fully revealed collectible cards arranged side-by-side at equal size and visual importance on the same bright stadium floor. Same card height, width, border, rarity appearance and field positions for all three. Approximately 430px wide by 620px high each on a 1920x1080 viewport, generous gaps and outer margins, all fully visible. Slight believable physical card depth and soft contact shadows. No perspective overlap hiding information. Header left circular 5 crest and "TEAM 5", header right exact progress text "팀원 3 / 3". Heading near upper-left below the header: "우리 팀을 소개합니다".

Three card contents, EXACT spelling and exact matching values:
LEFT CARD:
Top-left label "KAI" above large "119".
Top-right label "MBTI" above "ENTP".
Character: provided laughing quokka.
Large name below artwork: "엄태웅".
One small individual tag: "#웃음".
No invented extra tags and no biography text, because this person's written introduction is still pending.

CENTER CARD:
Top-left label "KAI" above large "90".
Top-right label "MBTI" above "INFP".
Character: the same happy cream-and-tan dog in its brick-red and cream varsity jacket from Input 1.
Large name: "김영광".
Three individual tags: "#대구청년" "#Glory" "#초긍정".

RIGHT CARD:
Top-left label "KAI" above large "105".
Top-right label "MBTI" above "ENTP".
Character: the orca adapted into the same illustrated style.
Large name: "한예진".
Three individual tags: "#문제관찰" "#실행력" "#감응력".

Keep card templates consistent. This is the compact overview state: omit one-line biography text from ALL three cards, making the artwork, common KAI and MBTI fields, name and differing individual tags highly readable. The cards are interactive entry points for the longer written profiles. No six standardized ability scores, no PAC or other football statistics, no overall rating, no tiers, no rankings and no personality claims inferred from MBTI. Small TEAM 5 footer mark on every card.

Below the card row, in generous safe space, center the short instruction "카드를 누르면 자세한 소개를 볼 수 있어요." Each card itself is the click target. A restrained text action "다시 뽑기" with a small refresh arrow may sit at bottom-right, visually secondary to the collection. No large global CTA competing with the team cards.

Environment: restore the bright white and light-gray concrete stadium with soft distant seating and green pitch. Keep the stadium walls plain and remove extraneous English advertising slogans from the source; preserve natural architecture and subdued material texture. Airy, convincing daylight, not washed-out unreadable contrast. Korean grotesk typography like Pretendard, genuinely readable captions and labels. The main visual is the collection itself, not a gigantic marketing headline.
No generated filler text, no arbitrary numbers, no extra faces or cards, no floating particles, no neon, no glass panels, no sci-fi chamber, no new decorative sections, no watermark.
```

